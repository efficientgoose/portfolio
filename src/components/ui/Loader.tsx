import { useEffect, useRef, useState } from "react";

const TOTAL_MS = 1500;
// Longest step one frame may advance the reveal. On a cold first load the browser can stall for
// hundreds of ms (GPU start-up, image decodes, fonts); capping the step pauses the reveal through a
// stall instead of letting it jump ahead, so it always plays in full.
const MAX_STEP_MS = 34;

// First-load reveal, as on rinkitadhana.com: a dot grows into a circle, then the circle
// opens like a lens and fades as it grows until the page underneath fills the screen.
export default function Loader() {
  const [done, setDone] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) return;
    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";

    // The CSS keyframes define the look; this loop drives their clock one painted frame at a time.
    const animations = ref.current?.getAnimations?.({ subtree: true }) ?? [];
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    if (animations.length) {
      animations.forEach((a) => a.pause());
      let elapsed = 0;
      let last: number | null = null;
      const tick = (now: number) => {
        if (last !== null) elapsed = Math.min(TOTAL_MS, elapsed + Math.min(now - last, MAX_STEP_MS));
        last = now;
        animations.forEach((a) => (a.currentTime = elapsed));
        if (elapsed >= TOTAL_MS) setDone(true);
        else frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    } else {
      timer = setTimeout(() => setDone(true), TOTAL_MS);
    }

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      document.documentElement.style.overflow = overflow;
    };
  }, [done]);

  if (done) return null;

  return (
    <div ref={ref} aria-hidden="true" className="loader pointer-events-auto fixed inset-0 z-[100]">
      <div className="loader-curtain absolute inset-0 bg-background" />
      <div className="loader-disc absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full" />
    </div>
  );
}
