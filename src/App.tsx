import { useEffect, useState } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import Cursor from "./components/Cursor";
import CommandPalette from "./components/CommandPalette";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Preloader from "./components/Preloader";
import Projects from "./components/Projects";
import ScrollToTop from "./components/ScrollToTop";
import ProjectDetail from "./components/ProjectDetail";
import { About, Contact, Experience, Skills, Ticker } from "./components/Sections";
import { usePrefersReducedMotion } from "./lib/hooks";
import { LangProvider } from "./lib/lang";
import { startSmoothScroll, stopSmoothScroll } from "./lib/smoothScroll";

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Ticker />
      <Skills />
      <Experience />
      <Projects />
      <Contact />
    </>
  );
}

function Shell() {
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const reduce = usePrefersReducedMotion();

  // Smooth scrolling only starts once the curtain is up, so the page can't be
  // scrolled behind the loading screen.
  useEffect(() => {
    if (!booted) return;
    startSmoothScroll(!reduce);
    return () => stopSmoothScroll();
  }, [reduce, booted]);

  return (
    <>
      <a
        href="#about"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded focus:bg-signal focus:px-4 focus:py-2 focus:text-[#05231a]"
      >
        Skip to content
      </a>
      <Preloader onDone={() => setBooted(true)} />
      <Cursor />
      <Header onOpenPalette={() => setPaletteOpen(true)} />
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />
      <ScrollToTop />
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/project/:slug" element={<ProjectDetail />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <HashRouter>
        <Shell />
      </HashRouter>
    </LangProvider>
  );
}
