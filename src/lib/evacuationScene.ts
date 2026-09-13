import * as THREE from "three";
import {
  CrowdModel,
  DEFAULT_PARAMS,
  LAYOUTS,
  SCALE,
  type Layout,
  type ModelParams,
  type ModelTelemetry,
  type Strategy,
} from "./crowdModel";

const MAX_AGENTS = 320;

/**
 * Cheap probe for WebGL before we commit to building a scene. Some older
 * Android browsers and locked-down corporate machines have no context to give.
 */
export function webglAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    if (!gl) return false;
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/** A sensible starting crowd for the device, so phones don't open at 200. */
export function defaultPopulationFor(width: number): number {
  if (width < 640) return 90;
  if (width < 1024) return 140;
  return 200;
}

export const STRATEGY_COLORS: Record<Strategy, string> = {
  "follow-others": "#7c93ff",
  "nearest-exit": "#3ed9ff",
  "calm-and-orderly": "#9aa8c7",
  "panic-rush": "#ff5e5b",
};

/**
 * Renders CrowdModel. All simulation logic lives in crowdModel.ts; this file
 * only turns model state into geometry, so the model stays headlessly testable.
 */
export class EvacuationScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private crowd: THREE.InstancedMesh;
  private hall = new THREE.Group();
  private pointerRing: THREE.Mesh;
  private dummy = new THREE.Object3D();
  private color = new THREE.Color();
  private strategyColor: Record<Strategy, THREE.Color>;

  private model: CrowdModel;
  private raycaster = new THREE.Raycaster();
  private floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  private pointer = new THREE.Vector2(-999, -999);
  private pointerActive = false;
  private pointerWorld = new THREE.Vector3(1e6, 0, 1e6);

  private running = false;
  private disposed = false;
  /** Rolling frame-time samples, used to back off resolution on weak GPUs. */
  private frameTimes: number[] = [];
  private lastFrame = 0;
  private dprStep = 0;
  private readonly dprLadder = [1.75, 1.35, 1.0];
  private width = 1;
  private lastReport = 0;
  private onTelemetry?: (t: ModelTelemetry) => void;

  constructor(
    canvas: HTMLCanvasElement,
    onTelemetry?: (t: ModelTelemetry) => void,
    layout: Layout = LAYOUTS[0],
    params: ModelParams = DEFAULT_PARAMS,
  ) {
    this.onTelemetry = onTelemetry;
    this.model = new CrowdModel(layout, params);

    this.strategyColor = Object.fromEntries(
      Object.entries(STRATEGY_COLORS).map(([k, v]) => [k, new THREE.Color(v)]),
    ) as Record<Strategy, THREE.Color>;

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.dprLadder[0]));
    this.renderer.setClearColor(0x0b1220, 0);

    this.scene.fog = new THREE.Fog(0x0b1220, 60, 140);
    this.camera = new THREE.PerspectiveCamera(38, 1, 0.1, 400);
    this.scene.add(this.hall);

    const geo = new THREE.SphereGeometry(0.5, 8, 6);
    const mat = new THREE.MeshBasicMaterial({ toneMapped: false });
    this.crowd = new THREE.InstancedMesh(geo, mat, MAX_AGENTS);
    this.crowd.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.crowd.frustumCulled = false;
    this.scene.add(this.crowd);

    this.pointerRing = new THREE.Mesh(
      new THREE.RingGeometry(4.6, 5, 48),
      new THREE.MeshBasicMaterial({ color: 0xe8eef7, transparent: true, opacity: 0.32, side: THREE.DoubleSide, toneMapped: false }),
    );
    this.pointerRing.rotation.x = -Math.PI / 2;
    this.pointerRing.position.y = 0.06;
    this.pointerRing.visible = false;
    this.scene.add(this.pointerRing);

    this.buildHall();
  }

  /* ------------------------------------------------------------ geometry */

  private disposeHall() {
    this.hall.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
      else mat?.dispose();
    });
    this.hall.clear();
  }

  private buildHall() {
    this.disposeHall();
    const layout = this.model.layout;
    const halfW = layout.width / 2;
    const halfD = layout.depth / 2;
    const gap = this.model.params.exitWidth / SCALE;

    const faint = new THREE.LineBasicMaterial({ color: 0x8caad6, transparent: true, opacity: 0.07 });
    const solid = new THREE.LineBasicMaterial({ color: 0x8caad6, transparent: true, opacity: 0.2 });

    // Floor grid, one line every 5 units (2.5 m)
    const grid: number[] = [];
    for (let x = -halfW; x <= halfW; x += 5) grid.push(x, 0, -halfD, x, 0, halfD);
    for (let z = -halfD; z <= halfD; z += 5) grid.push(-halfW, 0, z, halfW, 0, z);
    const gridGeo = new THREE.BufferGeometry();
    gridGeo.setAttribute("position", new THREE.Float32BufferAttribute(grid, 3));
    this.hall.add(new THREE.LineSegments(gridGeo, faint));

    /* Walls, drawn as segments that stop either side of each doorway. */
    const wall: number[] = [];
    const H = 3.6;
    const addWall = (side: "W" | "E" | "N" | "S") => {
      const vertical = side === "W" || side === "E";
      const doors = layout.exits
        .filter((e) => e.side === side)
        .map((e) => (vertical ? e.z : e.x))
        .sort((a, b) => a - b);
      const from = vertical ? -halfD : -halfW;
      const to = vertical ? halfD : halfW;
      const fixed = side === "W" ? -halfW : side === "E" ? halfW : side === "N" ? halfD : -halfD;

      const spans: [number, number][] = [];
      let cursor = from;
      for (const d of doors) {
        spans.push([cursor, d - gap / 2]);
        cursor = d + gap / 2;
      }
      spans.push([cursor, to]);

      for (const [a, b] of spans) {
        if (b - a <= 0.05) continue;
        if (vertical) {
          wall.push(fixed, 0, a, fixed, 0, b);
          wall.push(fixed, H, a, fixed, H, b);
          wall.push(fixed, 0, a, fixed, H, a);
          wall.push(fixed, 0, b, fixed, H, b);
        } else {
          wall.push(a, 0, fixed, b, 0, fixed);
          wall.push(a, H, fixed, b, H, fixed);
          wall.push(a, 0, fixed, a, H, fixed);
          wall.push(b, 0, fixed, b, H, fixed);
        }
      }
    };
    (["W", "E", "N", "S"] as const).forEach(addWall);
    const wallGeo = new THREE.BufferGeometry();
    wallGeo.setAttribute("position", new THREE.Float32BufferAttribute(wall, 3));
    this.hall.add(new THREE.LineSegments(wallGeo, solid));

    /* Seat rows: one box per block per row, with a lighter edge outline. */
    const seatMat = new THREE.MeshBasicMaterial({ color: 0x1b2a47, transparent: true, opacity: 0.85, toneMapped: false });
    const edgeMat = new THREE.LineBasicMaterial({ color: 0x8caad6, transparent: true, opacity: 0.2 });
    const count = layout.blocks.length * layout.rowZ.length;
    const unit = new THREE.BoxGeometry(1, 0.6, 1);
    const seats = new THREE.InstancedMesh(unit, seatMat, count);
    const edges = new THREE.EdgesGeometry(unit);

    let i = 0;
    for (const [x0, x1] of layout.blocks) {
      for (const z of layout.rowZ) {
        this.dummy.position.set((x0 + x1) / 2, 0.3, z);
        this.dummy.scale.set(x1 - x0, 1, layout.rowThickness);
        this.dummy.rotation.set(0, 0, 0);
        this.dummy.updateMatrix();
        seats.setMatrixAt(i++, this.dummy.matrix);

        const outline = new THREE.LineSegments(edges, edgeMat);
        outline.position.copy(this.dummy.position);
        outline.scale.copy(this.dummy.scale);
        this.hall.add(outline);
      }
    }
    seats.instanceMatrix.needsUpdate = true;
    this.hall.add(seats);

    /* Exit sills and the light they spill onto the floor. */
    for (const e of layout.exits) {
      const horizontal = e.side === "N" || e.side === "S";
      const sill = new THREE.Mesh(
        new THREE.PlaneGeometry(horizontal ? gap : 0.7, horizontal ? 0.7 : gap),
        new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.95, toneMapped: false }),
      );
      sill.rotation.x = -Math.PI / 2;
      sill.position.set(e.x, 0.03, e.z);
      this.hall.add(sill);

      const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(horizontal ? gap + 5 : 14, horizontal ? 14 : gap + 5),
        new THREE.MeshBasicMaterial({ color: 0x00e5a0, transparent: true, opacity: 0.07, toneMapped: false }),
      );
      glow.rotation.x = -Math.PI / 2;
      glow.position.set(
        e.x + (e.side === "W" ? 7 : e.side === "E" ? -7 : 0),
        0.015,
        e.z + (e.side === "S" ? 7 : e.side === "N" ? -7 : 0),
      );
      this.hall.add(glow);
    }

    this.frameCamera();
  }

  private frameCamera() {
    const layout = this.model.layout;
    const spread = Math.max(layout.width, layout.depth * 1.6) / 60;
    const narrow = THREE.MathUtils.clamp(900 / Math.max(this.width, 1), 1, 1.8);
    const k = spread * narrow;
    this.camera.position.set(-5 * k, 33 * k, 46 * k);
    this.camera.lookAt(0, 0, -1);
    this.camera.updateProjectionMatrix();
  }

  /* -------------------------------------------------------------- public */

  setLayout(layout: Layout) {
    if (layout.id === this.model.layout.id) return;
    this.model.setLayout(layout);
    this.buildHall();
  }

  setParams(next: Partial<ModelParams>) {
    const widthChanged = next.exitWidth !== undefined && next.exitWidth !== this.model.params.exitWidth;
    this.model.setParams(next);
    if (widthChanged) this.buildHall();
  }

  resetRun() {
    this.model.telemetry.lastClearance = null;
    this.model.telemetry.bestClearance = null;
    this.model.reset();
  }

  setPointer(nx: number, ny: number, active: boolean) {
    this.pointer.set(nx, ny);
    this.pointerActive = active;
  }

  private updatePointer() {
    if (!this.pointerActive) {
      this.model.obstacle.x = 1e6;
      this.model.obstacle.z = 1e6;
      this.pointerRing.visible = false;
      return;
    }
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const hit = this.raycaster.ray.intersectPlane(this.floorPlane, this.pointerWorld);
    if (hit) {
      this.model.obstacle.x = this.pointerWorld.x;
      this.model.obstacle.z = this.pointerWorld.z;
      this.pointerRing.position.set(this.pointerWorld.x, 0.06, this.pointerWorld.z);
      this.pointerRing.visible = true;
    } else {
      this.model.obstacle.x = 1e6;
      this.model.obstacle.z = 1e6;
      this.pointerRing.visible = false;
    }
  }

  private draw() {
    const agents = this.model.agents;
    const n = Math.min(agents.length, MAX_AGENTS);
    for (let i = 0; i < MAX_AGENTS; i++) {
      const a = i < n ? agents[i] : null;
      if (!a || !a.active) {
        this.dummy.position.set(0, -999, 0);
        this.dummy.scale.setScalar(1);
        this.dummy.updateMatrix();
        this.crowd.setMatrixAt(i, this.dummy.matrix);
        continue;
      }
      // Colour carries the behavioural strategy; brightness carries how freely
      // the agent is actually moving, so jams read as dark patches.
      const lit = a.delay > 0 ? 0.3 : 0.5 + Math.min(1, a.speed / 1.3) * 0.6;
      this.color.copy(this.strategyColor[a.strategy]).multiplyScalar(lit);
      this.crowd.setColorAt(i, this.color);

      this.dummy.position.set(a.x, 0.5, a.z);
      this.dummy.scale.setScalar(a.delay > 0 ? 0.8 : 1);
      this.dummy.updateMatrix();
      this.crowd.setMatrixAt(i, this.dummy.matrix);
    }
    this.crowd.instanceMatrix.needsUpdate = true;
    if (this.crowd.instanceColor) this.crowd.instanceColor.needsUpdate = true;
  }

  /**
   * If we're missing frames consistently, drop resolution a step rather than
   * letting the hall stutter. Measured over a window so one slow frame during
   * a layout rebuild doesn't trigger it.
   */
  private adapt(now: number) {
    if (this.lastFrame) this.frameTimes.push(now - this.lastFrame);
    this.lastFrame = now;
    if (this.frameTimes.length < 90) return;

    const sorted = [...this.frameTimes].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    this.frameTimes.length = 0;

    if (median > 24 && this.dprStep < this.dprLadder.length - 1) {
      this.dprStep++;
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, this.dprLadder[this.dprStep]));
    }
  }

  private loop = (now: number) => {
    if (!this.running || this.disposed) return;
    this.adapt(now);
    this.updatePointer();
    this.model.step();
    this.draw();
    this.renderer.render(this.scene, this.camera);
    if (now - this.lastReport > 200) {
      this.lastReport = now;
      this.onTelemetry?.({ ...this.model.telemetry });
    }
    requestAnimationFrame(this.loop);
  };

  resize(width: number, height: number) {
    if (!width || !height) return;
    this.width = width;
    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.frameCamera();
  }

  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    requestAnimationFrame(this.loop);
  }

  stop() {
    this.running = false;
    this.lastFrame = 0;
    this.frameTimes.length = 0;
  }

  /** A single settled frame, for visitors who ask for reduced motion. */
  renderOnce() {
    for (let i = 0; i < 220; i++) this.model.step();
    this.draw();
    this.renderer.render(this.scene, this.camera);
    this.onTelemetry?.({ ...this.model.telemetry });
  }

  dispose() {
    this.disposed = true;
    this.running = false;
    this.disposeHall();
    this.crowd.geometry.dispose();
    (this.crowd.material as THREE.Material).dispose();
    this.pointerRing.geometry.dispose();
    (this.pointerRing.material as THREE.Material).dispose();
    this.renderer.dispose();
  }
}
