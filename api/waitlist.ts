// Kept in sync with ANCHORA_URL in src/data/links.ts (not imported, so the function stays self-contained).
const SOURCE = "https://tryanchora.com/api/waitlist/count";

// Vercel Function: how many people are on Anchora's waitlist, read from Anchora's public count route.
//   GET /api/waitlist → { count }
// Responses are cached on Vercel's CDN for 5 minutes and served stale while refreshing, so Anchora
// is asked at most about once every 5 minutes no matter how many people visit.

const cached = { headers: { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" } };
const noStore = { headers: { "Cache-Control": "no-store" } };

export async function GET() {
  try {
    const res = await fetch(SOURCE, { headers: { "User-Agent": "ajkale.com" }, signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Anchora responded ${res.status}`);
    const { count } = (await res.json()) as { count?: unknown };
    if (typeof count !== "number" || !Number.isInteger(count) || count < 0) throw new Error("No count in Anchora response");
    return Response.json({ count }, cached);
  } catch {
    return Response.json({ error: "Waitlist count unavailable" }, { status: 502, ...noStore });
  }
}
