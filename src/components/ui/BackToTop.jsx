import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "../../lib/cn";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "group fixed bottom-4 right-4 z-50 cursor-pointer rounded-[10px] border border-border bg-background p-[2px] shadow-lg transition-all duration-300 ease-in-out sm:bottom-8 sm:right-8",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-10 opacity-0",
      )}
    >
      <span className="flex items-center justify-center rounded-[8px] border border-border bg-non-hover p-1.5 text-background transition duration-300 group-hover:bg-hover">
        <ArrowUp className="size-5" />
      </span>
    </button>
  );
}
