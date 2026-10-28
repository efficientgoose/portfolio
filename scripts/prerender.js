// Runs after `vite build`: renders the page to static HTML so crawlers that don't run JavaScript
// (most AI crawlers) can read it, and writes the machine-readable extras. See the "build" script.
import { readFile, rm, writeFile } from "node:fs/promises";

const { render, personJsonLd, llmsTxt } = await import("../dist-ssr/entry-server.js");

// Icons are mostly long SVG paths that tell a crawler nothing; drop them to keep the HTML small.
const body = render().replace(/<svg[\s\S]*?<\/svg>/g, "");

// JSON inside <script> must not contain "</script>"; escaping "<" rules that out.
const jsonLd = JSON.stringify(personJsonLd()).replace(/</g, "\\u003c");

const path = "dist/index.html";
let html = await readFile(path, "utf8");
const root = '<div id="root"></div>';
if (!html.includes(root)) throw new Error(`prerender: ${root} not found in ${path}`);
// main.tsx clears this before React mounts, and index.html hides it while JS is on, so visitors
// never see it; it's there for crawlers and anyone browsing without JavaScript.
html = html
  .replace(root, `<div id="root"><div data-prerendered>${body}</div></div>`)
  .replace("</head>", `  <script type="application/ld+json">${jsonLd}</script>\n  </head>`);

await writeFile(path, html);
await writeFile("dist/llms.txt", llmsTxt());
await rm("dist-ssr", { recursive: true, force: true });

console.log(`prerender: ${path} (${(body.length / 1024).toFixed(0)} kB of HTML), dist/llms.txt`);
