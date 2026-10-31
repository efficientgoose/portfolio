// Kept in sync with GITHUB_USER in src/data/links.ts (not imported, so the function stays self-contained).
const GITHUB_USER = "efficientgoose";

// Vercel Function: the GitHub contribution calendar for the last year, read from GitHub's GraphQL API.
//   GET /api/github → { contributions: [{ date, count, level }] }, oldest first
// Needs GITHUB_TOKEN: a fine-grained personal access token with no extra permissions (public data only).
// Responses are cached on Vercel's CDN for 5 minutes and served stale while refreshing, so GitHub is
// called at most about once every 5 minutes no matter how many people visit.

const QUERY = `query($login: String!) {
  user(login: $login) {
    contributionsCollection {
      contributionCalendar {
        weeks { contributionDays { date contributionCount contributionLevel } }
      }
    }
  }
}`;

const LEVELS: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

type CalendarResponse = {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: { contributionDays: { date: string; contributionCount: number; contributionLevel: string }[] }[];
        };
      };
    } | null;
  };
};

const cached = { headers: { "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" } };
const noStore = { headers: { "Cache-Control": "no-store" } };

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return Response.json({ error: "GITHUB_TOKEN is not set" }, { status: 503, ...noStore });

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `bearer ${token}`, "Content-Type": "application/json", "User-Agent": "ajkale.com" },
      body: JSON.stringify({ query: QUERY, variables: { login: GITHUB_USER } }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    const json = (await res.json()) as CalendarResponse;
    const weeks = json.data?.user?.contributionsCollection.contributionCalendar.weeks;
    if (!weeks) throw new Error("No calendar in GitHub response");

    const contributions = weeks.flatMap((w) =>
      w.contributionDays.map((d) => ({
        date: d.date,
        count: d.contributionCount,
        level: LEVELS[d.contributionLevel] ?? 0,
      })),
    );
    return Response.json({ contributions }, cached);
  } catch {
    return Response.json({ error: "GitHub request failed" }, { status: 502, ...noStore });
  }
}
