import { useEffect, useRef } from "react";
import { formatCount } from "../../lib/waitlist";

const START_DELAY_MS = 80; // lets the number start as its card fades in
const TAIL = 30; // the last values, covered at the slow rate
const FAST = 7; // decay rates per second
const SLOW = 2;

// Where the count stands `seconds` after it starts. Two decays added together: nearly all of the
// number is covered quickly in the first second, and the last few dozen slowly, so the final values
// tick over one at a time, each a little later than the one before.
function valueAt(target: number, seconds: number) {
  const tail = Math.min(TAIL, target);
  const left = (target - tail) * Math.exp(-FAST * seconds) + tail * Math.exp(-SLOW * seconds);
  return left < 0.8 ? target : Math.round(target - left);
}

// A number that runs from 0 up to `value` each time `run` turns true: fast first, slow last.
// The text is written straight to the DOM each frame, skipping React renders. With reduced motion,
// or while `run` is false, it simply shows the value.
export default function CountUp({ value, run, className }: { value: number; run: boolean; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!run || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = formatCount(value);
      return;
    }
    el.textContent = "0";
    let frame = 0;
    let start: number | null = null;
    const tick = (now: number) => {
      start ??= now;
      const current = valueAt(value, Math.max(0, now - start - START_DELAY_MS) / 1000);
      el.textContent = formatCount(current);
      if (current < value) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, run]);

  return (
    <span ref={ref} className={className}>
      {formatCount(value)}
    </span>
  );
}
