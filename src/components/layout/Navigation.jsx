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
    <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 z-50 shadow-lg shadow-black/50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Left side: logo */}
        <div className="flex items-center gap-2 text-green-400 text-base">
          <Terminal size={18} />
          <a
            href="#"
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

        {/* Desktop navigation links */}
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

        {/* Mobile hamburger button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-green-400 hover:text-green-300 transition-all"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-green-500/30 transition-all duration-300 ease-in-out ${
          mobileMenuOpen
            ? "max-h-96 opacity-100"
            : "max-h-0 opacity-0 overflow-hidden"
        }`}
      >
        <div className="flex flex-col py-4 px-6 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleLinkClick}
              className="text-gray-300 hover:text-green-400 transition-all py-2 border-b border-gray-800 last:border-b-0"
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
    </nav>
  );
}
