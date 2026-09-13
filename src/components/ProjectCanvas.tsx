import { useEffect, useRef } from "react";
import type { SimKind } from "../content/site";
import { usePrefersReducedMotion } from "../lib/hooks";
import { sims } from "../lib/projectSims";

/** Runs one of the small 2D project simulations, only while it is visible. */
export default function ProjectCanvas({ kind, className = "" }: { kind: SimKind; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const sim = sims[kind];
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let state: unknown = null;
    let raf = 0;
    let running = false;

    const size = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      if (!w || !h) return;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      state = sim.init(w, h);
    };

    const frame = () => {
      if (!running || !state) return;
      sim.draw(ctx, w, h, state as never);
      raf = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(() => size());
    ro.observe(canvas);
    size();

    if (reduce) {
      if (state) for (let i = 0; i < 90; i++) sim.draw(ctx, w, h, state as never);
    } else {
      const io = new IntersectionObserver(
        ([e]) => {
          running = e.isIntersecting;
          if (running) {
            if (!state) size();
            raf = requestAnimationFrame(frame);
          } else cancelAnimationFrame(raf);
        },
        { threshold: 0.05 },
      );
      io.observe(canvas);
      return () => {
        io.disconnect();
        ro.disconnect();
        cancelAnimationFrame(raf);
      };
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [kind, reduce]);

  return <canvas ref={ref} aria-hidden className={`h-full w-full ${className}`} />;
}
