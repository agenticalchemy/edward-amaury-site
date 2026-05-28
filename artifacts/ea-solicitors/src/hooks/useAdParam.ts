import { useMemo } from "react";

const SESSION_PREFIX = "ea_ad_";

// Reads a named URL search param (e.g. ?body=...) and persists it to
// sessionStorage so it survives in-app navigation (landing → triage → thank-you).
// Falls back to the page's static copy when the param is absent.
//
// Example final URL: /cumbria-solicitors?h1=Carlisle+Solicitors&body=Wills%2C+visas%2C+claims.
export function useAdParam(paramName: string, fallback: string): string {
  return useMemo(() => {
    const sessionKey = `${SESSION_PREFIX}${paramName}`;
    const params = new URLSearchParams(window.location.search);

    const value = params.get(paramName);
    if (value && value.trim().length > 0) {
      const decoded = decodeURIComponent(value.trim());
      sessionStorage.setItem(sessionKey, decoded);
      return decoded;
    }

    const stored = sessionStorage.getItem(sessionKey);
    if (stored && stored.trim().length > 0) {
      return stored;
    }

    return fallback;
  }, [paramName, fallback]);
}
