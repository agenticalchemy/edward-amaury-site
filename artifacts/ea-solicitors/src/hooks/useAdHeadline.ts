import { useMemo } from "react";

const SESSION_KEY = "ea_ad_headline";

function toTitleCase(str: string): string {
  return str
    .toLowerCase()
    .split(/[\s+]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function useAdHeadline(fallback: string): string {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);

    // 1. Explicit h1 param — highest priority (manually set per campaign)
    const h1 = params.get("h1");
    if (h1 && h1.trim().length > 0) {
      const decoded = decodeURIComponent(h1.trim());
      sessionStorage.setItem(SESSION_KEY, decoded);
      return decoded;
    }

    // 2. utm_term — set via Google Ads {keyword} ValueTrack parameter
    //    e.g. Final URL: ?utm_term={keyword} → injects the search term that triggered the ad
    const utmTerm = params.get("utm_term");
    if (utmTerm && utmTerm.trim().length > 0) {
      const headline = toTitleCase(decodeURIComponent(utmTerm.trim()));
      sessionStorage.setItem(SESSION_KEY, headline);
      return headline;
    }

    // 3. Persisted from a previous page (e.g. landing → quiz journey)
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (stored && stored.trim().length > 0) {
      return stored;
    }

    // 4. Default fallback
    return fallback;
  }, [fallback]);
}
