import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { findings, hallLayouts, modelFigure, resultFigures, thesisMeta, type Figure } from "../content/thesis";
import { useLang } from "../lib/lang";
import { Reveal } from "./primitives";

/**
 * The evacuation project gets its own section: figures straight out of the
 * thesis, shown on a paper-toned panel so the charts stay legible on a dark page.
 */
export default function ThesisDeepDive() {
  const { t, lang } = useLang();
  const [open, setOpen] = useState<Figure | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="mt-16">
      {/* ---------------------------------------------------- thesis meta */}
      <Reveal>
        <dl className="hairline grid gap-px border bg-[var(--line)] sm:grid-cols-3">
          <div className="bg-ground px-5 py-4">
            <dt className="mono m-0 text-[10px] text-muted-2">{lang === "de" ? "eingereicht" : "submitted"}</dt>
            <dd className="mono m-0 mt-1 text-[14px] text-ink">{thesisMeta.submitted}</dd>
          </div>
          <div className="bg-ground px-5 py-4">
            <dt className="mono m-0 text-[10px] text-muted-2">{lang === "de" ? "betreut von" : "supervised by"}</dt>
            <dd className="m-0 mt-1 text-[14px] text-ink">{thesisMeta.supervisors.join(" · ")}</dd>
          </div>
          <div className="bg-ground px-5 py-4">
            <dt className="mono m-0 text-[10px] text-muted-2">{lang === "de" ? "Institut" : "institute"}</dt>
            <dd className="m-0 mt-1 text-[14px] text-ink">{t(thesisMeta.institute)}</dd>
          </div>
        </dl>
      </Reveal>

      {/* ------------------------------------------------------- layouts */}
      <Reveal>
        <h2 className="font-display m-0 mb-1.5 mt-14 text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium tracking-[-0.025em]">
          {lang === "de" ? "Die sechs Säle" : "The six halls"}
        </h2>
        <p className="m-0 mb-6 max-w-[62ch] text-[15px] text-muted">
          {lang === "de"
            ? "Jedes Layout wurde unabhängig implementiert und unter identischen Bedingungen getestet, um Architektur von Verhalten zu trennen."
            : "Each geometry was implemented separately and tested under identical conditions, so architecture could be separated from behaviour."}
        </p>
      </Reveal>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {hallLayouts.map((f, i) => (
          <Reveal key={f.src} delay={i * 0.03}>
            <FigureCard figure={f} onOpen={setOpen} aspect="portrait" />
          </Reveal>
        ))}
      </div>

      {/* ------------------------------------------------------ findings */}
      <Reveal>
        <h2 className="font-display m-0 mb-1.5 mt-16 text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium tracking-[-0.025em]">
          {lang === "de" ? "Was die Läufe zeigten" : "What the runs showed"}
        </h2>
        <p className="m-0 mb-6 max-w-[62ch] text-[15px] text-muted">
          {lang === "de"
            ? "Sechs Befunde aus über 9.000 BehaviorSpace-Läufen bei Populationen von 50, 100 und 200 Personen."
            : "Six findings from more than 9,000 BehaviorSpace runs at populations of 50, 100 and 200."}
        </p>
      </Reveal>

      <ol className="hairline m-0 grid list-none gap-px border bg-[var(--line)] p-0 sm:grid-cols-2">
        {findings.map((f, i) => (
          <li key={i} className="bg-ground px-5 py-5">
            <h3 className="font-display m-0 mb-1.5 text-[15px] font-medium text-signal">{t(f.claim)}</h3>
            <p className="m-0 text-[14.5px] leading-[1.6] text-muted">{t(f.detail)}</p>
          </li>
        ))}
      </ol>

      {/* -------------------------------------------------------- charts */}
      <Reveal>
        <h2 className="font-display m-0 mb-6 mt-16 text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium tracking-[-0.025em]">
          {lang === "de" ? "Ergebnisse" : "Results"}
        </h2>
      </Reveal>

      <div className="grid gap-3 sm:grid-cols-2">
        {resultFigures.map((f, i) => (
          <Reveal key={f.src} delay={i * 0.03}>
            <FigureCard figure={f} onOpen={setOpen} />
          </Reveal>
        ))}
      </div>

      <Reveal>
        <h2 className="font-display m-0 mb-6 mt-16 text-[clamp(1.3rem,2.6vw,1.9rem)] font-medium tracking-[-0.025em]">
          {lang === "de" ? "Das Modell" : "The model"}
        </h2>
        <FigureCard figure={modelFigure} onOpen={setOpen} wide />
      </Reveal>

      {/* ------------------------------------------------------ lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[220] flex items-center justify-center p-4 sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button className="absolute inset-0 cursor-zoom-out bg-ground/90 backdrop-blur-sm" onClick={() => setOpen(null)} aria-label="Close" />
            <motion.figure
              className="relative m-0 max-h-full w-full max-w-[1000px] overflow-auto rounded-lg bg-[#f1f4f9] p-4"
              initial={{ scale: 0.97 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.97 }}
              transition={{ duration: 0.24, ease: [0.22, 0.68, 0, 1] }}
            >
              <img src={open.src} alt={t(open.title)} className="mx-auto w-full" />
              <figcaption className="mt-3 text-[13.5px] leading-snug text-[#2a3550]">
                <b className="font-medium">{t(open.title)}</b> — {t(open.caption)}
              </figcaption>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FigureCard({
  figure,
  onOpen,
  aspect,
  wide,
}: {
  figure: Figure;
  onOpen: (f: Figure) => void;
  aspect?: "portrait";
  wide?: boolean;
}) {
  const { t } = useLang();
  return (
    <figure className="hairline m-0 overflow-hidden rounded-md border bg-ground-2">
      <button
        onClick={() => onOpen(figure)}
        data-cursor="enlarge"
        className={`block w-full cursor-zoom-in bg-[#f1f4f9] p-2.5 ${wide ? "" : aspect === "portrait" ? "" : ""}`}
      >
        <img src={figure.src} alt={t(figure.title)} loading="lazy" className="w-full" />
      </button>
      <figcaption className="px-4 py-3">
        <b className="font-display block text-[13.5px] font-medium tracking-[-0.01em]">{t(figure.title)}</b>
        <span className="mt-0.5 block text-[13px] leading-snug text-muted">{t(figure.caption)}</span>
      </figcaption>
    </figure>
  );
}
