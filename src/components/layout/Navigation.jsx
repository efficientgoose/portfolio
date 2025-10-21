import { Terminal } from "lucide-react";

export default function Navigation() {
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

        {/* Right side: navigation links */}
        <div className="flex gap-6 text-sm text-gray-300 items-center">
          <a
            href="#about"
            className="hover:text-green-400 transition-all"
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow =
                "0 0 10px rgba(74, 222, 128, 0.9), 0 0 20px rgba(74, 222, 128, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "none";
            }}
          >
            /about
          </a>

          <a
            href="#skills"
            className="hover:text-green-400 transition-all"
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow =
                "0 0 10px rgba(74, 222, 128, 0.9), 0 0 20px rgba(74, 222, 128, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "none";
            }}
          >
            /skills
          </a>

          <a
            href="#experience"
            className="hover:text-green-400 transition-all"
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow =
                "0 0 10px rgba(74, 222, 128, 0.9), 0 0 20px rgba(74, 222, 128, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "none";
            }}
          >
            /experience
          </a>

          <a
            href="#projects"
            className="hover:text-green-400 transition-all"
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow =
                "0 0 10px rgba(74, 222, 128, 0.9), 0 0 20px rgba(74, 222, 128, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "none";
            }}
          >
            /projects
          </a>

          <a
            href="#contact"
            className="hover:text-green-400 transition-all"
            onMouseEnter={(e) => {
              e.currentTarget.style.textShadow =
                "0 0 10px rgba(74, 222, 128, 0.9), 0 0 20px rgba(74, 222, 128, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.textShadow = "none";
            }}
          >
            /contact
          </a>
        </div>
      </div>
    </nav>
  );
}
