import Lenis from "lenis";

let instance: Lenis | null = null;
let raf = 0;

/** Starts Lenis once for the whole app; no-op when reduced motion is requested. */
export function startSmoothScroll(enabled: boolean) {
  stopSmoothScroll();
  if (!enabled) return null;

  instance = new Lenis({
    duration: 1.05,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  const tick = (time: number) => {
    instance?.raf(time);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return instance;
}

export function stopSmoothScroll() {
  cancelAnimationFrame(raf);
  instance?.destroy();
  instance = null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  if (instance) instance.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { immediate: true });
  else window.scrollTo(0, 0);
}
