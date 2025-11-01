import React, { useEffect, useState } from "react";
import Navigation from "./components/layout/Navigation";
import Footer from "./components/layout/Footer";
import Hero from "./components/sections/Hero.jsx";
import Skills from "./components/sections/Skills";
import Experience from "./components/sections/Experience";
import Contact from "./components/sections/Contact";
import Terminal from "./components/terminal/Terminal";
import BackgroundEffects from "./components/effects/BackgroundEffects";
import { useTerminal } from "./hooks/useTerminal";
import LoadingScreen from "./components/effects/LoadingScreen";

export default function Portfolio() {
  const {
    terminalOpen,
    setTerminalOpen,
    terminalHistory,
    currentCommand,
    setCurrentCommand,
    executeCommand,
    terminalEndRef,
  } = useTerminal();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 font-mono relative overflow-hidden">
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      <BackgroundEffects />

      <div className="relative z-10">
        <Navigation />
        <Hero onTerminalToggle={() => setTerminalOpen(!terminalOpen)} />
        <Skills />
        <Experience />
        {/* <Projects /> */}
        <Contact />
        <Footer />
      </div>

      <Terminal
        terminalOpen={terminalOpen}
        setTerminalOpen={setTerminalOpen}
        terminalHistory={terminalHistory}
        currentCommand={currentCommand}
        setCurrentCommand={setCurrentCommand}
        executeCommand={executeCommand}
        terminalEndRef={terminalEndRef}
      />
    </div>
  );
}



