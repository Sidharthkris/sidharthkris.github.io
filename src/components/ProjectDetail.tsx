import { motion } from "motion/react";
import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { projects, ui } from "../content/site";
import { useLang } from "../lib/lang";
import ProjectCanvas from "./ProjectCanvas";
import ThesisDeepDive from "./ThesisDeepDive";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { t, tl, lang } = useLang();

  const index = projects.findIndex((p) => p.slug === slug);
  const project = projects[index];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!project) return <Navigate to="/" replace />;

  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 0.68, 0, 1] }}
      className="mx-auto w-full max-w-[1360px] px-5 pb-24 pt-28 sm:px-8 lg:px-[72px] lg:pt-36"
    >
      <Link to="/" className="mono mb-8 inline-flex items-center gap-2 text-[11.5px] text-muted transition-colors hover:text-signal" data-cursor="back">
        <span className="h-px w-6 bg-current" />
        {t(ui.back)}
      </Link>

      <p className="mono m-0 mb-4 text-[11px] text-muted-2">{t(project.tag)}</p>
      <h1 className="h-display m-0 max-w-[20ch] text-[clamp(2rem,6vw,4.4rem)] leading-[0.98]">{t(project.title)}</h1>
      <p className="mt-6 max-w-[58ch] text-[clamp(16px,1.8vw,19px)] text-muted">{t(project.blurb)}</p>

      <div className="hairline mt-10 grid gap-px border bg-[var(--line)] sm:grid-cols-3">
        {project.metrics.map((m, i) => (
          <div key={i} className="bg-ground px-5 py-4">
            <dt className="mono m-0 text-[10px] text-muted-2">{t(m.k)}</dt>
            <dd className="mono num m-0 mt-1 text-[22px] text-signal">{m.v}</dd>
          </div>
        ))}
      </div>

      <div className="hairline relative mt-5 h-[280px] overflow-hidden rounded-md border bg-[#09101d] lg:h-[440px]">
        <ProjectCanvas kind={project.sim} />
        <span className="mono absolute bottom-4 left-4 rounded bg-[#09101d]/70 px-2 py-1 text-[10px] text-muted-2">{t(project.caption)}</span>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-3 lg:gap-14">
        <section>
          <h2 className="font-display m-0 mb-2.5 text-[15px] font-medium text-signal">{lang === "de" ? "Problem" : "Problem"}</h2>
          <p className="m-0 text-[15px] leading-[1.62] text-muted">{t(project.problem)}</p>
        </section>
        <section>
          <h2 className="font-display m-0 mb-2.5 text-[15px] font-medium text-signal">{lang === "de" ? "Vorgehen" : "Approach"}</h2>
          <ul className="m-0 list-disc pl-4 text-[15px] text-muted marker:text-muted-2">
            {tl(project.approach).map((a, i) => (
              <li key={i} className="mb-1.5">
                {a}
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-display m-0 mb-2.5 text-[15px] font-medium text-signal">{lang === "de" ? "Ergebnis" : "Result"}</h2>
          <p className="m-0 text-[15px] leading-[1.62] text-muted">{t(project.result)}</p>
        </section>
      </div>

      {(project.repo || project.demo) && (
        <div className="mt-10 flex flex-wrap gap-2.5">
          {project.repo && (
            <a className="btn" href={project.repo} target="_blank" rel="noopener" data-cursor="code">
              <span>{t(ui.viewSource)}</span>
            </a>
          )}
          {project.demo && (
            <a className="btn btn-solid" href={project.demo} target="_blank" rel="noopener" data-cursor="open">
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              <span>{t(ui.liveDemo)}</span>
            </a>
          )}
        </div>
      )}

      <div className="mt-10 flex flex-wrap gap-1.5">
        {project.stack.map((s) => (
          <span key={s} className="chip">
            {s}
          </span>
        ))}
      </div>

      {project.slug === "evacuation-model" && <ThesisDeepDive />}

      <nav className="hairline mt-16 grid gap-px border bg-[var(--line)] sm:grid-cols-2">
        <Link to={`/project/${prev.slug}`} className="group bg-ground px-6 py-6 no-underline transition-colors hover:bg-ground-2" data-cursor="prev">
          <span className="mono block text-[10px] text-muted-2">{lang === "de" ? "vorheriges" : "previous"}</span>
          <span className="font-display mt-1 block text-[18px] tracking-[-0.02em] transition-colors group-hover:text-signal">{t(prev.title)}</span>
        </Link>
        <Link to={`/project/${next.slug}`} className="group bg-ground px-6 py-6 text-right no-underline transition-colors hover:bg-ground-2" data-cursor="next">
          <span className="mono block text-[10px] text-muted-2">{lang === "de" ? "nächstes" : "next"}</span>
          <span className="font-display mt-1 block text-[18px] tracking-[-0.02em] transition-colors group-hover:text-signal">{t(next.title)}</span>
        </Link>
      </nav>
    </motion.article>
  );
}
