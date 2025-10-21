import React, { useEffect, useState } from "react";
import {
  Terminal,
  ExternalLink,
  Github,
  Linkedin,
  Mail,
  Volume2,
  MapPin,
} from "lucide-react";

const TypewriterText = ({
  text,
  speed = 60,
  onComplete,
  displayDuration = 1500,
  cursorColor = "gray-500",
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    } else if (onComplete) {
      const timeout = setTimeout(() => {
        onComplete();
      }, displayDuration);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, speed, onComplete, displayDuration]);

  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
  }, [text]);

  return (
    <span className="tracking-wider">
      {displayedText}
      <span
        className={`inline-block w-1.5 h-3.5 bg-${cursorColor} ml-0.5 translate-y-[1.7px] animate-[blink_1s_step-end_infinite]`}
      ></span>
      <style>{`
        @keyframes blink {
          0%,
          49% {
            opacity: 1;
          }
          50%,
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </span>
  );
};

const StatusIndicator = ({ color = "green" }) => {
  const colorClasses = {
    green: "bg-green-400",
    cyan: "bg-cyan-400",
    orange: "bg-orange-400",
    yellow: "bg-yellow-400",
  };

  return (
    <div className="relative w-2 h-2">
      <div
        className={`absolute w-2 h-2 rounded-full ${colorClasses[color]} animate-ping`}
      ></div>
      <div
        className={`absolute w-2 h-2 rounded-full ${colorClasses[color]}`}
      ></div>
    </div>
  );
};

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

  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    { text: "LOADING_MODULES...", color: "orange", duration: 2000 },
    { text: "INITIALIZING_PROTOCOLS...", color: "cyan", duration: 2000 },
    { text: "ALL_SYSTEMS_OPERATIONAL", color: "green", duration: 10000 },
    { text: "CHECKING_HEALTH_STATUS...", color: "yellow", duration: 2000 },
    { text: "ALL_SYSTEMS_OPERATIONAL", color: "green", duration: 10000 },
  ];

  const currentMessage = messages[messageIndex];

  const handleComplete = () => {
    setMessageIndex((prev) => {
      if (prev === messages.length - 1) {
        return 3;
      }
      return prev + 1;
    });
  };

  const textColorClasses = {
    green: "text-green-400",
    cyan: "text-cyan-400",
    orange: "text-orange-400",
    yellow: "text-yellow-400",
  };

  const cursorColorClasses = {
    green: "green-400",
    cyan: "cyan-400",
    orange: "orange-400",
    yellow: "yellow-400",
  };

  const playNamePronunciation = () => {
    const audio = new Audio("/name-pronunciation.mp3");
    audio.play();
  };

  return (
    <>
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-6 pt-16"
      >
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="mb-4 flex flex-col gap-4">
              <div
                className={`text-sm ${
                  textColorClasses[currentMessage.color]
                } mb-2 flex items-center gap-2 font-mono`}
              >
                <StatusIndicator color={currentMessage.color} />
                <TypewriterText
                  text={currentMessage.text}
                  speed={60}
                  displayDuration={currentMessage.duration}
                  onComplete={handleComplete}
                  cursorColor={cursorColorClasses[currentMessage.color]}
                />
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                <span className="text-gray-700">└─</span>
                <span>STATIONED_AT:</span>
                <MapPin size={12} className="text-green-400/75" />
                <div className="flex gap-1">
                  <span className="text-green-400/75 tracking-tighter">
                    New Delhi, India
                  </span>
                  <span className="text-gray-700">│</span>
                  <span className="text-green-400/75">UTC+5:30</span>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                <h1
                  className="text-5xl font-bold mb-2 bg-gradient-to-r text-green-400 bg-clip-text transition-all cursor-pointer"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.filter =
                      "drop-shadow(0 0 6px rgba(74, 222, 128, 0.6)) drop-shadow(0 0 12px rgba(74, 222, 128, 0.3))";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.filter = "none";
                  }}
                >
                  Ajinkya Kale
                </h1>
                <div className="relative">
                  <button
                    onClick={playNamePronunciation}
                    className="peer mb-2 text-green-400 hover:text-green-300 transition-all hover:scale-110"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.filter =
                        "drop-shadow(0 0 8px rgba(74, 222, 128, 0.8)) drop-shadow(0 0 16px rgba(74, 222, 128, 0.5))";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.filter = "none";
                    }}
                    aria-label="Listen to name pronunciation"
                  >
                    <Volume2 size={20} />
                  </button>
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 px-3 py-2 bg-gray-950 border border-green-500/30 text-green-400 text-xs font-mono rounded whitespace-nowrap opacity-0 peer-hover:opacity-100 transition-all shadow-[0_0_15px_rgba(74,222,128,0.2)] pointer-events-none">
                    Or just call me AJ :)
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] w-2 h-2 rotate-45 bg-gray-950 border-r border-b border-green-500/30"></div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex">
                  <div className="text-xl text-gray-400 mb-1">
                    Backend Developer
                  </div>
                  <div className="text-xl text-gray-400 mb-1">
                    &nbsp;@&nbsp;
                  </div>
                  <a
                    href="https://www.fleetx.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative text-xl text-gray-400 mb-1 underline decoration-dotted decoration-2 decoration-gray-400 underline-offset-4 hover:underline-offset-8 hover:decoration-transparent hover:text-sky-400 transition-all duration-300 after:content-[''] after:absolute after:left-0 after:bottom-[-6px] after:w-full after:h-[2px] after:bg-sky-500 after:opacity-0 after:shadow-[0_0_15px_rgba(14,165,233,1),0_0_30px_rgba(14,165,233,0.6)] hover:after:opacity-100 after:transition-all after:duration-300"
                    style={{
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.textShadow =
                        "0 0 12px rgba(14, 165, 233, 1), 0 0 25px rgba(14, 165, 233, 0.7), 0 0 40px rgba(14, 165, 233, 0.4)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.textShadow = "none";
                    }}
                  >
                    Fleetx
                  </a>
                </div>
              </div>

              <div className="text-sm text-gray-500 max-w-xl">
                <p>Just a laptop, Wi-Fi, and a passion for building things.</p>
                <p>Turning coffee into code, bugs into features. </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6 mb-8">
              <a
                href="#contact"
                className="px-5 py-2 bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded hover:bg-green-500/20 transition-all flex items-center gap-2"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 12px rgba(74, 222, 128, 0.32), 0 0 26px rgba(74, 222, 128, 0.16)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                <Mail size={14} />
                <span>Contact</span>
              </a>

              <a
                href="https://drive.google.com/file/d/1KQibuzFbbTuSuYP_xpdcx4yyFnF1L9Ex/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-sm rounded hover:bg-cyan-500/20 transition-all flex items-center gap-2"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 12px rgba(34, 211, 238, 0.32), 0 0 26px rgba(34, 211, 238, 0.16)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                <ExternalLink size={14} />
                <span>Resume</span>
              </a>

              <button
                onClick={onTerminalToggle}
                className="flex items-center gap-2 px-5 py-2 border border-gray-700 text-gray-400 text-sm rounded hover:border-green-500/30 hover:text-green-400 transition-all group"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 15px rgba(74, 222, 128, 0.3), 0 0 30px rgba(74, 222, 128, 0.15)";
                  e.currentTarget.style.textShadow =
                    "0 0 8px rgba(74, 222, 128, 0.6)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                <Terminal size={16} />
                <span>Launch Terminal</span>
                <span className="text-[10px] text-gray-600 group-hover:text-green-400">
                  (it's fun!)
                </span>
              </button>
            </div>

            <div className="flex gap-6 text-gray-500 mb-12">
              <a
                href="https://github.com/efficientgoose"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-gray-800 rounded hover:border-green-500/30 hover:text-green-400 transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 10px rgba(74, 222, 128, 0.2), 0 0 20px rgba(74, 222, 128, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Github size={18} />
              </a>

              <a
                href="https://linkedin.com/in/ajinkode"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 border border-gray-800 rounded hover:border-green-500/30 hover:text-green-400 transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 10px rgba(74, 222, 128, 0.2), 0 0 20px rgba(74, 222, 128, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Linkedin size={18} />
              </a>

              <a
                href="mailto:ajinkode@gmail.com"
                className="p-2.5 border border-gray-800 rounded hover:border-green-500/30 hover:text-green-400 transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 0 10px rgba(74, 222, 128, 0.2), 0 0 20px rgba(74, 222, 128, 0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Mail size={18} />
              </a>
            </div>

            {/* TODO: Add something better than this -- it's too cringe */}
            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="bg-white/5 border border-gray-800 rounded p-4 flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <div className="relative w-2 h-2">
                  <div className="absolute w-2 h-2 rounded-full bg-green-400 animate-ping"></div>
                  <div className="absolute w-2 h-2 rounded-full bg-green-400"></div>
                </div>
                <div className="text-green-400 text-xl/2 font-bold">200 OK</div>
              </div>
              <div className="text-xs text-gray-500">Status: Alive</div>
            </div>
            <div className="bg-white/5 border border-gray-800 rounded p-4 flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <div className="relative w-2 h-2">
                  <div className="absolute w-2 h-2 rounded-full bg-red-400 animate-ping"></div>
                  <div className="absolute w-2 h-2 rounded-full bg-red-400"></div>
                </div>
                <div className="text-red-400 text-xl/2 font-bold">
                  404 Not Found
                </div>
              </div>

              <div className="text-xs text-gray-500">Work-Life Balance</div>
            </div>
            <div className="bg-white/5 border border-gray-800 rounded p-4 flex flex-col gap-1">
              <div className="flex gap-2 items-center">
                <div className="relative w-2 h-2">
                  <div className="absolute w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
                  <div className="absolute w-2 h-2 rounded-full bg-amber-400"></div>
                </div>
                <div className="text-amber-400 text-xl/2 font-bold">
                  403 Forbidden
                </div>
              </div>

              <div className="text-xs text-gray-500">Weekends</div>
            </div>
          </div> */}
          </div>

          <div className="relative h-[500px] flex items-center justify-center">
            <div className="relative z-10 w-64 h-80 bg-gradient-to-br border-2 border-white rounded-lg overflow-hidden shadow-2xl shadow-green-500/20 transition-all duration-300 hover:border-amber-300/70 hover:shadow-[0_0_18px_rgba(251,146,60,0.35),0_0_35px_rgba(251,146,60,0.2),0_0_50px_rgba(251,146,60,0.1)] hover:cursor-pointer">
              <img
                src="/Main.jpg"
                alt="Ajinkya Kale"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute top-8 left-8 w-48 h-56 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border-2 border-white rounded-lg overflow-hidden shadow-xl transform -rotate-6 hover:rotate-0 transition-all duration-300 hover:border-teal-300/70 hover:shadow-[0_0_18px_rgba(20,184,166,0.35),0_0_35px_rgba(20,184,166,0.2),0_0_50px_rgba(20,184,166,0.1)] hover:cursor-pointer">
              <img
                src="/Left.png"
                alt="Left Pic"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>

            <div className="absolute bottom-12 right-8 w-48 h-56 bg-gradient-to-br from-orange-500/20 to-red-500/20 border-2 border-white rounded-lg overflow-hidden shadow-xl transform rotate-6 hover:rotate-0 transition-all duration-300 hover:border-blue-400/70 hover:shadow-[0_0_22px_rgba(29,78,216,0.5),0_0_45px_rgba(29,78,216,0.35),0_0_65px_rgba(29,78,216,0.2)] hover:cursor-pointer">
              <img
                src="/Bottom-Right.jpg"
                alt="Bottom Right pic"
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 8px rgba(74, 222, 128, 0.4)) drop-shadow(0 0 16px rgba(74, 222, 128, 0.2));
          }
          50% {
            filter: drop-shadow(0 0 4px rgba(74, 222, 128, 0.2)) drop-shadow(0 0 8px rgba(74, 222, 128, 0.1));
          }
        }
      `}</style>
    </>
  );
}
