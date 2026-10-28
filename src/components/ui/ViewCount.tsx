import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const format = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 });

// Total portfolio views, like the page-view count on rinkitadhana.com. Each page load counts one
// view via /api/views (a Vercel Function backed by Upstash Redis). Hidden if the count can't load,
// e.g. under plain `vite dev`, which doesn't serve /api.
export default function ViewCount() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/views", { method: "POST", signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => typeof data?.views === "number" && setViews(data.views))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  if (views === null) return null;

  return (
    // A small pill, styled like the social links.
    <span className="mr-1 flex select-none items-center gap-1.5 rounded-full border border-border bg-muted-bg px-2 py-1 text-muted-foreground">
      <Eye aria-hidden="true" className="size-3.5" />
      <span className="text-xs font-medium leading-none tabular-nums">
        <span className="sr-only">Portfolio views: </span>
        {format.format(views)}
      </span>
    </span>
  );
}
