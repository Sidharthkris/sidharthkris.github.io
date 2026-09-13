import { motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

/* --------------------------------------------------------------- Reveal */

export function Reveal({
  children,
  delay = 0,
  as = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  className?: string;
}) {
  const reduce = useReducedMotion();
  const Tag = (
    as === "section" ? motion.section : as === "li" ? motion.li : as === "article" ? motion.article : motion.div
  ) as typeof motion.div;
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.85, delay, ease: [0.22, 0.68, 0, 1] }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------ SplitLines */

/**
 * Headline lines that rise out of a mask, one after another.
 *
 * Deliberately not using whileInView: if the observer never fires the text
 * stays translated out of its mask and the headline is simply invisible, which
 * is a worse failure than losing an animation. This drives the reveal from a
 * plain IntersectionObserver with a timer as a backstop, so the words always
 * end up on screen.
 */
export function SplitLines({
  lines,
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduce) {
      setShown(true);
      return;
    }
    const el = ref.current;
    let io: IntersectionObserver | undefined;
    if (el) {
      io = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setShown(true);
            io?.disconnect();
          }
        },
        { threshold: 0.01, rootMargin: "0px 0px -5% 0px" },
      );
      io.observe(el);
    }
    // Backstop: never leave the headline hidden.
    const timer = window.setTimeout(() => setShown(true), 2500);
    return () => {
      io?.disconnect();
      window.clearTimeout(timer);
    };
  }, [reduce]);

  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <span
            className="block will-change-transform"
            style={{
              transform: shown || reduce ? "translateY(0)" : "translateY(112%)",
              transition: reduce ? undefined : `transform 1.05s var(--ease-out-quint) ${delay + i * 0.09}s`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------- Magnetic */

/** Pulls its child toward the pointer. Disabled for coarse pointers. */
export function Magnetic({ children, strength = 0.28 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - (r.left + r.width / 2);
    const y = e.clientY - (r.top + r.height / 2);
    el.style.transform = `translate(${x * strength}px, ${y * strength * 1.4}px)`;
  };
  const leave = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      className="inline-block will-change-transform [transition:transform_.5s_var(--ease-out-quint)]"
    >
      {children}
    </span>
  );
}

/* ----------------------------------------------------------- SectionHead */

export function SectionHead({ title, meta }: { title: string; meta?: string }) {
  return (
    <Reveal className="rule mb-10 flex items-baseline justify-between gap-5 pt-[18px] sm:mb-14 lg:mb-[70px]">
      <h2 className="h-display m-0 text-[clamp(1.9rem,4.6vw,3.5rem)]">{title}</h2>
      {meta && <span className="mono shrink-0 text-[11.5px] text-muted-2">{meta}</span>}
    </Reveal>
  );
}
