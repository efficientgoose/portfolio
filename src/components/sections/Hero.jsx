import React, { useEffect } from "react";
import { Terminal, ExternalLink, Github, Linkedin, Mail } from "lucide-react";

export default function Hero({ onTerminalToggle }) {
  useEffect(() => {
    console.log(
      "%c> System initialized",
      "color: #00ff41; font-size: 14px; font-weight: bold;"
    );
    console.log(
      "%c> Developer console detected. Press Ctrl+` to open terminal, Esc to close. Type / for commands.",
      "color: #00ff41; font-size: 11px;"
    );
    console.log(
      "%c> Coffee.brew() → Productivity.maximize()",
      "color: #ffa500; font-size: 11px;"
    );
    console.log(
      "%c> Stack Overflow connection: ACTIVE",
      "color: #ff6b6b; font-size: 11px;"
    );
  }, []);

  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-6 pt-16"
    >
      <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="mb-4 flex flex-col gap-2">
            <div className="text-xs text-green-400 mb-2 flex items-center gap-2">
              <div className="relative w-1.5 h-1.5">
                <div className="absolute w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></div>
                <div className="absolute w-1.5 h-1.5 rounded-full bg-green-400"></div>
              </div>
              <span>SYSTEM_ONLINE</span>
            </div>
            <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
              Ajinkya Kale
            </h1>
            <div className="text-xl text-gray-400 mb-1">Backend Developer</div>
            <div className="text-sm text-gray-500 max-w-xl">
              A functioning laptop and a reliable Wi-Fi is all I need. Building
              scalable systems, one microservice at a time.
            </div>
          </div>

          <div className="flex gap-3 mt-6 mb-8">
            <a
              href="#contact"
              className="px-5 py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded hover:bg-green-500/20 transition-all flex items-center gap-2"
            >
              <Mail size={14} />
              <span>Contact</span>
            </a>

            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm rounded hover:bg-cyan-500/20 transition-all flex items-center gap-2"
            >
              <ExternalLink size={14} />
              <span>Resume</span>
            </a>

            <button
              onClick={onTerminalToggle}
              className="flex items-center gap-2 px-5 py-2 border border-gray-700 text-gray-400 text-sm rounded hover:border-green-500/30 hover:text-green-400 transition-all group"
            >
              <Terminal size={16} />
              <span>Launch Terminal</span>
              <span className="text-[10px] text-gray-600 group-hover:text-green-400">
                Ctrl+`
              </span>
            </button>
          </div>

          <div className="flex gap-4 text-gray-500 mb-12">
            <a
              href="https://github.com/efficientgoose"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              <Github size={18} />
            </a>

            <a
              href="https://linkedin.com/in/ajinkode"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-400 transition-colors"
            >
              <Linkedin size={18} />
            </a>

            <a
              href="mailto:ajinkode@gmail.com"
              className="hover:text-green-400 transition-colors"
            >
              <Mail size={18} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white/5 border border-gray-800 rounded p-4 flex flex-col gap-1">
              <div className="text-green-400 text-xl/2 font-bold">200 OK</div>
              <div className="text-xs text-gray-500">Status: Alive</div>
            </div>
            <div className="bg-white/5 border border-gray-800 rounded p-4 flex flex-col gap-1">
              <div className="text-red-400 text-xl/2 font-bold">
                404 Not Found
              </div>
              <div className="text-xs text-gray-500">Work-Life Balance</div>
            </div>
            <div className="bg-white/5 border border-gray-800 rounded p-4 flex flex-col gap-1">
              <div className="text-amber-400 text-xl/2 font-bold">
                403 Forbidden
              </div>
              <div className="text-xs text-gray-500">Weekends</div>
            </div>
          </div>
        </div>

        {/* Right Column - Images */}
        <div className="relative h-[500px] flex items-center justify-center">
          <div className="relative z-10 w-64 h-80 bg-gradient-to-br from-green-500/20 to-cyan-500/20 border border-green-500/30 rounded-lg overflow-hidden shadow-2xl shadow-green-500/20">
            <img
              src="/Main.jpeg"
              alt="Ajinkya Kale"
              className="w-full h-full object-cover"
              style={{
                filter: "sepia(0.3) hue-rotate(60deg) saturate(1.2)",
              }}
            />
          </div>

          <div className="absolute top-8 left-8 w-48 h-56 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg overflow-hidden shadow-xl transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <img
              src="/Left.png"
              alt="Left Pic"
              className="w-full h-full object-cover"
              style={{
                filter: "sepia(0.3) hue-rotate(60deg) saturate(1.2)",
              }}
            />
          </div>

          <div className="absolute bottom-12 right-8 w-48 h-56 bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-lg overflow-hidden shadow-xl transform rotate-6 hover:rotate-0 transition-transform duration-300">
            <img
              src="/Bottom-Right.jpg"
              alt="Bottom Right pic"
              className="w-full h-full object-cover"
              style={{
                filter: "sepia(0.3) hue-rotate(60deg) saturate(1.2)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
