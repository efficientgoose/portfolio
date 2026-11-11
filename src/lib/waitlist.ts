import { useEffect, useState } from "react";

// The live number of people on Anchora's waitlist, from /api/waitlist. One request per page load,
// shared by everything that shows the number (the intro sentence, the hover card, the phone pill).
let request: Promise<number | null> | undefined;

function loadWaitlistCount() {
  request ??= fetch("/api/waitlist")
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => (Number.isInteger(data?.count) && data.count >= 0 ? (data.count as number) : null))
    .catch(() => null);
  return request;
}

// `undefined` while the request is in flight, `null` if the count can't be loaded.
export function useWaitlistCount() {
  const [count, setCount] = useState<number | null | undefined>(undefined);

  useEffect(() => {
    let mounted = true;
    loadWaitlistCount().then((value) => {
      if (mounted) setCount(value);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return count;
}

export const formatCount = (value: number) => value.toLocaleString("en-IN");
