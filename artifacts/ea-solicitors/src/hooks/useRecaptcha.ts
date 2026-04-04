import { useEffect } from "react";

const RECAPTCHA_SITE_KEY = "6Lc_YqYsAAAAAGYxwJtsyj6W0NFwRmVaKUUs2iAz";
const SCRIPT_ID = "recaptcha-script";

export function useRecaptcha() {
  useEffect(() => {
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }, []);

  async function getToken(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const attempt = (tries: number) => {
        if (window.grecaptcha) {
          window.grecaptcha
            .execute(RECAPTCHA_SITE_KEY, { action })
            .then(resolve)
            .catch(reject);
        } else if (tries > 0) {
          setTimeout(() => attempt(tries - 1), 300);
        } else {
          reject(new Error("reCAPTCHA failed to load"));
        }
      };
      attempt(20);
    });
  }

  return { getToken };
}
