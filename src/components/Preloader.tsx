import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { profile } from "../content/site";
import { usePrefersReducedMotion } from "../lib/hooks";
import { useLang } from "../lib/lang";
import { useBootProgress } from "../lib/loading";

/**
 * Holds the page until the scene is ready, then lifts away. The bar is the same
 * green as the exit sill in the simulation underneath it.
 */
export default function Preloader({ onDone }: { onDone: () => void }) {
  const progress = useBootProgress();
  const { t } = useLang();
  const reduce = usePrefersReducedMotion();
  const [visible, setVisible] = useState(true);

  const pct = Math.round(progress * 100);

  useEffect(() => {
    if (progress < 1) return;
    const t = window.setTimeout(() => setVisible(false), reduce ? 0 : 420);
    return () => window.clearTimeout(t);
  }, [progress, reduce]);

  // Nothing scrolls while the curtain is up.
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0);
    } else {
      document.body.style.overflow = "";
      onDone();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible, onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[400] flex flex-col justify-between bg-ground px-5 py-8 sm:px-8 sm:py-10 lg:px-[72px]"
          initial={false}
          exit={reduce ? { opacity: 0 } : { y: "-100%" }}
          transition={{ duration: reduce ? 0.2 : 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-display m-0 text-[15px] font-semibold tracking-[-0.01em]">{profile.name}</p>
              <p className="mono m-0 mt-0.5 text-[10.5px] text-muted-2">{t(profile.role)}</p>
            </div>
            <p className="mono num m-0 text-[11px] text-muted-2">{pct < 100 ? "initialising model" : "ready"}</p>
          </div>

          <div className="flex items-end justify-between gap-6">
            <p className="mono num m-0 text-[clamp(3rem,14vw,9rem)] leading-none tracking-[-0.04em] text-ink">
              {String(pct).padStart(2, "0")}
              <span className="text-signal">%</span>
            </p>
          </div>

          <div className="h-px w-full bg-[var(--line)]">
            <div
              className="h-px bg-signal"
              style={{ width: `${pct}%`, transition: "width .25s linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
