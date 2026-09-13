import { motion, useReducedMotion } from "motion/react";
import { about, contact, experience, profile, skills } from "../content/site";
import { useCountUp, useVisitorCount } from "../lib/useVisitorCount";
import ContactCard from "./ContactCard";
import { useLang } from "../lib/lang";
import { Reveal, SectionHead, SplitLines } from "./primitives";

const WRAP = "mx-auto w-full max-w-[1360px] px-5 py-20 sm:px-8 lg:px-[72px] lg:py-[150px]";

/* --------------------------------------------------------------- About */

export function About() {
  const { t, tl } = useLang();
  return (
    <section id="about">
      <div className={WRAP}>
        <SectionHead title={t(about.title)} meta={t(about.meta)} />
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.85fr] lg:gap-[90px]">
          <Reveal>
            <p className="font-display m-0 mb-7 max-w-[24ch] text-[clamp(1.25rem,2.7vw,2rem)] font-light leading-[1.32] tracking-[-0.02em]">
              {t(about.lead)}
            </p>
            {tl(about.body).map((para, i) => (
              <p key={i} className="mt-4 max-w-[60ch] text-muted first:mt-0">
                {para}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.08}>
            <dl className="rule m-0">
              {about.facts.map((f, i) => (
                <div key={i} className="hairline flex justify-between gap-4 border-b py-3.5">
                  <dt className="mono shrink-0 text-[11px] text-muted-2">{t(f.k)}</dt>
                  <dd className={`m-0 text-right text-[14.5px] ${i === 1 ? "text-signal" : ""}`}>{t(f.v)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Ticker */

export function Ticker() {
  const reduce = useReducedMotion();
  const items = ["Java 17", "Spring Boot 3", "PostgreSQL", "React 19", "TypeScript", "Docker", "NetLogo", "GOAL", "Selenium", "JUnit 5", "GitHub Actions", "Maven", "Python", "Vite"];
  const strip = [...items, ...items];

  return (
    <div className="hairline overflow-hidden border-y py-3" aria-hidden>
      <motion.div
        className="mono flex w-max gap-8 whitespace-nowrap text-[11px] text-muted-2"
        animate={reduce ? undefined : { x: ["0%", "-50%"] }}
        transition={{ duration: 38, ease: "linear", repeat: Infinity }}
      >
        {strip.map((s, i) => (
          <span key={i} className="flex items-center gap-8">
            {s}
            <span className="h-1 w-1 rounded-full bg-agent/50" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------- Skills */

export function Skills() {
  const { t } = useLang();
  return (
    <section id="skills">
      <div className={WRAP}>
        <SectionHead title={t(skills.title)} meta={t(skills.meta)} />
        <Reveal>
          <div className="hairline grid gap-px border bg-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
            {skills.groups.map((g, i) => (
              <div key={i} className="bg-ground px-6 pb-7 pt-6 transition-colors duration-500 hover:bg-ground-2">
                <h3 className="font-display m-0 mb-1 text-[19px] font-medium tracking-[-0.02em]">{t(g.name)}</h3>
                <span className="mono mb-4 block text-[10.5px] text-muted-2">{t(g.note)}</span>
                <ul className="m-0 flex list-none flex-wrap gap-[7px] p-0">
                  {g.items.map((item) => (
                    <li key={item} className="chip transition-colors hover:border-signal hover:text-signal">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- Experience */

export function Experience() {
  const { t, tl, lang } = useLang();
  return (
    <section id="work">
      <div className={WRAP}>
        <SectionHead title={t(experience.title)} meta={t(experience.meta)} />
        <div>
          {experience.rows.map((row, i) => (
            <Reveal key={i} as="article" className="group hairline relative grid gap-3 border-t py-7 last:border-b lg:grid-cols-[150px_1fr] lg:gap-14">
              <span className="absolute left-0 top-[-1px] h-px w-0 bg-signal transition-all duration-700 group-hover:w-full" />
              <div className="mono pt-1 text-[11.5px] text-muted-2">
                <b className="block font-normal text-muted">{row.when}</b>
                {t(row.place)}
              </div>
              <div>
                <h3 className={`font-display m-0 text-[clamp(1.15rem,2.3vw,1.6rem)] tracking-[-0.02em] ${row.kind === "edu" ? "font-light" : "font-medium"}`}>
                  {t(row.role)}
                </h3>
                <p className={`mono mb-3 mt-1.5 text-[12px] ${row.kind === "edu" ? "text-agent" : "text-signal"}`}>
                  {typeof row.org === "string" ? row.org : row.org[lang]}
                </p>
                {tl(row.points).length > 0 && (
                  <ul className="m-0 list-disc pl-[18px] text-[15px] text-muted marker:text-muted-2">
                    {tl(row.points).map((p, j) => (
                      <li key={j} className="mb-1">
                        {p}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Contact */

export function Contact() {
  const { t, tl } = useLang();
  const visits = useVisitorCount();
  const shown = useCountUp(visits);

  return (
    <section id="contact" className="relative overflow-hidden">
      <div className={`${WRAP} pb-12 lg:pb-20`}>
        <SectionHead title={t(contact.title)} meta={t(contact.meta)} />

        <a href={`mailto:${profile.email}`} className="group mb-12 block no-underline" data-cursor="write">
          <span className="h-display block text-[clamp(2.2rem,9vw,7.5rem)] leading-[0.92] tracking-[-0.045em] transition-colors duration-500 group-hover:text-signal">
            <SplitLines lines={tl(contact.ctaLines)} />
          </span>
        </a>

        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-14">
          <Reveal>
            <p className="m-0 max-w-[34ch] text-[clamp(16px,1.9vw,20px)] leading-snug text-muted">{t(contact.body)}</p>
          </Reveal>
          <Reveal delay={0.06}>
            <ContactCard />
          </Reveal>
        </div>
      </div>

      <footer className="hairline mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t px-5 pb-9 pt-5 sm:px-8 lg:px-[72px]">
        <p className="m-0 text-[13.5px] text-muted">
          {t(contact.footerCredit)} <span className="text-ink">{profile.name}</span>
          <Heart />
        </p>
        <div className="mono flex flex-wrap items-center gap-x-5 gap-y-2 text-[10.5px] text-muted-2">
          {visits !== null && (
            <span className="num">
              {shown.toLocaleString("en-US")} {t(contact.visitors)}
            </span>
          )}
          <span>{t(contact.footer)}</span>
        </div>
      </footer>
    </section>
  );
}

/** A heart that keeps time rather than throbbing — it beats twice, then rests. */
function Heart() {
  const reduce = useReducedMotion();
  return (
    <motion.span
      className="ml-2 inline-block align-middle text-signal"
      aria-hidden
      animate={reduce ? undefined : { scale: [1, 1.28, 1, 1.18, 1, 1, 1, 1] }}
      transition={{ duration: 2.4, times: [0, 0.06, 0.14, 0.2, 0.28, 0.5, 0.75, 1], repeat: Infinity, ease: "easeOut" }}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 14.5S1 10.3 1 5.9A3.9 3.9 0 0 1 8 3.6 3.9 3.9 0 0 1 15 5.9c0 4.4-7 8.6-7 8.6Z" />
      </svg>
    </motion.span>
  );
}
