/**
 * Crowd model — a browser-side reimplementation of the NetLogo model from
 * "Agent-Based Simulation of Emergency Evacuation in University Lecture Halls"
 * (Sidharth Vijayan Krishnan, TU Clausthal, 2025).
 *
 * Constants come from the thesis parameter table: 0.5 m patches, 0.1 s ticks,
 * 1.2 m/s unimpeded walking, 0.42 m/s impaired, 0.65 stair modifier,
 * 1.6 persons/s/m exit capacity, jamming density 5.4 persons/m².
 *
 * Deliberately free of any rendering dependency so it can be run headlessly.
 */

export const SCALE = 0.5; // metres per world unit (one NetLogo patch)
export const TICK = 0.1; // seconds per tick
export const RHO_JAM = 5.4; // persons/m² at which movement stops
export const EXIT_CAPACITY = 1.6; // persons/second/metre
export const STAIR_MODIFIER = 0.65;

export const STRATEGIES = ["follow-others", "nearest-exit", "calm-and-orderly", "panic-rush"] as const;
export type Strategy = (typeof STRATEGIES)[number];

/** Mixed-population distribution, Table 4.2 of the thesis. */
const STRATEGY_MIX: [Strategy, number][] = [
  ["follow-others", 0.5],
  ["nearest-exit", 0.25],
  ["calm-and-orderly", 0.15],
  ["panic-rush", 0.1],
];

export type Exit = { x: number; z: number; side: "W" | "E" | "N" | "S"; width: number };

export type Layout = {
  id: string;
  label: { en: string; de: string };
  width: number; // world units along x
  depth: number; // world units along z
  blocks: [number, number][]; // seat-block x spans, repeated for every row
  rowZ: number[];
  rowThickness: number;
  exits: Exit[];
  stairs: boolean;
  note: { en: string; de: string };
};

const rows = (count: number, gap = 3) => Array.from({ length: count }, (_, i) => -((count - 1) * gap) / 2 + i * gap);

export const LAYOUTS: Layout[] = [
  {
    id: "traditional",
    label: { en: "Traditional", de: "Traditionell" },
    width: 60,
    depth: 34,
    blocks: [[-20, 14]],
    rowZ: rows(9),
    rowThickness: 1.2,
    exits: [
      { x: -30, z: -10, side: "W", width: 1.8 },
      { x: 30, z: 10, side: "E", width: 1.8 },
    ],
    stairs: false,
    note: {
      en: "One seating block, two diagonally opposed doors. Everything funnels to a corner.",
      de: "Ein Sitzblock, zwei diagonal gegenüberliegende Türen. Alles läuft in eine Ecke.",
    },
  },
  {
    id: "center-side-aisle",
    label: { en: "Centre + side aisles", de: "Mittel- und Seitengänge" },
    width: 60,
    depth: 34,
    blocks: [
      [-20, -4],
      [4, 20],
    ],
    rowZ: rows(9),
    rowThickness: 1.2,
    exits: [
      { x: -30, z: -11, side: "W", width: 1.8 },
      { x: -12, z: 17, side: "N", width: 1.8 },
      { x: 12, z: 17, side: "N", width: 1.8 },
    ],
    stairs: false,
    note: {
      en: "A wide central aisle plus two wall aisles feeding three exits.",
      de: "Ein breiter Mittelgang und zwei Wandgänge speisen drei Ausgänge.",
    },
  },
  {
    id: "tiered",
    label: { en: "Tiered", de: "Ansteigend" },
    width: 60,
    depth: 34,
    blocks: [[-20, 20]],
    rowZ: rows(9),
    rowThickness: 1.2,
    exits: [
      { x: -30, z: -11, side: "W", width: 1.8 },
      { x: 30, z: 11, side: "E", width: 1.8 },
    ],
    stairs: true,
    note: {
      en: "Stepped floor, aisles only at the extreme sides. Stairs cost 35% of walking speed.",
      de: "Gestufter Boden, Gänge nur ganz außen. Treppen kosten 35 % der Gehgeschwindigkeit.",
    },
  },
  {
    id: "wide-auditorium",
    label: { en: "Wide auditorium", de: "Weites Auditorium" },
    width: 72,
    depth: 38,
    blocks: [
      [-28, -12],
      [-6, 10],
      [16, 30],
    ],
    rowZ: rows(9, 3.4),
    rowThickness: 1.2,
    exits: [
      { x: -30, z: 19, side: "N", width: 1.8 },
      { x: 30, z: 19, side: "N", width: 1.8 },
      { x: -11, z: -19, side: "S", width: 2.4 },
      { x: 11, z: -19, side: "S", width: 2.4 },
    ],
    stairs: false,
    note: {
      en: "Three seating sections, two aisles, four exits. The most redundant layout tested.",
      de: "Drei Sitzblöcke, zwei Gänge, vier Ausgänge. Das redundanteste getestete Layout.",
    },
  },
];

export type ModelParams = {
  population: number;
  exitWidth: number; // metres, applied to every exit
  panic: number; // 0–1, scales baseline panic level
  familiarity: number; // 0–1, share of agents who know every exit
};

export const DEFAULT_PARAMS: ModelParams = { population: 200, exitWidth: 1.8, panic: 0.35, familiarity: 0.6 };

export type Agent = {
  x: number;
  z: number;
  vx: number;
  vz: number;
  active: boolean;
  strategy: Strategy;
  impaired: boolean;
  familiar: boolean;
  baseSpeed: number; // m/s
  personalSpace: number; // world units
  patience: number; // 0–1
  panic: number; // 0–1
  delay: number; // remaining pre-movement delay, seconds
  exitIndex: number;
  phase: 0 | 1 | 2; // 0 = reach an aisle, 1 = travel the aisle, 2 = head for the exit
  aisleX: number;
  stuck: number;
  density: number; // local density, persons/m²
  speed: number; // achieved speed, m/s
};

export type ModelTelemetry = {
  population: number;
  evacuated: number;
  flow: number; // persons/second through all exits
  peakDensity: number; // persons/m²
  elapsed: number; // simulated seconds
  lastClearance: number | null;
  bestClearance: number | null;
  congestionEvents: number;
};

/** Log-normal pre-movement delay: right-skewed, as reported in the evacuation literature. */
function logNormal(median: number, sigma: number, rnd: () => number) {
  const u = Math.max(1e-6, rnd());
  const v = Math.max(1e-6, rnd());
  const z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  return median * Math.exp(sigma * z);
}

function pickStrategy(rnd: () => number): Strategy {
  let r = rnd();
  for (const [s, p] of STRATEGY_MIX) {
    if (r < p) return s;
    r -= p;
  }
  return "nearest-exit";
}

export class CrowdModel {
  layout: Layout;
  params: ModelParams;
  agents: Agent[] = [];
  telemetry: ModelTelemetry = {
    population: 0,
    evacuated: 0,
    flow: 0,
    peakDensity: 0,
    elapsed: 0,
    lastClearance: null,
    bestClearance: null,
    congestionEvents: 0,
  };

  private aisles: number[] = [];
  private seatZ: [number, number] = [0, 0];
  private seatX: [number, number] = [0, 0];
  private exitBudget: number[] = [];
  private exitQueue: number[] = [];
  private flowWindow: number[] = [];
  private restTicks = 0;
  private rnd: () => number;
  /** Pointer position in world units; far away when the pointer is elsewhere. */
  obstacle = { x: 1e6, z: 1e6, radius: 5 };

  constructor(layout: Layout = LAYOUTS[0], params: ModelParams = DEFAULT_PARAMS, rnd: () => number = Math.random) {
    this.layout = layout;
    this.params = { ...params };
    this.rnd = rnd;
    this.geometry();
    this.reset();
  }

  /* ------------------------------------------------------------ geometry */

  private geometry() {
    const { blocks, width, rowZ, rowThickness } = this.layout;
    const halfW = width / 2;
    const sorted = [...blocks].sort((a, b) => a[0] - b[0]);

    const gaps: [number, number][] = [];
    gaps.push([-halfW, sorted[0][0]]);
    for (let i = 0; i < sorted.length - 1; i++) gaps.push([sorted[i][1], sorted[i + 1][0]]);
    gaps.push([sorted[sorted.length - 1][1], halfW]);

    this.aisles = gaps.filter(([a, b]) => b - a >= 2.4).map(([a, b]) => (a + b) / 2);
    if (this.aisles.length === 0) this.aisles = [-halfW + 2, halfW - 2];

    this.seatX = [sorted[0][0], sorted[sorted.length - 1][1]];
    this.seatZ = [Math.min(...rowZ) - rowThickness, Math.max(...rowZ) + rowThickness];
  }

  setLayout(layout: Layout) {
    this.layout = layout;
    this.geometry();
    this.reset();
  }

  setParams(next: Partial<ModelParams>) {
    const before = this.params.population;
    this.params = { ...this.params, ...next };
    if (this.params.population !== before) this.reset();
  }

  /* -------------------------------------------------------------- agents */

  private makeAgent(): Agent {
    const rnd = this.rnd;
    const strategy = pickStrategy(rnd);
    const impaired = rnd() < 0.08;
    const { rowZ, rowThickness } = this.layout;
    const row = Math.floor(rnd() * rowZ.length);
    const block = this.layout.blocks[Math.floor(rnd() * this.layout.blocks.length)];

    // Seated agents start on their row, then step into the corridor behind it.
    const z = rowZ[row] + rowThickness * 0.5 + 0.6 + (rnd() - 0.5) * 0.5;
    const x = block[0] + 1 + rnd() * Math.max(1, block[1] - block[0] - 2);

    const base = impaired ? 0.42 : strategy === "panic-rush" ? 1.45 : strategy === "calm-and-orderly" ? 1.2 : 1.3;
    const panic = Math.min(1, Math.max(0, this.params.panic + (rnd() - 0.5) * 0.4));

    return {
      x,
      z,
      vx: 0,
      vz: 0,
      active: true,
      strategy,
      impaired,
      familiar: rnd() < this.params.familiarity,
      baseSpeed: base * (0.9 + rnd() * 0.2),
      personalSpace: strategy === "calm-and-orderly" ? 1.5 : strategy === "panic-rush" ? 0.85 : 1.15,
      patience: strategy === "calm-and-orderly" ? 0.9 : strategy === "panic-rush" ? 0.15 : 0.55,
      panic,
      delay: logNormal(4.5, 0.5, rnd) * (impaired ? 1.4 : 1) * (1 - panic * 0.5),
      exitIndex: 0,
      phase: 0,
      aisleX: 0,
      stuck: 0,
      density: 0,
      speed: 0,
    };
  }

  reset() {
    this.agents = Array.from({ length: this.params.population }, () => this.makeAgent());
    this.agents.forEach((a) => this.chooseRoute(a));
    this.exitBudget = this.layout.exits.map(() => 0);
    this.exitQueue = this.layout.exits.map(() => 0);
    this.flowWindow = [];
    this.restTicks = 0;
    this.telemetry = {
      ...this.telemetry,
      population: this.params.population,
      evacuated: 0,
      flow: 0,
      peakDensity: 0,
      elapsed: 0,
      congestionEvents: 0,
    };
  }

  /**
   * Exit and aisle are one decision, not two: the route is walk-the-row,
   * walk-the-aisle, cross to the door. Choosing them separately lets an agent
   * commit to an aisle on the wrong side of the hall and jam against the seats.
   */
  private chooseRoute(a: Agent) {
    const exits = this.layout.exits;
    let bestExit = 0;
    let bestAisle = this.aisles[0];
    let bestCost = Infinity;

    // Agents who don't know the building only weigh the doors they can see;
    // this is the visual-access effect that drives uneven exit use.
    const sightRange = Math.hypot(this.layout.width, this.layout.depth) * 0.42;

    for (let i = 0; i < exits.length; i++) {
      const e = exits[i];
      const visible = a.familiar || Math.hypot(e.x - a.x, e.z - a.z) <= sightRange;
      if (!visible) continue;

      for (const ax of this.aisles) {
        let cost = Math.abs(a.x - ax) + Math.abs(ax - e.x) + Math.abs(a.z - e.z);
        // Comparing queues requires knowing the alternatives exist.
        if (a.familiar) {
          if (a.strategy === "calm-and-orderly") cost += this.exitQueue[i] * 1.6;
          if (a.strategy === "panic-rush") cost -= this.exitQueue[i] * 0.25;
        } else if (i > 0) {
          // People who don't know the building head back to the door they came
          // in by (Kimura & Sime), which overloads the main entrance.
          cost += sightRange * 0.9;
        }
        if (cost < bestCost) {
          bestCost = cost;
          bestExit = i;
          bestAisle = ax;
        }
      }
    }

    // Nothing in view: fall back to the geometrically nearest door.
    if (bestCost === Infinity) {
      let nd = Infinity;
      for (let i = 0; i < exits.length; i++) {
        const d = Math.hypot(exits[i].x - a.x, exits[i].z - a.z);
        if (d < nd) {
          nd = d;
          bestExit = i;
        }
      }
      let ad = Infinity;
      for (const ax of this.aisles) {
        const d = Math.abs(a.x - ax) + Math.abs(ax - exits[bestExit].x);
        if (d < ad) {
          ad = d;
          bestAisle = ax;
        }
      }
    }
    a.exitIndex = bestExit;
    a.aisleX = bestAisle;
  }

  private inSeating(a: Agent) {
    return a.x > this.seatX[0] - 0.5 && a.x < this.seatX[1] + 0.5 && a.z > this.seatZ[0] - 0.5 && a.z < this.seatZ[1] + 0.5;
  }

  /* ---------------------------------------------------------------- step */

  step() {
    const { layout, params, agents } = this;
    const halfW = layout.width / 2;
    const halfD = layout.depth / 2;
    const exits = layout.exits;
    const gapUnits = params.exitWidth / SCALE;
    const toUnits = TICK / SCALE; // m/s → world units per tick

    // Every exit accrues throughput budget at capacity × width.
    for (let i = 0; i < exits.length; i++) {
      this.exitBudget[i] = Math.min(this.exitBudget[i] + EXIT_CAPACITY * params.exitWidth * TICK, 4);
      this.exitQueue[i] = 0;
    }

    let alive = 0;
    let peak = 0;

    for (let i = 0; i < agents.length; i++) {
      const a = agents[i];
      if (!a.active) continue;
      alive++;

      if (a.delay > 0) {
        a.delay -= TICK;
        a.speed = 0;
        continue;
      }

      /* ---- local density, and the separation that produces jams ---- */
      let neighbours = 0;
      let sepX = 0;
      let sepZ = 0;
      for (let j = 0; j < agents.length; j++) {
        if (j === i) continue;
        const b = agents[j];
        if (!b.active || b.delay > 0) continue;
        const dx = b.x - a.x;
        if (dx > 3 || dx < -3) continue;
        const dz = b.z - a.z;
        if (dz > 3 || dz < -3) continue;
        const d2 = dx * dx + dz * dz;
        if (d2 > 9 || d2 < 1e-6) continue;
        if (d2 < 2.25) neighbours++; // within 0.75 m
        const d = Math.sqrt(d2);
        if (d < a.personalSpace) {
          const push = (a.personalSpace - d) / d;
          sepX -= dx * push;
          sepZ -= dz * push;
          // A consistent handedness when passing, which is what makes
          // counter-flowing crowds self-organise into lanes instead of locking.
          sepX -= dz * push * 0.45;
          sepZ += dx * push * 0.45;
        }
      }
      a.density = neighbours / (Math.PI * 0.75 * 0.75);
      if (a.density > peak) peak = a.density;
      if (a.density > RHO_JAM * 0.7) this.telemetry.congestionEvents++;

      /* ---- navigation phase ---- */
      const exit = exits[a.exitIndex] ?? exits[0];
      if (this.inSeating(a)) a.phase = Math.abs(a.x - a.aisleX) > 1.2 ? 0 : 1;
      else a.phase = 2;

      let tx: number;
      let tz: number;
      if (a.phase === 0) {
        // Shuffle along the row corridor to the aisle.
        tx = a.aisleX;
        tz = a.z;
      } else if (a.phase === 1) {
        // In the aisle: walk it until clear of the seating block.
        tx = a.aisleX;
        tz = exit.z > a.z ? this.seatZ[1] + 3 : this.seatZ[0] - 3;
      } else {
        tx = exit.x;
        tz = exit.z;
      }

      const dx = tx - a.x;
      const dz = tz - a.z;
      const dist = Math.hypot(dx, dz) || 1;

      /* ---- desired speed: base, panic, stairs, then speed–density ---- */
      let desired = a.baseSpeed * (1 + a.panic * 0.25);
      if (layout.stairs && !this.inSeating(a)) desired *= STAIR_MODIFIER;
      desired *= Math.max(0.05, 1 - a.density / RHO_JAM);
      const step = desired * toUnits;

      const urgency = 0.35 + a.panic * 0.35;
      a.vx += (dx / dist) * step * urgency;
      a.vz += (dz / dist) * step * urgency;

      // Separation, weighted by how little patience the agent has.
      const pushWeight = 0.055 * (1.4 - a.patience);
      a.vx += sepX * pushWeight;
      a.vz += sepZ * pushWeight;

      // The pointer, treated as an obstruction dropped into the hall.
      const ox = a.x - this.obstacle.x;
      const oz = a.z - this.obstacle.z;
      const od2 = ox * ox + oz * oz;
      const r = this.obstacle.radius;
      if (od2 < r * r && od2 > 1e-6) {
        const od = Math.sqrt(od2);
        const g = ((r - od) / od) * 0.3;
        a.vx += ox * g;
        a.vz += oz * g;
      }

      // Seat blocks are solid.
      if (a.x > this.seatX[0] - 1 && a.x < this.seatX[1] + 1) {
        for (const rz of layout.rowZ) {
          const d = a.z - rz;
          const limit = layout.rowThickness / 2 + 0.55;
          if (d < limit && d > -limit) {
            const dir = d >= 0 ? 1 : -1;
            let onBlock = false;
            for (const [b0, b1] of layout.blocks) if (a.x > b0 && a.x < b1) onBlock = true;
            if (onBlock) {
              a.vz += dir * 0.16;
              a.z += dir * 0.05;
            }
          }
        }
      }

      /* ---- walls, with apertures at the exits ---- */
      a.vx *= 0.86;
      a.vz *= 0.86;
      const max = step * 1.6 + 0.02;
      const sp = Math.hypot(a.vx, a.vz);
      if (sp > max) {
        a.vx = (a.vx / sp) * max;
        a.vz = (a.vz / sp) * max;
      }
      a.x += a.vx;
      a.z += a.vz;
      a.speed = (Math.hypot(a.vx, a.vz) * SCALE) / TICK;

      let escaped = false;
      for (let e = 0; e < exits.length; e++) {
        const ex = exits[e];
        const half = gapUnits / 2;
        const reach = 2.2; // agents count as through once inside the doorway
        const atW = ex.side === "W" && a.x <= ex.x + reach && Math.abs(a.z - ex.z) < half;
        const atE = ex.side === "E" && a.x >= ex.x - reach && Math.abs(a.z - ex.z) < half;
        const atN = ex.side === "N" && a.z >= ex.z - reach && Math.abs(a.x - ex.x) < half;
        const atS = ex.side === "S" && a.z <= ex.z + reach && Math.abs(a.x - ex.x) < half;
        if (!(atW || atE || atN || atS)) continue;
        this.exitQueue[e]++;
        if (this.exitBudget[e] >= 1) {
          this.exitBudget[e] -= 1;
          a.active = false;
          this.telemetry.evacuated++;
          escaped = true;
        }
        break;
      }
      if (escaped) continue;

      // Solid walls everywhere else.
      if (a.x < -halfW + 0.6) {
        a.x = -halfW + 0.6;
        a.vx = Math.abs(a.vx) * 0.3;
      }
      if (a.x > halfW - 0.6) {
        a.x = halfW - 0.6;
        a.vx = -Math.abs(a.vx) * 0.3;
      }
      if (a.z < -halfD + 0.6) {
        a.z = -halfD + 0.6;
        a.vz = Math.abs(a.vz) * 0.3;
      }
      if (a.z > halfD - 0.6) {
        a.z = halfD - 0.6;
        a.vz = -Math.abs(a.vz) * 0.3;
      }

      /* ---- stuck watchdog: re-evaluate the exit choice ---- */
      if (a.speed < 0.05) {
        a.stuck++;
        if (a.stuck > 60) {
          this.chooseRoute(a);
          a.vx += (this.rnd() - 0.5) * 0.3;
          a.vz += (this.rnd() - 0.5) * 0.3;
          a.stuck = 0;
        }
      } else a.stuck = 0;

      // Panic-rush agents keep second-guessing their route.
      if (a.strategy === "panic-rush" && this.rnd() < 0.004) this.chooseRoute(a);
    }

    /* ---- bookkeeping ---- */
    this.telemetry.elapsed += TICK;
    this.telemetry.peakDensity = this.telemetry.peakDensity * 0.9 + peak * 0.1;

    this.flowWindow.push(this.telemetry.evacuated);
    if (this.flowWindow.length > 30) this.flowWindow.shift();
    if (this.flowWindow.length > 1) {
      const span = (this.flowWindow.length - 1) * TICK;
      this.telemetry.flow = (this.flowWindow[this.flowWindow.length - 1] - this.flowWindow[0]) / span;
    }

    // The hall is clear: record total evacuation time, pause, then run again.
    if (alive === 0) {
      if (this.restTicks === 0) {
        const tet = this.telemetry.elapsed;
        this.telemetry.lastClearance = tet;
        this.telemetry.bestClearance =
          this.telemetry.bestClearance === null ? tet : Math.min(this.telemetry.bestClearance, tet);
      }
      this.restTicks++;
      if (this.restTicks > 25) {
        const keep = { last: this.telemetry.lastClearance, best: this.telemetry.bestClearance };
        this.reset();
        this.telemetry.lastClearance = keep.last;
        this.telemetry.bestClearance = keep.best;
      }
    }
  }
}
