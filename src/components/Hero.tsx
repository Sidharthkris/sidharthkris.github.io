import { useEffect, useRef, useState } from "react";
import { hero, profile } from "../content/site";
import { markReady } from "../lib/loading";
import { DEFAULT_PARAMS, LAYOUTS, STRATEGIES, type Layout, type ModelParams, type ModelTelemetry } from "../lib/crowdModel";
import { defaultPopulationFor, STRATEGY_COLORS } from "../lib/evacuationScene";
import { usePrefersReducedMotion } from "../lib/hooks";
import { useLang } from "../lib/lang";
import { scrollToId } from "../lib/smoothScroll";
import ProjectCanvas from "./ProjectCanvas";
import { Magnetic } from "./primitives";

const EMPTY: ModelTelemetry = {
  population: DEFAULT_PARAMS.population,
  evacuated: 0,
  flow: 0,
  peakDensity: 0,
  elapsed: 0,
  lastClearance: null,
  bestClearance: null,
  congestionEvents: 0,
};

export default function Hero() {
  const { t } = useLang();
  const reduce = usePrefersReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<import("../lib/evacuationScene").EvacuationScene | null>(null);
  const [params, setParams] = useState<ModelParams>(() => ({
    ...DEFAULT_PARAMS,
    population: typeof window === "undefined" ? DEFAULT_PARAMS.population : defaultPopulationFor(window.innerWidth),
  }));
  const [layout, setLayout] = useState<Layout>(LAYOUTS[0]);
  const [tm, setTm] = useState<ModelTelemetry>(EMPTY);
  const [webgl, setWebgl] = useState<boolean | null>(null);
  const paramsRef = useRef(DEFAULT_PARAMS);

  useEffect(() => {
    let cancelled = false;
    let cleanup = () => {};

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const mod = await import("../lib/evacuationScene");
      if (cancelled) return;

      if (!mod.webglAvailable()) {
        setWebgl(false);
        markReady("scene");
        return;
      }

      let scene: import("../lib/evacuationScene").EvacuationScene;
      try {
        scene = new mod.EvacuationScene(canvas, setTm, LAYOUTS[0], paramsRef.current);
      } catch {
        // Context creation can still fail after the probe passes — driver
        // blocklists, exhausted contexts, headless environments.
        setWebgl(false);
        markReady("scene");
        return;
      }
      setWebgl(true);
      sceneRef.current = scene;

      const host = canvas.parentElement!;
      const ro = new ResizeObserver(() => scene.resize(host.clientWidth, host.clientHeight));
      ro.observe(host);
      scene.resize(host.clientWidth, host.clientHeight);

      if (reduce) {
        scene.renderOnce();
        markReady("scene");
        cleanup = () => {
          ro.disconnect();
          scene.dispose();
        };
        return;
      }

      const io = new IntersectionObserver(([e]) => (e.isIntersecting ? scene.start() : scene.stop()), { threshold: 0.02 });
      io.observe(canvas);
      requestAnimationFrame(() => markReady("scene"));
      cleanup = () => {
        io.disconnect();
        ro.disconnect();
        scene.dispose();
      };
    })();

    return () => {
      cancelled = true;
      cleanup();
      sceneRef.current = null;
    };
  }, [reduce]);

  // If WebGL never comes up, the boot sequence must not wait on it.
  useEffect(() => {
    const t = window.setTimeout(() => markReady("scene"), 4000);
    return () => window.clearTimeout(t);
  }, []);

  useEffect(() => {
    paramsRef.current = params;
    sceneRef.current?.setParams(params);
  }, [params]);

  useEffect(() => {
    sceneRef.current?.setLayout(layout);
  }, [layout]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;
    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const inside = e.clientY >= r.top && e.clientY <= r.bottom;
      sceneRef.current?.setPointer(((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1), inside);
    };
    const leave = () => sceneRef.current?.setPointer(-999, -999, false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, [reduce]);

  const set = (k: keyof ModelParams) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setParams((p) => ({ ...p, [k]: Number(e.target.value) }));

  const inside = Math.max(0, tm.population - tm.evacuated);

  return (
    <section id="top" className="relative flex min-h-[100svh] items-end pb-8 lg:pb-16">
      <div className="absolute inset-0 z-0">
        <canvas ref={canvasRef} className="h-full w-full" aria-hidden style={{ opacity: webgl === false ? 0 : 1 }} />
        {webgl === false && (
          <div className="absolute inset-0 opacity-60">
            <ProjectCanvas kind="evac" />
          </div>
        )}
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to top, rgba(11,18,32,.92) 0%, rgba(11,18,32,.55) 18%, rgba(11,18,32,0) 42%)",
        }}
      />

      <div className="relative z-[2] mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-[72px]">
        <div className="mb-8 flex items-center gap-2.5">
          <span className="relative h-[7px] w-[7px] shrink-0 rounded-full bg-signal">
            <span className="absolute inset-0 animate-ping rounded-full bg-signal opacity-60" />
          </span>
          <p className="mono m-0 text-[11px] text-muted sm:text-[11.5px]">{t(hero.badge)}</p>
        </div>

        {/* The headline slot is intentionally empty — the hall carries the opening.
            A visually hidden h1 keeps the document properly titled for screen
            readers and search engines. */}
        <h1 className="sr-only">
          {profile.name} — {t(profile.role)}
        </h1>
        <div className="h-[clamp(1.5rem,12vh,7rem)]" aria-hidden />

        <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,42ch)_1fr] lg:gap-14">
          <div>
            <p className="m-0 max-w-[44ch] text-[clamp(15px,1.5vw,17.5px)] text-muted">{t(hero.intro)}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Magnetic>
                <button className="btn btn-solid" onClick={() => scrollToId("projects")} data-cursor="work">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  <span>{t(hero.ctaWork)}</span>
                </button>
              </Magnetic>
              <Magnetic>
                <a className="btn" href={`mailto:${profile.email}`} data-cursor="email">
                  <span>{t(hero.ctaMail)}</span>
                </a>
              </Magnetic>
            </div>
          </div>

          {webgl === false && (
            <div className="lg:ml-auto lg:w-full lg:max-w-[540px]">
              <p className="hairline m-0 rounded border p-4 text-[13.5px] leading-relaxed text-muted">{t(hero.noWebgl)}</p>
            </div>
          )}

          <div className={`lg:ml-auto lg:w-full lg:max-w-[540px] ${webgl === false ? "hidden" : ""}`}>
            <dl className="hairline grid grid-cols-2 gap-px overflow-hidden rounded border bg-[var(--line)] sm:grid-cols-4">
              <Cell label={t(hero.telemetry.inside)} value={inside} />
              <Cell label={t(hero.telemetry.clearance)} value={tm.lastClearance === null ? "—" : `${tm.lastClearance.toFixed(1)}s`} />
              <Cell label={t(hero.telemetry.flow)} value={tm.flow.toFixed(1)} />
              <Cell label={t(hero.telemetry.density)} value={`${tm.peakDensity.toFixed(1)}`} />
            </dl>

            <div className="hairline mt-3 rounded border p-3.5">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <span className="mono text-[10.5px] text-muted">{t(hero.controls.title)}</span>
                <button
                  className="mono text-[10.5px] text-signal transition-opacity hover:opacity-70"
                  onClick={() => {
                    setParams(DEFAULT_PARAMS);
                    sceneRef.current?.resetRun();
                  }}
                  data-cursor="reset"
                >
                  {t(hero.controls.reset)}
                </button>
              </div>

              <span className="mono mb-1.5 block text-[10px] text-muted-2">{t(hero.controls.hall)}</span>
              <div className="mb-3.5 flex flex-wrap gap-1.5">
                {LAYOUTS.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLayout(l)}
                    title={t(l.note)}
                    data-cursor="load"
                    className={`mono rounded border px-2.5 py-1 text-[10.5px] transition-colors ${
                      layout.id === l.id ? "border-signal text-signal" : "hairline text-muted hover:text-ink"
                    }`}
                  >
                    {t(l.label)}
                  </button>
                ))}
              </div>

              <div className="grid gap-x-5 sm:grid-cols-3">
                <Slider label={t(hero.controls.population)} value={params.population} min={40} max={320} step={10} onChange={set("population")} display={String(params.population)} />
                <Slider label={t(hero.controls.exit)} value={params.exitWidth} min={0.8} max={3.6} step={0.1} onChange={set("exitWidth")} display={`${params.exitWidth.toFixed(1)} m`} />
                <Slider label={t(hero.controls.panic)} value={params.panic} min={0} max={1} step={0.05} onChange={set("panic")} display={params.panic.toFixed(2)} />
              </div>

              <span className="mono mb-1.5 mt-1 block text-[10px] text-muted-2">{t(hero.controls.legend)}</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                {STRATEGIES.map((s) => (
                  <span key={s} className="mono flex items-center gap-1.5 text-[10px] text-muted">
                    <span className="h-2 w-2 rounded-full" style={{ background: STRATEGY_COLORS[s] }} />
                    {t(hero.strategies[s])}
                  </span>
                ))}
              </div>

              <p className="mono m-0 mt-2.5 text-[10px] leading-relaxed text-muted-2">{t(hero.controls.note)}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Cell({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-ground/75 px-3.5 py-3">
      <dt className="mono m-0 text-[10px] tracking-[0.04em] text-muted-2">{label}</dt>
      <dd className="mono num m-0 mt-1 text-[clamp(15px,2vw,19px)] text-signal">{value}</dd>
    </div>
  );
}

function Slider({
  label,
  display,
  ...rest
}: {
  label: string;
  display: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="mb-2 block">
      <span className="mono mb-0.5 flex items-baseline justify-between gap-2 text-[10px] text-muted-2">
        <span>{label}</span>
        <span className="num text-muted">{display}</span>
      </span>
      <input type="range" aria-label={label} {...rest} />
    </label>
  );
}
