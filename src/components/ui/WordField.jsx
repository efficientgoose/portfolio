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
function Rows({ rows, className, style, layerRef }) {
  return (
    <div
      ref={layerRef}
      className={`flex flex-col gap-[10px] py-2 font-mono text-[11px] leading-none sm:gap-3 sm:text-[12px] ${className}`}
      style={style}
    >
      {rows.map((row, r) => (
        <div key={r} className={`overflow-hidden ${r >= MOBILE_ROWS ? "hidden sm:block" : ""}`}>
          {/* Two copies back to back, so sliding by half the width loops seamlessly. */}
          <div className="word-drift flex w-max whitespace-nowrap" style={{ animationDuration: `${row.duration}s` }}>
            {[0, 1].map((copy) => (
              <div key={copy} className="flex gap-6 pr-6">
                {row.words.map((word, w) => (
                  <span key={w}>{word}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const EMPTY_MASK = "linear-gradient(transparent, transparent)";

// Fine speckled grain, the same "dust" as the project hover backdrops. Tinted by the layer's colour.
const DUST =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.1' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.2 -1.1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
const SPOT_RADIUS = 110;
const TRAIL_MS = 500;
const TRAIL_STRENGTH = 0.35;

const glow = (x, y, strength, radius = SPOT_RADIUS) =>
  `radial-gradient(circle ${radius}px at ${x}px ${y}px, rgb(0 0 0 / ${strength}) 0%, rgb(0 0 0 / ${(strength * 0.5).toFixed(3)}) 45%, transparent 100%)`;

// A field of dim words drifting sideways, like the background on cloudflare.com/domains.
// Words under the cursor glow yellow, and the cursor leaves a fading yellow trail behind it.
export default function WordField({ seed = 7, className = "" }) {
  const rows = useRows(seed);
  const boxRef = useRef(null);
  const layerRef = useRef(null);
  const dustRef = useRef(null);
  const cursor = useRef(null); // current position while hovering
  const trail = useRef([]); // recent positions, each fading out over TRAIL_MS
  const frame = useRef(0);

  // Redraw the mask every frame until the trail has faded and the cursor has left.
  const paint = () => {
    const now = performance.now();
    trail.current = trail.current.filter((p) => now - p.t < TRAIL_MS);
    // Trail points start faint, ease out quickly and shrink as they fade, so the tail tapers off.
    const layers = trail.current.map((p) => {
      const life = 1 - (now - p.t) / TRAIL_MS;
      return glow(p.x, p.y, life * life * TRAIL_STRENGTH, SPOT_RADIUS * (0.55 + 0.45 * life));
    });
    if (cursor.current) layers.push(glow(cursor.current.x, cursor.current.y, 1));
    const mask = layers.length ? layers.join(", ") : EMPTY_MASK;
    for (const el of [layerRef.current, dustRef.current]) {
      if (!el) continue;
      el.style.maskImage = mask;
      el.style.webkitMaskImage = mask;
    }
    frame.current = layers.length ? requestAnimationFrame(paint) : 0;
  };

  const start = () => {
    if (!frame.current) frame.current = requestAnimationFrame(paint);
  };

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onMove = (e) => {
    const box = boxRef.current.getBoundingClientRect();
    const point = { x: e.clientX - box.left, y: e.clientY - box.top };
    const last = trail.current[trail.current.length - 1];
    // Drop a trail point every few pixels, capped so the mask stays cheap.
    if (!last || Math.hypot(point.x - last.x, point.y - last.y) > 28) {
      trail.current.push({ ...point, t: performance.now() });
      if (trail.current.length > 10) trail.current.shift();
    }
    cursor.current = point;
    start();
  };

  const onLeave = () => {
    if (cursor.current) trail.current.push({ ...cursor.current, t: performance.now() });
    cursor.current = null;
    start();
  };

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative w-full select-none overflow-hidden ${className}`}
    >
      <Rows rows={rows} className="text-muted opacity-50" />
      {/* Yellow dust that hangs around the cursor and fades with the trail, behind the lit words. */}
      <div
        ref={dustRef}
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundColor: "var(--spot)",
          WebkitMaskImage: EMPTY_MASK,
          maskImage: EMPTY_MASK,
          transform: "translateZ(0)",
        }}
      >
        <div className="size-full bg-background" style={{ WebkitMaskImage: DUST, maskImage: DUST }} />
      </div>
      {/* A yellow copy of the same drifting words, visible only where the cursor is or has just been.
          Its own compositing layer, so Chrome applies the mask over the animating rows. */}
      <Rows
        rows={rows}
        layerRef={layerRef}
        className="absolute inset-0 text-[color:var(--spot)]"
        style={{
          WebkitMaskImage: EMPTY_MASK,
          maskImage: EMPTY_MASK,
          transform: "translateZ(0)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
