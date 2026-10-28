# ajkale.com

The personal site of Ajinkya Kale: backend engineer at [Fleetx](https://www.fleetx.io/), working on real-time telematics pipelines, and co-founder of [Anchora](https://tryanchora.com), a study-abroad planner for students in India.

It's a single page in one narrow column framed by dashed rails, mostly black, white and grey with one gold accent. The layout takes its cues from [rinkitadhana.com](https://rinkitadhana.com).

## What's on the page

- **Profile:** click the photo to swap to another one with a short black-and-white glitch.
- **Songs on repeat:** four random tracks from Ajinkya's YouTube Music favourites. Clicking one plays Apple's 30-second preview, with "now playing" bars driven by Web Audio and coloured from the cover art.
- **GitHub contributions:** a live calendar with totals and longest streak.
- **Projects:** Anchora, Markiniser and Serene.
- **Experience**, **skills** and **contact** sections.
- **Word bands:** drifting rows of tech words that light up near the cursor (they twinkle on phones).
- **View count:** total page views, stored in Upstash Redis.
- **Little extras:** a first-load reveal, a dark/light toggle and a site-wide mute. All UI sounds are synthesised in the browser, with no audio files.

Every animation respects `prefers-reduced-motion`, and the page works down to 390px wide.

## Stack

- [Vite](https://vite.dev) + [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) (strict)
- [Tailwind CSS 3](https://tailwindcss.com)
- [Vercel](https://vercel.com) for hosting, plus one Vercel Function (`api/views.ts`) backed by [Upstash Redis](https://upstash.com)
- [Cal.com](https://cal.com) embed for booking a call
- Icons from [Lucide](https://lucide.dev) and [React Icons](https://react-icons.github.io/react-icons/)

## Running it locally

```bash
npm install
npm run dev        # http://localhost:5173
```

The view count needs Upstash credentials. With the Vercel project linked, `vercel env pull .env.local` fetches them, and `npm run dev` serves `api/` through a small Vite plugin. Without them the count just stays hidden; nothing else depends on it.

Other scripts:

```bash
npm run build      # type-check, then production build into dist/
npm run typecheck  # type-check only
npm run lint       # ESLint
npm run preview    # serve the production build
```

## Project layout

```
api/views.ts            Vercel Function: read / increment the view count
src/App.tsx             composes the page
src/components/
  layout/               sticky navigation
  sections/             Hero, Projects, Experience, Skills, Contact, GitHub graph, songs
  ui/                   layout primitives, word bands, loader, link previews
src/data/               all copy and content: projects, experience, skills, links, songs
src/lib/sound.ts        Web Audio UI sounds and the mute switch
src/index.css           theme colour tokens and custom animations
public/                 photos, logos, project screenshots, fonts
```

To change text, links or projects, edit the files in `src/data/` rather than the components.

## Deploying

Pushes to `main` deploy to production on Vercel; pull requests get preview deployments. The build runs the TypeScript check first, so a type error stops the deploy.
