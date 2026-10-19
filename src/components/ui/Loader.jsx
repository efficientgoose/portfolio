import { useEffect, useState } from "react";

const TOTAL_MS = 1500;

// First-load reveal, as on rinkitadhana.com: a dot grows into a circle, then the circle
// opens like a lens until the page underneath fills the screen.
export default function Loader() {
  const [done, setDone] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    if (done) return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    const timer = setTimeout(() => setDone(true), TOTAL_MS);
    return () => {
      clearTimeout(timer);
      document.documentElement.style.overflow = overflow;
    };
  }, [done]);

  if (done) return null;

  return (
    <div aria-hidden="true" className="pointer-events-auto fixed inset-0 z-[100]">
      <div className="loader-curtain absolute inset-0 bg-background" />
      <div className="loader-disc absolute left-1/2 top-1/2 size-[100px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6e6e6]" />
    </div>
  );
}
