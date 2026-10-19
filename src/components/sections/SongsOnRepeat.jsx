import { useRef, useState } from "react";
import { ArrowUpRight, LoaderCircle, Music2, Pause, Play } from "lucide-react";
import { PLAYLIST_URL, favouriteSongs } from "../../data/music";

const SHOWN = 4;

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
export default function SongsOnRepeat() {
  const [songs] = useState(() => pickRandom(favouriteSongs, SHOWN));
  const [active, setActive] = useState(null); // { id, status: "loading" | "playing" }
  const audioRef = useRef(null);

  const toggle = async (song) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (active?.id === song.id && active.status === "playing") {
      audio.pause();
      return;
    }
    audio.pause();
    setActive({ id: song.id, status: "loading" });
    try {
      const src = await findPreview(song);
      if (!src) {
        // No preview for this track: open it on YouTube Music instead.
        setActive(null);
        window.open(song.href, "_blank", "noopener,noreferrer");
        return;
      }
      audio.src = src;
      audio.volume = 0.6;
      await audio.play();
      setActive({ id: song.id, status: "playing" });
    } catch {
      setActive(null);
    }
  };

  return (
    <div className="flex flex-col gap-3 pb-8 sm:pb-10">
      <audio ref={audioRef} preload="none" onPause={() => setActive(null)} onEnded={() => setActive(null)} />
      <div className="flex items-center justify-between gap-4">
        <p className="flex items-center gap-2">
          <Music2 aria-hidden="true" className="size-4 text-foreground" />
          <span>
            Songs I have on <span className="font-medium text-strong">repeat</span>
          </span>
        </p>
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
      <ul className="grid gap-1 sm:grid-cols-2 sm:gap-x-3">
        {songs.map((song) => {
          const state = active?.id === song.id ? active.status : "idle";
          return (
            <li
              key={song.id}
              className={`group flex min-w-0 items-center gap-3 rounded-[10px] p-1.5 pr-2 transition-colors hover:bg-muted-bg ${
                state === "playing" ? "bg-muted-bg" : ""
              }`}
            >
              <img
                src={song.cover}
                alt=""
                loading="lazy"
                className="size-10 shrink-0 rounded-[6px] border border-border object-cover"
              />
              <a
                href={song.href}
                target="_blank"
                rel="noopener noreferrer"
                title={`${song.title} – ${song.artist} on YouTube Music`}
                className="min-w-0 flex-1"
              >
                <span
                  className={`block truncate text-sm font-medium transition-colors group-hover:text-spot ${
                    state === "playing" ? "text-spot" : "text-title"
                  }`}
                >
                  {song.title}
                </span>
                <span className="block truncate text-xs text-muted-foreground">{song.artist}</span>
              </a>
              {state === "playing" && (
                <span aria-hidden="true" className="now-playing-bars flex h-3 shrink-0 items-end gap-[2px]">
                  <span />
                  <span />
                  <span />
                </span>
              )}
              <button
                type="button"
                onClick={() => toggle(song)}
                data-own-sound
                aria-label={state === "playing" ? `Pause ${song.title}` : `Play a preview of ${song.title}`}
                title={state === "playing" ? "Pause" : "Play a 30-second preview"}
                className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-[color:var(--accent-tint)] hover:text-spot"
              >
                {state === "playing" && <Pause className="size-3.5 text-spot" fill="currentColor" />}
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
