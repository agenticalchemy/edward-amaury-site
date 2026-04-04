import { useEffect } from "react";
import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { fireWillsEvent } from "@/lib/tracking";
import { useAdHeadline } from "@/hooks/useAdHeadline";

type Route = "probate" | "wills" | "both" | "not-sure";

interface ThankYouState {
  firstName?: string;
  route?: Route;
  answers?: Record<string, string>;
}

function getPersonalisedContent(state: ThankYouState) {
  const { firstName = "there", route, answers = {} } = state;

  if (route === "probate") {
    const q3 = answers["q3"] ?? "";
    let subtitle = "Our team will guide you through the next steps of the probate process.";
    if (q3.includes("don't know")) subtitle = "We'll start from the beginning and explain every step clearly, so you always know what's happening and what's next.";
    else if (q3.includes("stuck")) subtitle = "We'll step in, review where things stand, and take over the process so you can focus on your family.";
    else if (q3.includes("take over")) subtitle = "We're experienced in taking over probate matters and will make the transition smooth and straightforward.";
    else if (q3.includes("not working out")) subtitle = "We'll review the current position and take over so the estate is handled properly from this point forward.";
    return { heading: `We Can Help You With This`, subtitle };
  }

  if (route === "wills") {
    const q2 = answers["q2b"] ?? "";
    let subtitle = "We'll call to discuss your situation and recommend the right approach for you.";
    if (q2.includes("baby")) subtitle = "Having a child is one of the most important reasons to get a will in place — we'll make sure your family is protected.";
    else if (q2.includes("married")) subtitle = "Getting married changes everything legally. We'll make sure your will reflects your new situation properly.";
    else if (q2.includes("property")) subtitle = "Property ownership makes a proper will essential — we'll ensure it's done correctly from the start.";
    else if (q2.includes("business")) subtitle = "Business owners need careful planning. We'll make sure your will addresses both personal and business succession.";
    else if (q2.includes("sorted")) subtitle = "Sorting your will is one of the best things you can do for your family. We'll make it straightforward.";
    else if (q2.includes("Updating")) subtitle = "We'll review your existing will and make sure it still reflects your wishes accurately.";
    return { heading: `Here's What We'd Recommend`, subtitle };
  }

  if (route === "both") {
    const q4 = answers["q4c"] ?? "";
    let subtitle = "You're doing the right thing — dealing with both the estate and your own planning is wise and we're here to help with both.";
    if (q4.includes("going through")) subtitle = "Seeing what a family goes through without a clear will is a powerful motivator. We'll make sure your family never faces the same uncertainty.";
    else if (q4.includes("parent")) subtitle = "Protecting your children's future is everything. We'll make sure they're provided for no matter what happens.";
    else if (q4.includes("property or a business")) subtitle = "Assets like property and businesses need proper succession planning. We'll make sure everything is in order.";
    else if (q4.includes("order")) subtitle = "Getting everything in order gives you real peace of mind. We'll make the process as simple as possible.";
    return { heading: `You're Doing the Right Thing`, subtitle };
  }

  return {
    heading: `We'll Help You Work It Out`,
    subtitle: "Many people aren't sure exactly what they need — that's what we're here for. We'll have a conversation, understand your situation, and point you in the right direction.",
  };
}

export default function WillsThankYou() {
  const [location] = useLocation();
  const state = (window.history.state?.state ?? {}) as ThankYouState;
  const firstName = state.firstName || sessionStorage.getItem("ea_lead_firstname") || "there";

  useEffect(() => {
    fireWillsEvent();
  }, []);

  const content = getPersonalisedContent(state);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SiteHeader />

      <div className="flex-1 py-6 px-4">
        <div className="max-w-lg mx-auto space-y-4">

          {/* Success card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            {/* Checkmark */}
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-[#0e7490]/10 flex items-center justify-center">
                <svg className="w-7 h-7 text-[#0e7490]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-xl sm:text-2xl font-bold text-[#1a3a4a] text-center mb-2 leading-tight">
              Thank you, {firstName}
            </h1>
            <p className="text-base sm:text-lg font-semibold text-[#0e7490] text-center mb-3">
              {content.heading}
            </p>
            <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed mb-4">
              {content.subtitle}
            </p>

            {/* Confirmation pill */}
            <div className="bg-[#0e7490]/8 rounded-xl px-4 py-3 text-center">
              <p className="text-[#0e7490] text-sm font-semibold">
                ✓ Your details have been received
              </p>
              <p className="text-gray-500 text-xs mt-0.5">A member of our team will call you within 24 hours</p>
            </div>
          </div>

          {/* Phone CTA — most prominent on mobile */}
          <a
            href="tel:01228272395"
            data-testid="thankyou-phone-wills"
            className="block w-full bg-[#0e7490] hover:bg-[#0a5a70] active:bg-[#084d60] text-white text-center rounded-2xl py-5 px-4 transition-colors shadow-sm"
          >
            <p className="text-xs font-medium text-white/80 mb-1">Need to speak to someone sooner?</p>
            <p className="text-2xl sm:text-3xl font-bold tracking-tight">01228 272395</p>
            <p className="text-xs text-white/70 mt-1">Mon–Fri, 9am–5pm</p>
          </a>

          {/* What happens next */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-[#1a3a4a] text-base mb-4">What Happens Next</h2>
            <div className="space-y-4">
              {[
                { n: "1", t: "We review your answers", b: "Our team looks over the details you've shared to prepare for your call." },
                { n: "2", t: "We call you within 24 hours", b: "A Carlisle-based solicitor will call you at a time that suits you." },
                { n: "3", t: "We explain your options clearly", b: "No jargon, no pressure — a plain-speaking conversation about what you need and what it will cost." },
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
