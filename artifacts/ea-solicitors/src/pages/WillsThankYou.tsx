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
    let personalLine = "Our team will guide you through the next steps of the probate process.";
    if (q3.includes("don't know")) personalLine = "We'll start from the beginning and explain every step clearly, so you always know what's happening and what's next.";
    else if (q3.includes("stuck")) personalLine = "We'll step in, review where things stand, and take over the process so you can focus on your family.";
    else if (q3.includes("take over")) personalLine = "We're experienced in taking over probate matters from clients and will make the transition smooth and straightforward.";
    else if (q3.includes("not working out")) personalLine = "We'll review the current position and take over so the estate is handled properly from this point forward.";
    return {
      heading: `Thank you, ${firstName} — We Can Help You With This`,
      personalLine,
    };
  }

  if (route === "wills") {
    const q2 = answers["q2b"] ?? "";
    let personalLine = "We'll call to discuss your situation and recommend the right approach for you.";
    if (q2.includes("baby")) personalLine = "Having a child is one of the most important reasons to get a will in place — we'll make sure your family is protected.";
    else if (q2.includes("married")) personalLine = "Getting married changes everything legally. We'll make sure your will reflects your new situation properly.";
    else if (q2.includes("property")) personalLine = "Property ownership makes a proper will essential — we'll ensure it's done correctly from the start.";
    else if (q2.includes("business")) personalLine = "Business owners need careful planning. We'll make sure your will addresses both personal and business succession.";
    else if (q2.includes("sorted")) personalLine = "Sorting your will is one of the best things you can do for your family. We'll make it straightforward.";
    else if (q2.includes("Updating")) personalLine = "We'll review your existing will and make sure it still reflects your wishes accurately.";
    return {
      heading: `Thank you, ${firstName} — Here's What We'd Recommend`,
      personalLine,
    };
  }

  if (route === "both") {
    const q4 = answers["q4c"] ?? "";
    let personalLine = "You're doing the right thing — dealing with both the estate and your own planning is wise and we're here to help with both.";
    if (q4.includes("going through")) personalLine = "Seeing what a family goes through without a clear will is a powerful motivator. We'll make sure your family never has to face the same uncertainty.";
    else if (q4.includes("parent")) personalLine = "Protecting your children's future is everything. We'll make sure they're provided for no matter what happens.";
    else if (q4.includes("property or a business")) personalLine = "Assets like property and businesses need proper succession planning. We'll make sure everything is in order.";
    else if (q4.includes("order")) personalLine = "Getting everything in order gives you real peace of mind. We'll make the process as simple as possible.";
    return {
      heading: `Thank you, ${firstName} — You're Doing the Right Thing`,
      personalLine,
    };
  }

  // not-sure
  return {
    heading: `Thank you, ${firstName} — We'll Help You Work It Out`,
    personalLine: "Many people aren't sure exactly what they need — that's what we're here for. We'll have a conversation, understand your situation, and point you in the right direction.",
  };
}

export default function WillsThankYou() {
  const [location] = useLocation();
  const state = (window.history.state?.state ?? {}) as ThankYouState;
  const adHeadline = useAdHeadline("");

  useEffect(() => {
    fireWillsEvent();
  }, []);

  const content = getPersonalisedContent(state);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Teal banner */}
      <div className="bg-[#0e7490] text-white text-center py-4 px-4">
        <p className="font-semibold">
          Your details have been received. A member of our team will call you within 24 hours.
        </p>
      </div>

      <div className="flex-1 bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            {adHeadline && (
              <p className="text-sm font-medium text-[#0e7490] mb-2 uppercase tracking-wide">
                {adHeadline}
              </p>
            )}
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1a3a4a] mb-4">{content.heading}</h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">{content.personalLine}</p>

            <div className="border-t border-gray-100 pt-6">
              <h2 className="font-bold text-[#1a3a4a] text-lg mb-4">What Happens Next</h2>
              <div className="space-y-4">
                {[
                  { n: "1", t: "We review your answers", b: "Our team looks over the details you've shared to prepare for your call." },
                  { n: "2", t: "We call you within 24 hours", b: "A Carlisle-based solicitor will call you at a time that suits you." },
                  { n: "3", t: "We explain your options clearly", b: "No jargon, no pressure. Just a plain-speaking conversation about what you need and what it will cost." },
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
              data-testid="thankyou-phone-wills"
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
