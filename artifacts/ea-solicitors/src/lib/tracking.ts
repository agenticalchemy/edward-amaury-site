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

// GA4 analytics only. The Google Ads conversion for calls is handled by the
// forwarding-number swap (activatePhoneCallTracking) — firing a conversion on
// click as well would double-count the same call.
export function firePhoneClickEvent(pagePath: string): void {
  fireGa4Event("phone_click", { page_path: pagePath });
}

// Google Ads "Calls from website visits" conversion. Re-running the config
// makes Google re-scan the page and swap the displayed number for a forwarding
// number (ad-click visitors only). Must run after each route render because
// the SPA inserts phone numbers into the DOM after the initial page load.
export function activatePhoneCallTracking(): void {
  const conversionId = import.meta.env.VITE_GOOGLE_ADS_CONVERSION_ID;
  const websiteCallLabel = import.meta.env.VITE_GOOGLE_ADS_PHONE_CONVERSION_LABEL;
  if (typeof window.gtag !== "function") return;
  if (!conversionId || !websiteCallLabel) return;
  window.gtag("config", `${conversionId}/${websiteCallLabel}`, {
    phone_conversion_number: "01228 272395",
  });
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
