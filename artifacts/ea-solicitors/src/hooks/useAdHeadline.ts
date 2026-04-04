import { useMemo } from "react";

const SESSION_KEY = "ea_ad_headline";

export function useAdHeadline(fallback: string): string {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const h1 = params.get("h1");

    if (h1 && h1.trim().length > 0) {
      const decoded = decodeURIComponent(h1.trim());
      sessionStorage.setItem(SESSION_KEY, decoded);
      return decoded;
    }

    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored && stored.trim().length > 0) {
      return stored;
    }

    return fallback;
  }, [fallback]);
}
