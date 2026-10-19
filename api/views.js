import { Redis } from "@upstash/redis";

// Vercel Function: the portfolio's total page views, stored in Upstash Redis (provisioned via the
// Vercel Marketplace, which sets KV_REST_API_URL and KV_REST_API_TOKEN).
//   POST /api/views  → counts one view and returns { views }
//   GET  /api/views  → returns { views } without counting
// Each environment keeps its own count, so local and preview traffic never inflates production.

const redis = new Redis({ url: process.env.KV_REST_API_URL, token: process.env.KV_REST_API_TOKEN });
const key = `portfolio:views:${process.env.VERCEL_ENV ?? "development"}`;

// The displayed total starts at 1.2k; counted visits are added on top of this.
const STARTING_VIEWS = 1200;

const noStore = { headers: { "Cache-Control": "no-store" } };

export async function POST() {
  try {
    const views = STARTING_VIEWS + (await redis.incr(key));
    return Response.json({ views }, noStore);
  } catch {
    return Response.json({ views: null }, { status: 503, ...noStore });
  }
}

export async function GET() {
  try {
    const views = STARTING_VIEWS + Number((await redis.get(key)) ?? 0);
    return Response.json({ views }, noStore);
  } catch {
    return Response.json({ views: null }, { status: 503, ...noStore });
  }
}
