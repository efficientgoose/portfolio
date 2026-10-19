import { useEffect, useState } from "react";
import { Eye } from "lucide-react";

const format = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

// Total portfolio views, like the page-view count on rinkitadhana.com. Each page load counts one
// view via /api/views (a Vercel Function backed by Upstash Redis). Hidden if the count can't load,
// e.g. under plain `vite dev`, which doesn't serve /api.
export default function ViewCount() {
  const [views, setViews] = useState(null);

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
    <span className="flex select-none items-center gap-1.5 px-1.5 text-muted">
      <Eye aria-hidden="true" className="size-[18px]" />
      <span className="text-xs tabular-nums sm:text-sm">
        <span className="sr-only">Portfolio views: </span>
        {format.format(views)}
      </span>
    </span>
  );
}
