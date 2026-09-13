import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import cvFile from "../assets/Sidharth-Vijayan-Krishnan-CV.pdf";
import { contact, profile, ui } from "../content/site";
import { useLang } from "../lib/lang";
import { Magnetic } from "./primitives";

/** The email address, large and copyable, with the rest of the ways to reach me. */
export default function ContactCard() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      // Clipboard blocked (insecure context or permissions) — select it instead.
      const input = document.createElement("input");
      input.value = profile.email;
      document.body.appendChild(input);
      input.select();
      document.execCommand?.("copy");
      input.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="hairline overflow-hidden rounded-md border bg-ground-2">
      {/* ---------------------------------------------------------- email */}
      <div className="hairline border-b p-6 sm:p-8">
        <span className="mono mb-3 block text-[10.5px] text-muted-2">{t(contact.card.label)}</span>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-4">
          <button
            onClick={copy}
            data-cursor={t(contact.card.copy).toLowerCase()}
            className="group mono relative text-left text-[clamp(1rem,2.6vw,1.55rem)] tracking-[-0.01em] text-ink transition-colors hover:text-signal"
          >
            {profile.email}
            <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-signal transition-transform duration-500 group-hover:scale-x-100" />
          </button>

          <div className="flex items-center gap-3">
            <Magnetic strength={0.2}>
              <button onClick={copy} className="btn" data-cursor={t(contact.card.copy).toLowerCase()}>
                <CopyIcon copied={copied} />
                <span>{copied ? t(contact.card.copied) : t(contact.card.copy)}</span>
              </button>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a className="btn btn-solid" href={`mailto:${profile.email}`} data-cursor="write">
                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                <span>{t(contact.card.write)}</span>
              </a>
            </Magnetic>
          </div>
        </div>

        <AnimatePresence>
          {copied && (
            <motion.p
              className="mono m-0 mt-3 text-[11px] text-signal"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {profile.email} → {t(contact.card.copied).toLowerCase()}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ---------------------------------------------------------- links */}
      <div className="hairline border-b p-6 sm:px-8">
        <span className="mono mb-3 block text-[10.5px] text-muted-2">{t(contact.card.elsewhere)}</span>
        <div className="flex flex-wrap gap-2.5">
          <Magnetic strength={0.2}>
            <a className="btn" href={profile.links.linkedin} target="_blank" rel="noopener" data-cursor="open">
              <span>LinkedIn</span>
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a className="btn" href={profile.links.github} target="_blank" rel="noopener" data-cursor="open">
              <span>GitHub</span>
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a className="btn" href={cvFile} download="Sidharth-Vijayan-Krishnan-CV.pdf" data-cursor="pdf">
              <span>{t(ui.downloadCv)}</span>
            </a>
          </Magnetic>
        </div>
      </div>

      {/* ----------------------------------------------------- quick facts */}
      <dl className="m-0 flex flex-wrap gap-x-8 gap-y-2 px-6 py-4 sm:px-8">
        {contact.card.rows.map((r, i) => (
          <div key={i} className="flex items-baseline gap-2.5">
            <dt className="mono m-0 text-[10px] text-muted-2">{t(r.k)}</dt>
            <dd className="m-0 text-[13.5px] text-ink">{t(r.v)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function CopyIcon({ copied }: { copied: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0">
      {copied ? (
        <path d="M3 8.5 6.2 12 13 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M10.5 3.5h-7a1 1 0 0 0-1 1v7" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
