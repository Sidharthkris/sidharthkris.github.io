import { useEffect, useRef, useState } from "react";

/**
 * Boot progress, driven by things that actually finished rather than a timer:
 * the app mounting, webfonts resolving, and the WebGL scene reporting itself
 * ready. A backstop completes the sequence regardless, so a failed WebGL
 * context can never leave a visitor staring at the loading screen.
 */
const STEPS = ["app", "fonts", "scene"] as const;
type Step = (typeof STEPS)[number];

const done = new Set<Step>();
const listeners = new Set<() => void>();

export function markReady(step: Step) {
  if (done.has(step)) return;
  done.add(step);
  listeners.forEach((l) => l());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

const BACKSTOP_MS = 6000;

export function useBootProgress() {
  const [progress, setProgress] = useState(0);
  const target = useRef(0);

  useEffect(() => {
    const recompute = () => {
      target.current = done.size / STEPS.length;
    };
    recompute();
    const unsubscribe = subscribe(recompute);

    markReady("app");
    if (document.fonts?.ready) document.fonts.ready.then(() => markReady("fonts"));
    else markReady("fonts");

    const backstop = window.setTimeout(() => STEPS.forEach(markReady), BACKSTOP_MS);

    let raf = 0;
    let shown = 0;
    const tick = () => {
      // Ease toward whatever has finished, with a slow creep so the number
      // keeps moving during a long step instead of appearing stuck.
      const creep = target.current < 1 ? Math.min(target.current + 0.12, 0.97) : 1;
      shown += (creep - shown) * 0.08;
      if (creep - shown < 0.004) shown = creep;
      setProgress(shown);
      if (shown < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      unsubscribe();
      cancelAnimationFrame(raf);
      window.clearTimeout(backstop);
    };
  }, []);

  return progress;
}
