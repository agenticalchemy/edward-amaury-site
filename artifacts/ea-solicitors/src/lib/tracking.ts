declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function fireWillsEvent(): void {
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "wills_lead_submit", { event_category: "lead" });

  const conversionId = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID;
  const conversionLabel = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL_WILLS;
  if (conversionId && conversionLabel) {
    window.gtag("event", "conversion", {
      send_to: `${conversionId}/${conversionLabel}`,
    });
  }
}

export function fireVisaEvent(): void {
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "visa_lead_submit", { event_category: "lead" });

  const conversionId = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID;
  const conversionLabel = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL_VISA;
  if (conversionId && conversionLabel) {
    window.gtag("event", "conversion", {
      send_to: `${conversionId}/${conversionLabel}`,
    });
  }
}

export function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  const keys = ["gclid", "utm_source", "utm_campaign", "utm_medium", "utm_term", "utm_content"];
  for (const key of keys) {
    const val = params.get(key);
    if (val) result[key] = val;
  }
  return result;
}
