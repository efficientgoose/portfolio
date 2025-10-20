import { Terminal } from "lucide-react";

export default function Navigation() {
  return (
    <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-xl border-b border-white/10 px-6 py-4 z-50 shadow-lg shadow-black/50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2 text-green-400 text-base">
          <Terminal size={18} />
          <a href="#">
            <span>ajkale.com</span>
          </a>
        </div>
        <div className="flex gap-6 text-sm text-gray-300 items-center">
          <a href="#about" className="hover:text-green-400 transition-colors">
            /about
          </a>
          <a href="#skills" className="hover:text-green-400 transition-colors">
            /skills
          </a>
          <a
            href="#experience"
            className="hover:text-green-400 transition-colors"
          >
            /experience
          </a>
          <a
            href="#projects"
            className="hover:text-green-400 transition-colors"
          >
            /projects
          </a>
          <a href="#contact" className="hover:text-green-400 transition-colors">
            /contact
          </a>
        </div>
      </div>
    </nav>
  );
}
