import { AnimatePresence, motion } from "motion/react";
import { contact } from "../content/site";
import { useScrollProgress } from "../lib/hooks";
import { useLang } from "../lib/lang";
import { scrollToTop } from "../lib/smoothScroll";

/** Appears once you're past the hero; the ring shows how far down the page you are. */
export default function ScrollToTop() {
  const progress = useScrollProgress();
  const { t } = useLang();
  const visible = progress > 0.12;
  const R = 21;
  const circumference = 2 * Math.PI * R;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          aria-label={t(contact.toTop)}
          title={t(contact.toTop)}
          data-cursor="top"
          className="group fixed bottom-5 right-5 z-[130] grid h-12 w-12 place-items-center rounded-full border border-[var(--line-strong)] bg-ground/85 backdrop-blur-sm transition-colors hover:border-signal sm:bottom-8 sm:right-8"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.3, ease: [0.22, 0.68, 0, 1] }}
        >
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 48 48" aria-hidden>
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="#00e5a0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
            />
          </svg>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden className="relative transition-transform duration-300 group-hover:-translate-y-0.5">
            <path d="M7 12V2M7 2L2.5 6.5M7 2l4.5 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
