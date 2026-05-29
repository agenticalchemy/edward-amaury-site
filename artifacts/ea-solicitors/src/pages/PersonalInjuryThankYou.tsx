import { useEffect } from "react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { firePersonalInjuryEvent } from "@/lib/tracking";

type ResultBand = "strong" | "possible" | "complex";

interface ThankYouState {
  firstName?: string;
  result?: ResultBand;
  score?: number;
}

function getContent(state: ThankYouState) {
  const { result = "complex" } = state;

  if (result === "strong") {
    return {
      heading: "Good News, You Look Like You Have a Strong Claim",
      body: "Based on your answers, the key factors needed for a personal injury claim look to be in place. A solicitor will call you within 24 hours to talk through the next steps. There is nothing to pay upfront and no obligation.",
    };
  }

  if (result === "possible") {
    return {
      heading: "You May Have a Claim Worth Pursuing",
      body: "Your assessment shows some positive factors but a few areas to discuss. Claims like yours often succeed when handled properly. A solicitor will call you within 24 hours for an honest conversation about your options.",
    };
  }

  return {
    heading: "Your Claim Needs a Direct Conversation",
    body: "Your situation has some factors (time, fault, or impact) that need careful discussion before deciding whether to proceed. We will give you a straight answer in your free initial call. Knowing now is better than wondering.",
  };
}

export default function PersonalInjuryThankYou() {
  const state = (window.history.state?.state ?? {}) as ThankYouState;
  const firstName = state.firstName || sessionStorage.getItem("ea_lead_firstname") || "there";

  useEffect(() => {
    firePersonalInjuryEvent();
  }, []);

  const content = getContent(state);

  const resultBadge =
    state.result === "strong"
      ? { label: "Strong Claim", bg: "bg-green-50 border-green-200", text: "text-green-700" }
      : state.result === "possible"
      ? { label: "Possible Claim", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" }
      : { label: "Needs a Direct Conversation", bg: "bg-[#0e7490]/8 border-[#0e7490]/20", text: "text-[#0e7490]" };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <div className="flex-1 py-6 px-4">
        <div className="max-w-lg mx-auto space-y-4">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#0e7490]/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#0e7490]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div className="flex justify-center mb-3">
              <span className={`inline-block border rounded-full px-3 py-1 text-xs font-semibold ${resultBadge.bg} ${resultBadge.text}`}>
                Your Assessment: {resultBadge.label}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#1a3a4a] text-center mb-2 leading-tight">
              Thank you, {firstName}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-[#0e7490] text-center mb-3">
              {content.heading}
            </p>
            <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed mb-4">
              {content.body}
            </p>

            <div className="bg-[#0e7490]/8 rounded-xl px-4 py-3 text-center">
              <p className="text-[#0e7490] text-sm font-semibold">
                ✓ Your assessment has been received
              </p>
              <p className="text-gray-500 text-xs mt-0.5">A Carlisle solicitor will call you within 24 hours</p>
            </div>
          </div>

          <a
            href="tel:+441228272395"
            data-testid="thankyou-phone-pi"
            className="block w-full bg-[#0e7490] hover:bg-[#0a5a70] active:bg-[#084d60] text-white text-center rounded-2xl py-5 px-4 transition-colors shadow-sm"
          >
            <p className="text-xs font-medium text-white/80 mb-1">Need to speak to someone sooner?</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">01228 272395</p>
            <p className="text-xs text-white/70 mt-1">Mon to Fri, 9am to 5pm</p>
          </a>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-[#1a3a4a] text-base mb-4">What Happens Next</h2>
            <div className="space-y-4">
              {[
                { n: "1", t: "We review your assessment", b: "A solicitor looks at your answers in detail." },
                { n: "2", t: "We call you within 24 hours", b: "An honest conversation about your situation and the best path forward." },
                { n: "3", t: "No obligation, no upfront cost", b: "If we agree there is a claim worth pursuing, we work on a no win no fee basis. If not, you owe us nothing." },
              ].map((item) => (
                <div key={item.n} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#0e7490] text-white flex items-center justify-center font-bold flex-shrink-0 text-xs mt-0.5">
                    {item.n}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3a4a] text-sm">{item.t}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
