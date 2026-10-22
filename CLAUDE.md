# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) and other coding agents when working with code in this repository. `AGENTS.md` is a symlink to this file, so Codex reads the same guidance.

## Product context

This is Ajinkya Kale's personal portfolio (ajkale.com): a single-page site for a backend engineer at Fleetx who is also co-founding **Anchora**, a study-abroad planner for students in India. The page has two jobs: show credible backend depth (real-time pipelines at Fleetx) and put Anchora front and centre as the thing he is building.

The design is modelled on **rinkitadhana.com**: a calm, minimal, single 690px column framed by dashed rails, with a few playful but restrained interactions. It replaced an earlier "hacker terminal" theme (matrix rain, typewriter text, neon glows, fake terminal) that read as childish. Don't reintroduce any of that.

## Commands

```bash
npm run dev       # Vite dev server (localhost:5173)
npm run build     # production build; run before calling a task done
npm run lint      # eslint .
```

There are no tests. Verify UI changes by looking at them (see **Verifying changes**).

`api/` holds Vercel Functions, which plain `npm run dev` does not serve. `npm run dev` also serves them through a small Vite plugin in `vite.config.js`; `vercel dev` works too (the folder is linked to the `portfolio` Vercel project; env vars are in `.env.local` via `vercel env pull`).

**Gotcha:** the Vite dev server does not reliably pick up changes to `tailwind.config.js`. If new colours or utilities don't appear in the browser but `npm run build` produces them, restart `npm run dev`.

## Architecture

Vite + React 19 + Tailwind CSS 3, plain JSX, no router. Deployed on Vercel.

- `src/App.jsx` composes the page in order: `Navigation`, `Hero`, `Projects`, `Experience`, `Skills`, `Contact`, then `BackToTop` and `Loader` overlays.
- `src/components/sections/` holds one component per section. `GitHubGraph.jsx` fetches live contributions from `github-contributions-api.jogruber.de` and renders nothing if the request fails.
- `src/components/ui/Layout.jsx` holds the layout primitives: `Container` (the 690px railed column), `Hr` (full-width dashed rule), `SectionHeader`, `DotBand` (renders the full-width `WordField`), `FramedButton` and `ViewAll`. Build new sections from these.
- `src/components/ui/` also has `WordField` (drifting word bands), `Loader` (first-load reveal), `RotatingRole` (subtitle cycling), and `BackToTop`.
- `src/data/` holds all content: `timeline.js` (experience), `projects.js`, `techStack.js`, `links.js` (email, GitHub, LinkedIn, résumé, Anchora URLs). Change copy here, not in components.
- `src/lib/sound.js` synthesises UI sounds with Web Audio (the shared button click, TV-static glitch). There are no audio files.
- `index.html` sets the theme before paint (dark unless a saved choice says otherwise) and holds SEO meta.

## Design system

### Layout

- One column, `max-w-[690px]`, centred, with dashed rails on both sides (`.rails`). Sections are separated by full-width dashed rules (`.dash-x`, 6px dash / 8px gap).
- Section titles are 1.15rem bold, left-aligned in their own railed band.
- The two word bands (top and bottom) are the only full-bleed elements; they run edge to edge with no rails.
- The nav is sticky, translucent (`color-mix` background + `backdrop-blur`), and its links are centred: `/about /projects /experience /contact`.
- The hero CTA buttons are centred. The GitHub graph is left-aligned with its stats on the right.

### Colour

- **Mostly black, white and grey.** Dark is the default regardless of system setting; light is opt-in via the toggle and remembered in `localStorage`.
- The dark canvas is a soft black (`--background: #141412`), not pure black.
- **One accent: gold/yellow**, used sparingly for interaction and emphasis. All tokens live at the top of `src/index.css`:
  - `--spot` (`#d9b562`): the muted gold accent for the active nav item, link/icon hovers, "SAY HI" hover, the featured star, focus rings and selection.
  - `--accent-tint` / `--accent-tint-hover`: a pale gold fill (14% / 24% of `--spot`). Primary buttons use this fill with `--spot` text, matching the active nav item. Never use a solid yellow fill for buttons.
  - `--word-spot` (`#f5c542`): a brighter yellow reserved for the word-band hover trail.
  - `--heat-0..4`: GitHub graph scale, from dark olive to soft gold.
- Light theme swaps these for deeper ambers so they stay readable on white.
- Status dots: green = Live, yellow = Building, grey = other. Always paired with a text label.
- Project cards are the one place with other colours: each project has a 4-colour `palette` in `projects.js` for its hover sunburst (Anchora golds, Markiniser lavender/pink, Serene cream/sage/orange).
- Things that must stay black and white: the photo-shuffle glitch, the page background (no grain or texture overlay).

### Typography

- Body and headings: **Figtree** (stands in for rinkitadhana's proprietary Instagram Sans), loaded from Google Fonts.
- **Geist Mono** (self-hosted, `public/fonts/`) for the nav links and the word bands.
- **Caveat** only for the handwritten "SAY HI" note.
- Keep type small and calm: name 1.55rem, section titles 1.15rem, body ~15–16px.

### Components and interactions

- **Word bands:** rows of dim monospace tech words drift right-to-left (all rows the same direction, slightly different speeds). Words near the cursor turn `--word-spot` yellow in proportion to their distance, hold ~300ms, then ease out over ~1s, leaving a short tapering trail. No blinking, no full stops before words. Phones show 5 rows; larger screens show 9. Tuning constants (`RADIUS`, `HOLD_MS`, `FADE_MS`) are in `WordField.jsx`.
- **Profile:** framed avatar; clicking the photo swaps to a different random photo with a ~300ms black-and-white glitch and a short TV-static sound. The subtitle alternates "Backend Engineer" / "Co-Founder, Anchora" with a blur fade.
- **View count:** an eye icon with the total portfolio views sits left of the GitHub icon (`ViewCount.jsx`). Every page load POSTs to `api/views.js`, which `INCR`s a counter in Upstash Redis (Vercel Marketplace integration `portfolio-views`; env `KV_REST_API_URL`/`KV_REST_API_TOKEN`). Each environment has its own key (`portfolio:views:<VERCEL_ENV>`), so only production traffic counts toward the live number. The displayed total includes a fixed starting offset of 1,200 (`STARTING_VIEWS` in `api/views.js`), added at Ajinkya's request; everything above that is real counted views. The count is hidden if the API is unreachable.
- **Songs on repeat:** a block under the socials titled "Songs I have on **repeat**" with a "Full playlist" link. `SongsOnRepeat.jsx` shows 4 random songs per visit from Ajinkya's public YouTube Music "My Favourites" playlist (`src/data/music.js`, first 100 tracks; covers are YouTube thumbnails) as a slim tracklist (small cover, title, artist, play button; two columns on desktop, one on phones). A small boxed shuffle button right after the word "repeat" swaps in 4 songs not currently shown (rows blur-fade in, staggered) and stops any preview. Clicking anywhere on a song row (or its play button) looks up Apple's 30-second preview on demand (iTunes Search API, cached per song) and plays it, one song at a time, fading in (~0.9s), out on pause or switch (~0.45s), and over the last 2s of the clip; no preview opens YouTube Music instead. Playback runs through Web Audio (`crossOrigin="anonymous"`; Apple serves previews with open CORS): a gain node does the fades (so they work on iOS) and an analyser drives the "now playing" bars, six gold pills styled after the iPhone Dynamic Island waveform, each following one frequency band relative to its own running average, with per-bar speeds and a small loudness-scaled random sway so they never move as one block; the middle bars reach the full 20px, the outer ones less (tuning in `BANDS`/`ATTACK`/`RELEASE`/`LiveBars`). Reduced motion, or no Web Audio, shows a still `AudioLines` icon. The bars blend left to right across up to three main colours of the playing song's cover, like the iPhone (`findCoverColors`, read from the YouTube thumbnail via canvas; hue and saturation from the art, lightness from `--bar-l` per theme), with a light-to-deep sweep for one-colour covers and a silver sweep (`--foreground` to `--muted-foreground`) for black-and-white ones (under 1% coloured pixels; a small coloured accent still counts). The playing song's title uses the same colours (gradient text via `background-clip: text`), and the pause icon takes the gradient's last colour. Colour extraction never delays playback: if it is not ready when the preview starts, the row shows silver and switches when it arrives. An "i" info note explaining the bars was tried and removed as too much. Only use songs from his playlist. Inline pills and labels in the profile row were tried and rejected.
- **Icon buttons** (GitHub, mute, theme toggle, song shuffle): muted at rest; on hover a pale gold tint with a gold icon.
- **Projects:** Anchora is featured and spans the full first row (filled yellow star badge, landing-page screenshot of tryanchora.com); the rest pair up below. Each card is a nested-border frame with the screenshot rising from the bottom; on hover a curved sunburst (wide rays bowing gently outward over faint paper grain) fades in behind it.
- **Experience:** expandable rows with company logos; the first row starts open.
- **Loader:** on first load a dot grows into a single circle, then opens like a lens to reveal the page (~1.5s). One step only.
- **Sounds:** short and quiet; audio must never be required to use the page. The speaker button next to GitHub mutes everything (saved in `localStorage` as `muted`; state lives in `src/lib/sound.js`, and every sound function checks it). Muting also fades out a playing song preview; pressing play on a song turns sound back on.

### Motion and accessibility

- Every animation (loader, word drift, glitch, rotating subtitle) respects `prefers-reduced-motion`.
- Keep keyboard focus visible (gold outline). Decorative layers are `aria-hidden` and `pointer-events: none` where they overlay content.
- Must work at 390px phone width with no horizontal scroll.

## Copy and content rules

- Plain, first-person, factual. No "turning coffee into code" jokes, status gimmicks, or self-rated proficiency levels.
- **Never fabricate numbers, metrics or project details.** Use only what Ajinkya has stated or what the repos/READMEs show. Current figures: Fleetx ingests **1B+** sensor data points a day from **350K+** vehicles; MAQ processed **1M+** documents/month at **99.9%** uptime; Rodic improved accuracy by **80%**.
- Contact email is `ajinkya@ajkale.com`.
- Anchora facts must match the Anchora repo (`../Anchora`, especially `PRODUCT.md`): independent students in India applying to Germany; Atlas cites official sources, proposes changes the student accepts, and is off until consent.

## Verifying changes

Headless Chrome screenshots are the check for visual work. Look at the result before claiming something looks right:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --window-size=1440,1000 --virtual-time-budget=8000 --screenshot=/tmp/shot.png http://localhost:5173/
```

- Headless Chrome enforces a minimum window width, so check mobile by loading the page in a 390px `<iframe>` (or with Puppeteer and a mobile viewport), and confirm `scrollWidth === clientWidth`.
- Hover states, animations and timing (word trail, glitch, loader) need Puppeteer to move the mouse and capture frames over time; a single static screenshot won't show them.
- Sounds can't be verified headless; say so rather than claiming they work.

## Working rules

- Change only what was asked. If a request is about one section, don't restyle a neighbouring one.
- Keep changes reversible and uncommitted until asked; when asked to ship, use a feature branch and a PR into `main`.
- Run `npm run lint` and `npm run build` before declaring a task done.
- New photos, logos and screenshots go in `public/` (`public/projects/`, `public/logos/`); keep images as WebP where possible.

## End-of-task summary

The owner ships quickly and needs to understand what changed in the code and architecture, not only what is visible. After every task, once the outcome is reported, add a short **How it works** section sized to the task: one line for a copy tweak, the full set for a feature.

- **Files touched:** each changed file and its role.
- **Mechanism:** how the change works: the data flow, where the logic lives, and the framework or browser feature it relies on.
- **Why this approach:** the alternatives considered and why they lost, in a line or two.
- **Watch out for:** trade-offs, fragile parts, and what to change if requirements shift.

Use plain language and explain any jargon. Do this even when the request is only "create PR" or "merged it" and the change has not been explained yet.
