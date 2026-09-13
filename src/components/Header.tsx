import { useLocation, useNavigate } from "react-router-dom";
import { profile, ui } from "../content/site";
import { useActiveSection, useScrollProgress } from "../lib/hooks";
import { useLang } from "../lib/lang";
import { scrollToId, scrollToTop } from "../lib/smoothScroll";

const IDS = ["about", "skills", "work", "projects", "contact"] as const;

export default function Header({ onOpenPalette }: { onOpenPalette: () => void }) {
  const { t, lang, toggle } = useLang();
  const progress = useScrollProgress();
  const active = useActiveSection([...IDS]);
  const navigate = useNavigate();
  const onHome = useLocation().pathname === "/";

  const go = (id: string) => {
    if (!onHome) {
      navigate("/");
      setTimeout(() => scrollToId(id), 60);
    } else scrollToId(id);
  };

  return (
    <>
      <div
        aria-hidden
        className="fixed left-0 top-0 z-[120] h-[2px] bg-signal"
        style={{ width: `${progress * 100}%`, transition: "width .1s linear" }}
      />
      <header className="fixed inset-x-0 top-0 z-[110] flex items-center justify-between gap-6 bg-gradient-to-b from-ground/95 to-transparent px-5 py-[18px] backdrop-blur-[2px] sm:px-8 lg:px-[72px]">
        <button
          onClick={() => {
            if (!onHome) navigate("/");
            scrollToTop();
          }}
          className="flex flex-col items-start text-left leading-[1.25]"
          data-cursor="top"
        >
          <b className="font-display text-[15px] font-semibold tracking-[-0.01em]">{profile.name}</b>
          <i className="mono text-[10.5px] not-italic text-muted-2">
            {t(profile.role)}
          </i>
        </button>

        <nav className="hidden items-center gap-7 lg:flex">
          {IDS.map((id) => (
            <button
              key={id}
              onClick={() => go(id)}
              className={`mono relative py-1.5 text-[11.5px] transition-colors ${
                onHome && active === id ? "text-ink" : "text-muted hover:text-ink"
              }`}
              data-cursor={t(ui.nav[id]).toLowerCase()}
            >
              {t(ui.nav[id])}
              <span
                className="absolute bottom-0.5 left-0 h-px bg-signal transition-all duration-500"
                style={{ width: onHome && active === id ? "100%" : 0 }}
              />
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPalette}
            className="hairline mono flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10.5px] text-muted transition-colors hover:text-ink"
            data-cursor="⌘K"
          >
            <span className="hidden sm:inline">{t(ui.cmdHint)}</span>
            <span className="text-signal">⌘K</span>
          </button>
          <button
            onClick={toggle}
            className="hairline mono rounded-full border px-3 py-1.5 text-[10.5px] transition-colors hover:text-ink"
            aria-label={lang === "en" ? "Auf Deutsch umschalten" : "Switch to English"}
            data-cursor={lang === "en" ? "DE" : "EN"}
          >
            <span className={lang === "en" ? "text-signal" : "text-muted-2"}>EN</span>
            <span className="px-1 text-muted-2">/</span>
            <span className={lang === "de" ? "text-signal" : "text-muted-2"}>DE</span>
          </button>
        </div>
      </header>
    </>
  );
}
