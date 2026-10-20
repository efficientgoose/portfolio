import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, AudioLines, LoaderCircle, Music2, Pause, Play, Shuffle } from "lucide-react";
import { PLAYLIST_URL, favouriteSongs } from "../../data/music";

const SHOWN = 4;
const VOLUME = 0.6;
const FADE_IN_MS = 900;
const FADE_OUT_MS = 450;
const END_FADE_S = 2; // The last seconds of a preview fade out instead of cutting off.

// Apple's official 30-second preview for a song, looked up on first play and cached.
const previews = new Map();
async function findPreview({ id, title, artist }) {
  if (previews.has(id)) return previews.get(id);
  const term = `${title.replace(/\s*\(.*?\)/g, "")} ${artist}`;
  const url = `https://itunes.apple.com/search?${new URLSearchParams({ term, entity: "song", limit: "5" })}`;
  const { results = [] } = await (await fetch(url)).json();
  const found = results.find((r) => r.previewUrl)?.previewUrl ?? null;
  previews.set(id, found);
  return found;
}

// Up to three main colours of a song's cover, as [{ h, s }], strongest first, for the gradient across
// its "now playing" bars (as the iPhone does). Reads a 24x24 copy of the art's centre square (YouTube
// thumbnails are 16:9 with the art in the middle), groups the colourful pixels into 30-degree hue
// slices, and keeps the strongest slices that are a clearly different hue and carry at least an
// eighth of the top slice's weight. Lightness comes from the theme (--bar-l), so the colours stay
// readable in both. Black-and-white or unreadable covers return null (shown in silver). Cached per
// song.
const coverColors = new Map();
function findCoverColors({ id, cover }) {
  if (coverColors.has(id)) return Promise.resolve(coverColors.get(id));
  return new Promise((resolve) => {
    const done = (color) => {
      coverColors.set(id, color);
      resolve(color);
    };
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onerror = () => done(null);
    img.onload = () => {
      try {
        const size = 24;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const side = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);
        const slices = Array.from({ length: 12 }, () => ({ weight: 0, hue: 0, sat: 0 }));
        let colourful = 0;
        for (let p = 0; p < data.length; p += 4) {
          const [h, sat, light] = rgbToHsl(data[p], data[p + 1], data[p + 2]);
          if (sat < 0.25 || light < 0.12 || light > 0.92) continue;
          colourful++;
          const weight = sat * (1 - Math.abs(light - 0.5));
          const slice = slices[Math.floor(h / 30) % 12];
          slice.weight += weight;
          slice.hue += h * weight;
          slice.sat += sat * weight;
        }
        const ranked = slices
          .filter((slice) => slice.weight > 0)
          .map((slice) => ({
            weight: slice.weight,
            h: Math.round(slice.hue / slice.weight),
            s: Math.round(Math.min(85, Math.max(50, (slice.sat / slice.weight) * 100))),
          }))
          .sort((a, b) => b.weight - a.weight);
        // A cover counts as black and white only if under 1% of it has colour; a small accent (the
        // purple title on an otherwise monochrome cover) still sets the colour.
        if (colourful < size * size * 0.01) return done(null);
        const hueGap = (a, b) => Math.min(Math.abs(a - b), 360 - Math.abs(a - b));
        const picked = [ranked[0]];
        for (const c of ranked.slice(1)) {
          if (picked.length === 3 || c.weight < ranked[0].weight * 0.12) break;
          if (picked.every((p) => hueGap(p.h, c.h) >= 30)) picked.push(c);
        }
        done(picked.map(({ h, s }) => ({ h, s })));
      } catch {
        done(null);
      }
    };
    img.src = cover;
  });
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const light = (max + min) / 2;
  if (max === min) return [0, 0, light];
  const d = max - min;
  const sat = light > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, sat, light];
}

// Frequency bins (of 128, ~170Hz each) behind each bar, laid out like the iPhone's Dynamic Island:
// bass and low mids in the middle bars (the busiest), treble at the edges. The last number caps
// each bar's height so the row bulges in the centre.
const BANDS = [
  [24, 48, 0.45],
  [6, 12, 0.75],
  [1, 3, 1],
  [3, 6, 1],
  [12, 24, 0.75],
  [48, 96, 0.45],
];
const MIN_BAR = 0.2;
// Each bar rises and falls at its own speed, so a drum hit doesn't move them all in step.
const ATTACK = [0.5, 0.35, 0.6, 0.45, 0.3, 0.55];
const RELEASE = [0.1, 0.14, 0.08, 0.12, 0.16, 0.11];

// Route the <audio> through Web Audio once, so the bars can read its spectrum and the fades can use
// a gain node (iOS ignores audio.volume). Needs a user gesture and CORS on the preview, which Apple
// allows. Returns null where Web Audio is missing; playback then works as before, with a still icon.
function connectAudio(audio) {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  try {
    const ctx = new Ctx();
    const gain = ctx.createGain();
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyser.smoothingTimeConstant = 0.65;
    ctx.createMediaElementSource(audio).connect(gain);
    gain.connect(analyser);
    analyser.connect(ctx.destination);
    return { ctx, gain, analyser };
  } catch {
    return null;
  }
}

// The cover's colours at the theme's lightness, as CSS colours. A one-colour cover sweeps from a
// lighter to a deeper shade of it, and a black-and-white one sweeps through silver (the text colour
// down to the muted one), so every playing song gets a gradient taken from its art. Shared by the
// bars, the playing song's title and its pause icon so they match.
function coverStops(colors) {
  if (!colors) return ["var(--foreground)", "var(--muted-foreground)"];
  if (colors.length === 1) {
    const { h, s } = colors[0];
    return [`hsl(${h} ${s}% calc(var(--bar-l) + 10%))`, `hsl(${h} ${s}% calc(var(--bar-l) - 8%))`];
  }
  return colors.map(({ h, s }) => `hsl(${h} ${s}% var(--bar-l))`);
}

// The playing title in the cover's colours: a left-to-right gradient clipped to the text when there
// are several, else a plain colour.
function titlePaint(colors) {
  const stops = coverStops(colors);
  if (stops.length === 1) return { color: stops[0] };
  return {
    backgroundImage: `linear-gradient(90deg, ${stops.join(", ")})`,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
  };
}

// Six pill bars in the style of the Dynamic Island's now-playing waveform, each following the
// loudness of one frequency band as the song plays. They jump up quickly on a beat and ease back
// down. Heights are written straight to the DOM each frame, skipping React renders.
function LiveBars({ analyser, colors }) {
  const bars = useRef([]);
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (!analyser || reduced) return;
    const data = new Uint8Array(analyser.frequencyBinCount);
    // Each band is measured against its own running average (about the last second), so a beat stands
    // out whether the band is always loud (bass) or always faint (treble). Its plain loudness is mixed
    // in so quiet passages and the fade-in don't flatten every bar at once.
    const avg = BANDS.map(() => 0);
    const shown = BANDS.map(() => MIN_BAR);
    // A slow, random sway per bar, scaled by the music's level, so neighbours never sit at one height.
    const sway = BANDS.map(() => ({ now: 1, to: 1, next: 0 }));
    let frame;
    const draw = () => {
      analyser.getByteFrequencyData(data);
      const time = performance.now();
      BANDS.forEach(([from, to, cap], i) => {
        let sum = 0;
        for (let b = from; b < to; b++) sum += data[b];
        const value = sum / (to - from);
        avg[i] += (value - avg[i]) * 0.03;
        const relative = avg[i] > 4 ? Math.min(1, Math.max(0, (value / avg[i] - 0.6) / 0.7)) : 0;
        const w = sway[i];
        if (time > w.next) {
          w.to = 0.5 + Math.random() * 0.7;
          w.next = time + 90 + Math.random() * 220;
        }
        w.now += (w.to - w.now) * 0.08;
        const level = Math.min(1, (0.6 * relative + 0.4 * (value / 255)) * w.now);
        const target = MIN_BAR + (cap - MIN_BAR) * level;
        shown[i] += (target - shown[i]) * (target > shown[i] ? ATTACK[i] : RELEASE[i]);
        const el = bars.current[i];
        if (el) el.style.transform = `scaleY(${shown[i]})`;
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, [analyser, reduced]);

  const stops = coverStops(colors);
  const barColor = (i) => {
    if (stops.length === 1) return stops[0];
    const at = (i / (BANDS.length - 1)) * (stops.length - 1);
    const from = Math.min(Math.floor(at), stops.length - 2);
    const mix = Math.round((at - from) * 100);
    return `color-mix(in oklab, ${stops[from]}, ${stops[from + 1]} ${mix}%)`;
  };
  if (!analyser || reduced) {
    return <AudioLines aria-hidden="true" className="size-4 shrink-0" style={{ color: stops[0] }} />;
  }
  return (
    <span aria-hidden="true" className="live-bars flex h-5 shrink-0 items-center gap-[2px]">
      {BANDS.map((_, i) => (
        <span key={i} ref={(el) => (bars.current[i] = el)} style={{ "--bar": barColor(i) }} />
      ))}
    </span>
  );
}

function pickRandom(list, count) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, count);
}

// "Songs I have on repeat": four songs from Ajinkya's YouTube Music favourites playlist, picked at
// random per visit. Each cover has a play button for a 30-second preview; only one plays at a time.
// The shuffle button swaps in four songs not currently shown.
export default function SongsOnRepeat() {
  const [songs, setSongs] = useState(() => pickRandom(favouriteSongs, SHOWN));
  const [active, setActive] = useState(null); // { id, status: "loading" | "playing", colors }
  const [round, setRound] = useState(0); // Counts shuffles; a new key remounts the list so its rows animate in.
  const audioRef = useRef(null);
  const request = useRef(0); // Bumped on every play or shuffle so a stale preview lookup can't start playing.
  const fade = useRef({ timer: 0, ending: false });
  const graph = useRef(undefined); // Web Audio nodes once connected; null if unavailable.

  // Playback level: the gain node when Web Audio is connected, else the element's own volume.
  const getLevel = () => (graph.current ? graph.current.gain.gain.value : audioRef.current.volume);
  const setLevel = (v) => {
    if (graph.current) graph.current.gain.gain.value = v;
    else audioRef.current.volume = v;
  };

  // Ramp the volume to `target` over `ms`. A new fade cancels the one in progress, whose promise then
  // never settles, so whatever was waiting on it (a pause) is dropped. Steps on a timer rather than
  // animation frames, which stop in background tabs.
  const fadeTo = (target, ms) => {
    clearTimeout(fade.current.timer);
    return new Promise((resolve) => {
      const from = getLevel();
      const start = performance.now();
      const step = () => {
        const t = Math.min(1, (performance.now() - start) / ms);
        // Squared curves sound more even to the ear than a straight line in volume.
        const eased = target > from ? t * t : 1 - (1 - t) * (1 - t);
        setLevel(from + (target - from) * eased);
        if (t < 1) fade.current.timer = setTimeout(step, 16);
        else resolve();
      };
      step();
    });
  };

  const stop = async () => {
    const audio = audioRef.current;
    if (!audio || audio.paused) return;
    fade.current.ending = true; // Keep the end-of-preview fade from cancelling this one.
    await fadeTo(0, FADE_OUT_MS);
    audio.pause();
  };

  // Start the end-of-preview fade once, as playback enters its last seconds.
  const onTimeUpdate = () => {
    const audio = audioRef.current;
    const left = audio.duration - audio.currentTime;
    if (audio.paused || fade.current.ending || !(left < END_FADE_S)) return;
    fade.current.ending = true;
    fadeTo(0, left * 1000);
  };

  const shuffle = () => {
    request.current++;
    stop();
    setActive(null);
    setRound((r) => r + 1);
    setSongs((current) => {
      const shown = new Set(current.map((s) => s.id));
      return pickRandom(favouriteSongs.filter((s) => !shown.has(s.id)), SHOWN);
    });
  };

  const toggle = async (song) => {
    const audio = audioRef.current;
    if (!audio) return;
    // Connect Web Audio on the first click: browsers only let an AudioContext start from a gesture.
    if (graph.current === undefined) graph.current = connectAudio(audio);
    graph.current?.ctx.resume();
    const id = ++request.current;
    if (active?.id === song.id && active.status === "playing") {
      setActive(null);
      stop();
      return;
    }
    setActive({ id: song.id, status: "loading" });
    // The cover's colours load alongside but never hold up playback; see below.
    const colorsReady = findCoverColors(song);
    try {
      // Fade out whatever is playing while the new preview is looked up.
      const [src] = await Promise.all([findPreview(song), stop()]);
      if (id !== request.current) return;
      if (!src) {
        // No preview for this track: open it on YouTube Music instead.
        setActive(null);
        window.open(song.href, "_blank", "noopener,noreferrer");
        return;
      }
      audio.src = src;
      setLevel(0);
      fade.current.ending = false;
      await audio.play();
      if (id !== request.current) return;
      // Usually the colours are ready by now (cached); if not, the row shows silver until they arrive.
      setActive({ id: song.id, status: "playing", colors: coverColors.get(song.id) });
      fadeTo(VOLUME, FADE_IN_MS);
      colorsReady.then((colors) => {
        if (id === request.current) setActive((a) => (a?.id === song.id ? { ...a, colors } : a));
      });
    } catch {
      setActive(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 pb-8 sm:pb-10">
      {/* A pause from outside (media keys, unplugged headphones) clears the playing state; while a new
          song is loading, the old one's pause is expected and leaves the loading state alone. */}
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="none"
        onPause={() => setActive((a) => (a?.status === "playing" ? null : a))}
        onEnded={() => setActive(null)}
        onTimeUpdate={onTimeUpdate}
      />
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Music2 aria-hidden="true" className="size-4 text-foreground" />
          <p>
            Songs I have on <span className="font-medium text-strong">repeat</span>
          </p>
          {/* Sits right after "repeat" so it reads as "shuffle these songs". */}
          <button
            type="button"
            onClick={shuffle}
            aria-label="Shuffle songs"
            title="Shuffle songs"
            className="-ml-0.5 cursor-pointer rounded-[6px] border border-border bg-muted-bg p-1 text-foreground transition-colors duration-300 hover:bg-[color:var(--accent-tint)] hover:text-spot"
          >
            <Shuffle className="size-3.5" />
          </button>
        </div>
        <a
          href={PLAYLIST_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-spot"
        >
          Full playlist
          <ArrowUpRight
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>

      {/* A slim two-column tracklist: small cover, title and artist, and a play button on the right. */}
      <ul key={round} className="grid gap-1 sm:grid-cols-2 sm:gap-x-3">
        {songs.map((song, i) => {
          const state = active?.id === song.id ? active.status : "idle";
          return (
            <li
              key={song.id}
              className={`group flex min-w-0 cursor-pointer select-none items-center gap-3 rounded-[10px] p-1.5 pr-2 transition-colors hover:bg-muted-bg ${
                state === "playing" ? "bg-muted-bg" : ""
              } ${round > 0 ? "song-in" : ""}`}
              style={round > 0 ? { animationDelay: `${i * 60}ms` } : undefined}
              // A click anywhere on the row plays or pauses it; the button keeps it keyboard-reachable.
              onClick={() => toggle(song)}
            >
              <img
                src={song.cover}
                alt=""
                loading="lazy"
                className="size-10 shrink-0 rounded-[6px] border border-border object-cover"
              />
              <div className="min-w-0 flex-1">
                {/* w-fit so a gradient title spans the words, not the whole row. */}
                <span
                  className={`block w-fit max-w-full truncate text-sm font-medium transition-colors ${
                    state === "playing" ? "" : "text-title group-hover:text-spot"
                  }`}
                  style={state === "playing" ? titlePaint(active.colors) : undefined}
                >
                  {song.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{song.artist}</span>
              </div>
              {state === "playing" && <LiveBars analyser={graph.current?.analyser} colors={active.colors} />}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // The row would toggle it a second time.
                  toggle(song);
                }}
                data-own-sound
                aria-label={state === "playing" ? `Pause ${song.title}` : `Play a preview of ${song.title}`}
                title={state === "playing" ? "Pause" : "Play a 30-second preview"}
                className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-[color:var(--accent-tint)] hover:text-spot"
              >
                {/* The last colour of the bars' gradient, so the sweep carries on into the button. */}
                {state === "playing" && (
                  <Pause className="size-3.5" fill="currentColor" style={{ color: coverStops(active.colors).at(-1) }} />
                )}
                {state === "loading" && <LoaderCircle className="size-3.5 animate-spin" />}
                {state === "idle" && <Play className="ml-0.5 size-3.5" fill="currentColor" />}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
