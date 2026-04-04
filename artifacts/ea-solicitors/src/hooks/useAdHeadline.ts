import { useMemo } from "react";

export function useAdHeadline(fallback: string): string {
  return useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const h1 = params.get("h1");
    if (h1 && h1.trim().length > 0) {
      return decodeURIComponent(h1.trim());
    }
    return fallback;
  }, [fallback]);
}
