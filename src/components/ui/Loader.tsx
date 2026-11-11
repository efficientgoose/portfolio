import { useEffect } from "react";

const OPEN_MS = 900;
// Longest step one frame may advance the reveal. On a cold first load the browser can stall for
// hundreds of ms (GPU start-up, image decodes, fonts); capping the step pauses the reveal through a
// stall instead of letting it jump ahead, so it always plays in full.
const MAX_STEP_MS = 34;

// First-load reveal, as on rinkitadhana.com: a dot grows into a circle, then the circle
// opens like a lens and fades as it grows until the page underneath fills the screen.
// The curtain itself is plain markup in index.html (#loader), so the dot starts growing as soon as
// the page paints, while the script is still downloading. This component runs the second half: once
// the page has rendered and the circle is full, it opens the lens, then removes the curtain.
export default function Loader() {
  useEffect(() => {
    const loader = document.getElementById("loader");
    if (!loader) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      loader.remove();
      return;
    }

    const { overflow } = document.documentElement.style;
    document.documentElement.style.overflow = "hidden";
    let cancelled = false;
    let frame = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const finish = () => {
      loader.remove();
      document.documentElement.style.overflow = overflow;
    };

    const open = () => {
      if (cancelled) return;
      loader.classList.add("is-opening");
      // The CSS keyframes define the look; this loop drives their clock one painted frame at a time.
      const animations = loader.getAnimations?.({ subtree: true }) ?? [];
      if (!animations.length) {
        timer = setTimeout(finish, OPEN_MS);
        return;
      }
      animations.forEach((a) => a.pause());
      let elapsed = 0;
      let last: number | null = null;
      const tick = (now: number) => {
        if (last !== null) elapsed = Math.min(OPEN_MS, elapsed + Math.min(now - last, MAX_STEP_MS));
        last = now;
        animations.forEach((a) => (a.currentTime = elapsed));
        if (elapsed >= OPEN_MS) finish();
        else frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    };

    // Let the dot finish growing into the circle first; on a slow connection it already has.
    const growing = loader.getAnimations?.() ?? [];
    Promise.all(growing.map((a) => a.finished)).then(open, open);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      document.documentElement.style.overflow = overflow;
    };
  }, []);

  return null;
}
