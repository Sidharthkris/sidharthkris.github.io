import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import cvFile from "../assets/Sidharth-Vijayan-Krishnan-CV.pdf";
import { profile, projects, ui } from "../content/site";
import { useLang } from "../lib/lang";
import { scrollToId } from "../lib/smoothScroll";

type Item = { id: string; label: string; hint: string; run: () => void };

export default function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const [flash, setFlash] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<Item[]>(() => {
    const go = (id: string) => () => {
      navigate("/");
      setTimeout(() => scrollToId(id), 60);
      setOpen(false);
    };
    const sections: Item[] = (["about", "skills", "work", "projects", "contact"] as const).map((id) => ({
      id: `s-${id}`,
      label: t(ui.nav[id]),
      hint: lang === "de" ? "Abschnitt" : "Section",
      run: go(id),
    }));

    const projectItems: Item[] = projects.map((p) => ({
      id: `p-${p.slug}`,
      label: t(p.title),
      hint: lang === "de" ? "Projekt" : "Project",
      run: () => {
        navigate(`/project/${p.slug}`);
        setOpen(false);
      },
    }));

    const actions: Item[] = [
      {
        id: "a-mail",
        label: lang === "de" ? `E-Mail an ${profile.email}` : `Email ${profile.email}`,
        hint: lang === "de" ? "Aktion" : "Action",
        run: () => {
          window.location.href = `mailto:${profile.email}`;
          setOpen(false);
        },
      },
      {
        id: "a-copy",
        label: lang === "de" ? "E-Mail-Adresse kopieren" : "Copy email address",
        hint: lang === "de" ? "Aktion" : "Action",
        run: () => {
          navigator.clipboard?.writeText(profile.email);
          setFlash(t(ui.copied));
          setTimeout(() => setFlash(null), 1400);
        },
      },
      {
        id: "a-lang",
        label: lang === "de" ? "Switch to English" : "Auf Deutsch umschalten",
        hint: lang === "de" ? "Sprache" : "Language",
        run: () => {
          setLang(lang === "de" ? "en" : "de");
          setOpen(false);
        },
      },
      {
        id: "a-cv",
        label: t(ui.downloadCv),
        hint: lang === "de" ? "Aktion" : "Action",
        run: () => {
          const a = document.createElement("a");
          a.href = cvFile;
          a.download = "Sidharth-Vijayan-Krishnan-CV.pdf";
          a.click();
          setOpen(false);
        },
      },
      {
        id: "a-github",
        label: "GitHub — Sidharthkris",
        hint: lang === "de" ? "Link" : "Link",
        run: () => {
          window.open(profile.links.github, "_blank", "noopener");
          setOpen(false);
        },
      },
      {
        id: "a-linkedin",
        label: "LinkedIn",
        hint: lang === "de" ? "Link" : "Link",
        run: () => {
          window.open(profile.links.linkedin, "_blank", "noopener");
          setOpen(false);
        },
      },
    ];

    return [...sections, ...projectItems, ...actions];
  }, [lang, navigate, setLang, setOpen, t]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.hint.toLowerCase().includes(q));
  }, [items, query]);

  useEffect(() => setCursor(0), [query, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 30);
    else setQuery("");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!open);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setCursor((c) => Math.min(c + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setCursor((c) => Math.max(c - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        results[cursor]?.run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, results, cursor, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-start justify-center px-4 pt-[14vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            aria-label="Close"
            className="absolute inset-0 cursor-default bg-ground/80 backdrop-blur-[3px]"
            onClick={() => setOpen(false)}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            className="hairline relative w-full max-w-[620px] overflow-hidden rounded-lg border bg-surface/95 shadow-[0_30px_120px_-20px_rgba(0,0,0,.8)]"
            initial={{ y: -14, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 0.68, 0, 1] }}
          >
            <div className="hairline flex items-center gap-3 border-b px-4">
              <span className="mono text-[11px] text-signal">⌘K</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(ui.cmdPlaceholder)}
                className="w-full bg-transparent py-4 text-[15px] text-ink outline-none placeholder:text-muted-2"
              />
              {flash && <span className="mono text-[10px] text-signal">{flash}</span>}
            </div>

            <ul className="max-h-[46vh] list-none overflow-y-auto p-2">
              {results.length === 0 && <li className="mono px-3 py-6 text-[12px] text-muted-2">{t(ui.cmdEmpty)}</li>}
              {results.map((item, i) => (
                <li key={item.id}>
                  <button
                    onMouseEnter={() => setCursor(i)}
                    onClick={item.run}
                    className={`flex w-full items-center justify-between gap-4 rounded px-3 py-2.5 text-left text-[14px] transition-colors ${
                      i === cursor ? "bg-agent/15 text-ink" : "text-muted"
                    }`}
                  >
                    <span className="truncate">{item.label}</span>
                    <span className="mono shrink-0 text-[10px] text-muted-2">{item.hint}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="hairline mono flex items-center justify-between border-t px-4 py-2 text-[10px] text-muted-2">
              <span>↑ ↓ · ↵</span>
              <span>esc</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
