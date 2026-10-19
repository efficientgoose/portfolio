import Navigation from "./components/layout/Navigation";
import Hero from "./components/sections/Hero";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Skills from "./components/sections/Skills";
import Contact from "./components/sections/Contact";
import BackToTop from "./components/ui/BackToTop";
import Loader from "./components/ui/Loader";
import { useEffect } from "react";
import { playClickSound } from "./lib/sound";

export default function Portfolio() {
  // One soft click for every button and link on the page. Controls with their own sound
  // (theme toggle, photo shuffle) opt out with `data-own-sound`.
  useEffect(() => {
    const onClick = (e) => {
      const target = e.target.closest("button, a, [role='button']");
      if (target && !target.hasAttribute("data-own-sound")) playClickSound();
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col overflow-x-clip bg-background">
      <Navigation />
      <Hero />
      <main>
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <BackToTop />
      <Loader />
    </div>
  );
}
