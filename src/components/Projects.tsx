import { useRef } from "react";
import { Link } from "react-router-dom";
import { projects, ui } from "../content/site";
import { usePrefersReducedMotion } from "../lib/hooks";
import { useLang } from "../lib/lang";
import ProjectCanvas from "./ProjectCanvas";
import { Reveal, SectionHead } from "./primitives";

export default function Projects() {
  const { t, lang } = useLang();
  return (
    <section id="projects">
      <div className="mx-auto w-full max-w-[1360px] px-5 py-20 sm:px-8 lg:px-[72px] lg:py-[150px]">
        <SectionHead
          title={lang === "de" ? "Ausgewählte Arbeiten" : "Selected work"}
          meta={lang === "de" ? `${projects.length} Projekte · zum Öffnen klicken` : `${projects.length} builds · click to open`}
        />
        <div className="flex flex-col gap-5 lg:gap-8">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.04}>
              <Card slug={p.slug} index={i}>
                <div className="grid lg:grid-cols-[1fr_1.05fr]">
                  <div className="order-2 p-6 sm:p-8 lg:order-1 lg:p-11">
                    <p className="mono m-0 mb-3.5 text-[10.5px] text-muted-2">{t(p.tag)}</p>
                    <h3 className="h-display m-0 mb-3 max-w-[18ch] text-[clamp(1.5rem,3.2vw,2.5rem)] leading-[1.04]">
                      {t(p.title)}
                    </h3>
                    <p className="m-0 mb-5 max-w-[46ch] text-[15.5px] text-muted">{t(p.blurb)}</p>

                    <dl className="mb-5 flex flex-wrap gap-6">
                      {p.metrics.map((m, j) => (
                        <div key={j}>
                          <dt className="mono m-0 text-[10px] text-muted-2">{t(m.k)}</dt>
                          <dd className="mono num m-0 text-[15px] text-signal">{m.v}</dd>
                        </div>
                      ))}
                    </dl>

                    <div className="mb-6 flex flex-wrap gap-1.5">
                      {p.stack.map((s) => (
                        <span key={s} className="chip">
                          {s}
                        </span>
                      ))}
                    </div>

                    <span className="mono inline-flex items-center gap-2.5 text-[11.5px] text-signal">
                      <span className="relative grid h-4 w-4 shrink-0 place-items-center rounded-full border border-signal">
                        <span className="absolute h-px w-[7px] bg-signal" />
                        <span className="absolute h-[7px] w-px bg-signal transition-transform duration-500 group-hover:rotate-90" />
                      </span>
                      {t(ui.readCase)}
                    </span>
                  </div>

                  <div className="hairline relative order-1 min-h-[220px] border-b bg-[#09101d] lg:order-2 lg:min-h-[320px] lg:border-b-0 lg:border-l">
                    <ProjectCanvas kind={p.sim} />
                    <span className="mono absolute bottom-3.5 left-4 rounded bg-[#09101d]/70 px-2 py-1 text-[10px] text-muted-2">
                      {t(p.caption)}
                    </span>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Card with a restrained pointer tilt; the whole surface is the link. */
function Card({ slug, index, children }: { slug: string; index: number; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduce = usePrefersReducedMotion();

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(1400px) rotateX(${-py * 2.2}deg) rotateY(${px * 2.6}deg) translateZ(6px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <Link
      to={`/project/${slug}`}
      ref={ref}
      onMouseMove={move}
      onMouseLeave={leave}
      aria-label={`Project ${index + 1}`}
      data-cursor="open"
      className="group hairline block overflow-hidden rounded-md border bg-ground-2 no-underline will-change-transform [transition:transform_.5s_var(--ease-out-quint),background-color_.5s,border-color_.5s] hover:border-[var(--line-strong)] hover:bg-surface"
    >
      {children}
    </Link>
  );
}
