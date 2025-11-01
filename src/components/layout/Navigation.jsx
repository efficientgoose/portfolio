import { Terminal, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "#skills", label: "/skills" },
    { href: "#experience", label: "/experience" },
    { href: "#contact", label: "/contact" },
  ];

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 px-3 py-2 md:px-6 md:py-4 z-50 shadow-lg shadow-black/50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 text-green-400 text-sm md:text-base">
            <Terminal size={16} className="md:w-[18px] md:h-[18px]" />
            <a
              href="#"
              aria-label="Go to home page"
              className="transition-all"
              onMouseEnter={(e) => {
                e.currentTarget.style.textShadow =
                  "0 0 10px rgba(74, 222, 128, 0.9), 0 0 20px rgba(74, 222, 128, 0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textShadow = "none";
              }}
            >
              <span>ajkale.com</span>
            </a>
          </div>

          <div className="hidden md:flex gap-6 text-sm text-gray-300 items-center">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="hover:text-green-400 transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow =
                    "0 0 10px rgba(74, 222, 128, 0.9), 0 0 20px rgba(74, 222, 128, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 text-green-400 hover:text-green-300 transition-all"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[48px] left-0 right-0 bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/50 z-40 animate-[slideDown_300ms_ease-out]">
          <div className="flex flex-col py-3 px-4 gap-3">
            {navLinks.map((link, index) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="text-gray-300 hover:text-green-400 transition-all py-2 border-b border-white/10 last:border-b-0 text-sm"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animation: "fadeIn 300ms ease-out forwards",
                  opacity: 0,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.textShadow =
                    "0 0 10px rgba(74, 222, 128, 0.9), 0 0 20px rgba(74, 222, 128, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
