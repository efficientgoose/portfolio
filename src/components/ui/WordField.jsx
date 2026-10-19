import { useEffect, useMemo, useRef } from "react";

// Vocabulary from the work: the stack, the systems and the products.
const WORDS = [
  "java",
  "spring-boot",
  "netty",
  "kafka",
  "spark",
  "redis",
  "postgres",
  "cassandra",
  "scylladb",
  "docker",
  "kubernetes",
  "aws",
  "linux",
  "rest",
  "graphql",
  "microservices",
  "streaming",
  "pipelines",
  "telemetry",
  "iot",
  "anchora",
  "atlas",
  "supabase",
  "nextjs",
  "typescript",
  "python",
  "langchain",
  "vercel",
  "git",
  "jenkins",
  "maven",
  "gradle",
  "junit",
  "elasticsearch",
  "rabbitmq",
  "mysql",
  "mongodb",
  "fleetx",
  "backend",
  "realtime",
  "latency",
  "throughput",
  "partitions",
  "consumers",
  "producers",
  "schemas",
  "migrations",
  "rls",
  "webhooks",
  "cron",
  "queues",
  "caching",
  "sharding",
  "replicas",
  "observability",
  "markiniser",
  "serene",
  "ajkale",
];

const ROWS = 9;
const MOBILE_ROWS = 5;
const PER_ROW = 28; // enough that one copy spans even very wide screens, so the loop never shows a gap

// Small seeded shuffle so each band gets its own stable arrangement.
function seeded(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function useRows(seed) {
  return useMemo(() => {
    const rand = seeded(seed);
    return Array.from({ length: ROWS }, () => ({
      // Every row drifts the same way; a slightly different pace keeps the field from looking like one sheet.
      duration: 60 + Math.floor(rand() * 40),
      words: Array.from({ length: PER_ROW }, () => WORDS[Math.floor(rand() * WORDS.length)]),
    }));
  }, [seed]);
}

// Rows sit at natural line spacing rather than being stretched to a fixed height,
// so they never crush together; phones show fewer rows in slightly smaller type.
function Rows({ rows }) {
  return (
    <div className="flex flex-col gap-[10px] py-2 font-mono text-[11px] leading-none sm:gap-3 sm:text-[12px]">
      {rows.map((row, r) => (
        <div key={r} className={`overflow-hidden ${r >= MOBILE_ROWS ? "hidden sm:block" : ""}`}>
          {/* Two copies back to back, so sliding by half the width loops seamlessly. */}
          <div className="word-drift flex w-max whitespace-nowrap" style={{ animationDuration: `${row.duration}s` }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-6 pr-6">
                {row.words.map((word, w) => (
                  <span key={w} className="field-word">
                    {word}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const RADIUS = 80; // words within this distance of the cursor light up; the inner part is fully lit
const HOLD_MS = 300; // a lit word keeps its colour this long after the cursor moves on
const FADE_MS = 1000; // then eases back to dim; older parts of the path are always dimmer than newer ones

// A field of dim words drifting sideways, like the background on cloudflare.com/domains.
// Words near the cursor turn yellow in proportion to how close they are, then fade out,
// leaving a short trail that tapers off behind the cursor.
export default function WordField({ seed = 7, className = "" }) {
  const rows = useRows(seed);
  const boxRef = useRef(null);
  const heat = useRef(new Map()); // word element -> { level, t } at the moment it was last lit
  const frame = useRef(0);
  const pointer = useRef(null);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // How lit a word still is right now, after fading since it was last touched.
  const current = (entry, now) =>
    entry ? entry.level * Math.min(1, Math.max(0, 1 - (now - entry.t - HOLD_MS) / FADE_MS)) : 0;

  // Checked once per frame at most, since the words keep moving under the cursor.
  const lightNearby = () => {
    frame.current = 0;
    const p = pointer.current;
    if (!p) return;
    const now = performance.now();
    for (const el of boxRef.current.querySelectorAll(".field-word")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      const distance = Math.hypot(r.left + r.width / 2 - p.x, r.top + r.height / 2 - p.y);
      if (distance > RADIUS) continue;
      const level = Math.min(1, (1 - distance / RADIUS) * 1.8);
      if (level <= current(heat.current.get(el), now)) continue;
      heat.current.set(el, { level, t: now });
      // Jump to the new brightness, then on the next frame let it ease back to dim.
      el.style.transition = "none";
      el.style.color = `color-mix(in srgb, var(--word-spot) ${Math.round(level * 100)}%, var(--muted))`;
      el.style.opacity = String(0.5 + 0.5 * level);
      requestAnimationFrame(() => {
        // Hold briefly, then ease out gently, so the colour drains gradually instead of dropping at the end.
        const fade = `${FADE_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1) ${HOLD_MS}ms`;
        el.style.transition = `color ${fade}, opacity ${fade}`;
        el.style.color = "";
        el.style.opacity = "";
      });
    }
  };

  const onMove = (e) => {
    pointer.current = { x: e.clientX, y: e.clientY };
    if (!frame.current) frame.current = requestAnimationFrame(lightNearby);
  };

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      onMouseMove={onMove}
      onMouseLeave={() => (pointer.current = null)}
      className={`relative w-full select-none overflow-hidden ${className}`}
    >
      <Rows rows={rows} />
    </div>
  );
}
