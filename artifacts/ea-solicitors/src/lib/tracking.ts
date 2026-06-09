declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function fireGoogleAdsConversion(): void {
  const conversionId = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID;
  const conversionLabel = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_LABEL;
  if (typeof window.gtag !== "function") return;
  if (!conversionId || !conversionLabel) return;
  window.gtag("event", "conversion", {
    send_to: `${conversionId}/${conversionLabel}`,
  });
}

function fireGa4Event(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window.gtag !== "function") return;
  window.gtag("event", eventName, { event_category: "lead", ...params });
}

export function fireWillsEvent(): void {
  fireGa4Event("funnel_leads_all", { lead_type: "wills_probate" });
  fireGoogleAdsConversion();
}

export function fireVisaEvent(): void {
  fireGa4Event("funnel_leads_all", { lead_type: "spouse_visa" });
  fireGoogleAdsConversion();
}

export function fireWillWritingEvent(): void {
  fireGa4Event("funnel_leads_all", { lead_type: "will_writing" });
  fireGoogleAdsConversion();
}

export function firePersonalInjuryEvent(): void {
  fireGa4Event("funnel_leads_all", { lead_type: "personal_injury" });
  fireGoogleAdsConversion();
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
