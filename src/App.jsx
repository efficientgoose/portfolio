import Navigation from "./components/layout/Navigation";
import Hero from "./components/sections/Hero";
import Projects from "./components/sections/Projects";
import Experience from "./components/sections/Experience";
import Skills from "./components/sections/Skills";
import Contact from "./components/sections/Contact";
import BackToTop from "./components/ui/BackToTop";
import Loader from "./components/ui/Loader";

export default function Portfolio() {
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
