import { useEffect, useState } from "react";

/**
 * Visitor count with no backend of our own.
 *
 * The endpoint is deliberately swappable: point it at GoatCounter, a Cloudflare
 * Worker, or any service returning a total. If the request fails or the service
 * disappears, the hook returns null and the UI simply omits the counter rather
 * than showing a made-up number.
 */
const ENDPOINT = "https://visitor.6developer.com/visit";

export function useVisitorCount(enabled = true) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 4000);

    (async () => {
      try {
        const res = await fetch(ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            domain: window.location.hostname || "localhost",
            page_path: "/",
            page_title: document.title,
            referrer: document.referrer,
          }),
        });
        if (!res.ok) return;
        const data = (await res.json()) as { totalCount?: number };
        if (typeof data.totalCount === "number") setCount(data.totalCount);
      } catch {
        /* offline, blocked, or the service is gone — show nothing */
      } finally {
        window.clearTimeout(timer);
      }
    })();

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [enabled]);

  return count;
}

/** Counts up to the target once, so the number arrives rather than appearing. */
export function useCountUp(target: number | null, duration = 1100) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
