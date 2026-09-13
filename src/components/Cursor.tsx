import { useEffect, useRef, useState } from "react";
import { useFinePointer, usePrefersReducedMotion } from "../lib/hooks";

/**
 * Two-part cursor: a hard dot that tracks exactly, and a lagging ring that
 * expands into a label when it is over something interactive.
 */
export default function Cursor() {
  const fine = useFinePointer();
  const reduce = usePrefersReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    if (!fine) return;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-cursor],a,button");
      setLabel(el ? el.dataset.cursor || "open" : null);
    };

    const tick = () => {
      const ease = reduce ? 1 : 0.16;
      rx += (mx - rx) * ease;
      ry += (my - ry) * ease;
      if (dot.current) dot.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduce]);

  if (!fine) return null;
  const active = label !== null;

  return (
    <>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-[5px] w-[5px] rounded-full bg-signal mix-blend-screen"
        style={{ opacity: active ? 0 : 1 }}
      />
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] grid place-items-center rounded-full mix-blend-screen"
        style={{
          width: active ? 76 : 38,
          height: active ? 76 : 38,
          border: `1px solid ${active ? "#00e5a0" : "var(--line-strong)"}`,
          background: active ? "#00e5a0" : "transparent",
          transition: "width .35s var(--ease-out-quint), height .35s var(--ease-out-quint), background .35s var(--ease-out-quint), border-color .35s",
        }}
      >
        <span
          className="mono whitespace-nowrap text-[9px] tracking-[0.06em] text-[#05231a]"
          style={{ opacity: active ? 1 : 0, transition: "opacity .2s" }}
        >
          {label}
        </span>
      </div>
    </>
  );
}
