declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// Google normalises and hashes user_data in the tag before it leaves the
// browser — raw values never reach Google's servers. Phone must be E.164.
function toE164(phone: string): string | undefined {
  const digits = phone.replace(/[^\d+]/g, "");
  if (!digits) return undefined;
  if (digits.startsWith("+")) return digits;
  if (digits.startsWith("07")) return `+44${digits.slice(1)}`;
  if (digits.startsWith("44")) return `+${digits}`;
  if (digits.startsWith("0")) return `+44${digits.slice(1)}`;
  return digits;
}

// Enhanced conversions: attach the lead's contact details to the Google tag at
// form submit. Applies to every gtag destination on the page (GA4 + Google Ads)
// and persists across SPA navigation, so the thank-you page events carry it.
export function setEnhancedConversionData(email: string, phone: string): void {
  if (typeof window.gtag !== "function") return;
  const userData: Record<string, string> = {};
  const cleanEmail = email.trim().toLowerCase();
  if (cleanEmail) userData.email = cleanEmail;
  const e164 = toE164(phone);
  if (e164) userData.phone_number = e164;
  if (Object.keys(userData).length === 0) return;
  window.gtag("set", "user_data", userData);
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

// Funnel drop-off tracking: quiz start, each question answered, details form
// shown. Event names carry the funnel + step so they're readable straight off
// the GA4 Events report with no custom dimensions needed.
export function fireFunnelEvent(eventName: string, params: Record<string, unknown> = {}): void {
  try {
    fireGa4Event(eventName, params);
  } catch {
    /* tracking must never break the quiz */
  }
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

const AD_PARAM_KEYS = ["gclid", "wbraid", "gbraid", "utm_source", "utm_campaign", "utm_medium", "utm_term", "utm_content"];

// SPA navigation (wouter setLocation) drops the query string, so ad params only
// exist in the URL on the very first page. Stash them the moment the app loads;
// getUtmParams falls back to the stash for the rest of the visit.
export function captureAdParams(): void {
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of AD_PARAM_KEYS) {
      const val = params.get(key);
      if (val) sessionStorage.setItem(`ea_ad_${key}`, val);
    }
  } catch {
    /* tracking must never break the page */
  }
}

export function getUtmParams(): Record<string, string> {
  const params = new URLSearchParams(window.location.search);
  const result: Record<string, string> = {};
  for (const key of AD_PARAM_KEYS) {
    let val = params.get(key);
    if (!val) {
      try { val = sessionStorage.getItem(`ea_ad_${key}`); } catch { /* ignore */ }
    }
    if (val) result[key] = val;
  }
  return result;
}
