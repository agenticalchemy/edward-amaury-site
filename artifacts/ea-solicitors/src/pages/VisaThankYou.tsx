import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { fireVisaEvent } from "@/lib/tracking";

type ResultBand = "strong" | "challenges" | "expert";

interface ThankYouState {
  firstName?: string;
  result?: ResultBand;
  score?: number;
}

function getContent(state: ThankYouState) {
  const { firstName = "there", result = "expert" } = state;

  if (result === "strong") {
    return {
      heading: `Thank you, ${firstName} — Good News, You're in a Strong Position`,
      body: "Based on your answers, you appear to meet the key eligibility criteria for the UK Spouse Visa. That's genuinely good news — but a strong position doesn't mean the process is simple. How your application is presented, and the quality of the evidence you provide, can make all the difference. Our immigration team will call you to talk through the next steps.",
    };
  }

  if (result === "challenges") {
    return {
      heading: `Thank you, ${firstName} — You May Face Some Challenges, But They're Not Insurmountable`,
      body: "Your assessment has flagged some areas that could present obstacles in your application. The good news is that challenges don't mean rejection — it means these issues need to be addressed carefully with the right strategy. Our immigration specialists handle situations like yours regularly, and we know how to present an application that gives you the best chance of approval.",
    };
  }

  return {
    heading: `Thank you, ${firstName} — Your Application Will Need Expert Support`,
    body: "Your assessment indicates that your application will face significant challenges under the current rules. Knowing this now — before spending money on applications — is genuinely valuable. With the right expert support, we can identify the strongest path forward for you and your partner. Our immigration team will call you to discuss your options honestly and openly.",
  };
}

export default function VisaThankYou() {
  const state = (window.history.state?.state ?? {}) as ThankYouState;

  useEffect(() => {
    fireVisaEvent();
  }, []);

  const content = getContent(state);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Teal banner */}
      <div className="bg-[#0e7490] text-white text-center py-4 px-4">
        <p className="font-semibold">
          Your details have been received. Our immigration team will call you within 24 hours.
        </p>
      </div>

      <div className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] mb-4">{content.heading}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{content.body}</p>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="font-bold text-[#1a3a4a] text-lg mb-4">What Happens Next</h2>
              <div className="space-y-4">
                {[
                  { n: "1", t: "We review your assessment", b: "Our immigration team looks at your answers in detail." },
                  { n: "2", t: "We call you within 24 hours", b: "A specialist solicitor will call you to discuss your results and the best path forward." },
                  { n: "3", t: "We give you an honest assessment", b: "No jargon, no pressure. A clear picture of your position and what your options are — before you commit to anything." },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-[#0e7490] text-white flex items-center justify-center font-bold flex-shrink-0 text-sm">
                      {item.n}
                    </div>
                    <div>
                      <p className="font-semibold text-[#1a3a4a]">{item.t}</p>
                      <p className="text-gray-600 text-sm">{item.b}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call CTA */}
          <div className="bg-[#1a3a4a] text-white rounded-2xl p-8 text-center">
            <p className="text-lg font-semibold mb-2">Need to speak to someone sooner?</p>
            <a
              href="tel:01228272395"
              data-testid="thankyou-phone-visa"
              className="block text-3xl font-bold text-[#5eead4] hover:text-white transition-colors"
            >
              01228 272395
            </a>
            <p className="text-sm text-gray-300 mt-2">Lines open Monday–Friday, 9am–5pm</p>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
