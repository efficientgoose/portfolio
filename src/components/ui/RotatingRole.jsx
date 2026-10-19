import { useEffect, useState } from "react";

const FADE_MS = 350;

// Cycles through roles with a blur fade, like the subtitle on rinkitadhana.com.
export default function RotatingRole({ roles, interval = 3000, className }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let swap;
    const timer = setInterval(() => {
      if (reduced) {
        setIndex((i) => (i + 1) % roles.length);
        return;
      }
      setVisible(false);
      swap = setTimeout(() => {
        setIndex((i) => (i + 1) % roles.length);
        setVisible(true);
      }, FADE_MS);
    }, interval);
    return () => {
      clearInterval(timer);
      clearTimeout(swap);
    };
  }, [roles.length, interval]);

  return (
    <span className="relative inline-block whitespace-nowrap" aria-live="polite">
      <span
        className={className}
        style={{
          display: "inline-block",
          opacity: visible ? 1 : 0,
          filter: visible ? "blur(0px)" : "blur(6px)",
          transform: visible ? "translateY(0)" : "translateY(2px)",
          transition: `opacity ${FADE_MS}ms ease, filter ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`,
        }}
      >
        {roles[index]}
      </span>
    </span>
  );
}
