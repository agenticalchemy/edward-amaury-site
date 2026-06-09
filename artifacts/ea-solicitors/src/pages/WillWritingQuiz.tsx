import { useState } from "react";
import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useSubmitWillWritingLead } from "@workspace/api-client-react";
import { getUtmParams } from "@/lib/tracking";
import { useAdHeadline } from "@/hooks/useAdHeadline";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useSeoMeta } from "@/hooks/useSeoMeta";

import { NoWillResults, OutdatedResults, ReviewResults } from "./WillWritingThankYou";

type WillWritingRoute = "no-will" | "outdated" | "review";

const q1Options = [
  "No, I've never had one",
  "Yes, but it's been a while since I looked at it",
  "Yes, and it's fairly recent",
  "I'm not sure",
];

const q2Options = [
  "Got married or entered a civil partnership",
  "Got divorced or separated",
  "Had children or grandchildren",
  "Bought or sold property",
  "Started or closed a business",
  "Moved in with a new partner",
  "None of these",
];

const q3Options = [
  "I live with a partner but we're not married",
  "I have children under 18",
  "I own property",
  "I own or part-own a business",
  "I have stepchildren or a blended family",
  "None of these",
];

const q4Options = [
  "Making sure my partner is provided for",
  "Protecting my children's future",
  "Keeping things simple for my family",
  "Protecting business assets",
  "Reducing inheritance tax",
];

function computeRoute(q1: string, q2Selections: string[]): WillWritingRoute {
  if (q1 === "No, I've never had one" || q1 === "I'm not sure") return "no-will";
  const hasLifeEvent = q2Selections.length > 0 && !q2Selections.every((s) => s === "None of these");
  if (q1 === "Yes, and it's fairly recent" && !hasLifeEvent) return "review";
  return "outdated";
}

type Phase = "quiz" | "result" | "form";

export default function WillWritingQuiz() {
  useSeoMeta(
    "Will Writing Check — Edward & Amaury Solicitors",
    "Find out in 2 minutes whether you need a new will or an update. Free assessment from SRA regulated solicitors in Carlisle, Cumbria."
  );
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>("quiz");
  const [step, setStep] = useState(0);
  const [animating, setAnimating] = useState(false);

  const [q1Answer, setQ1Answer] = useState("");
  const [q2Selections, setQ2Selections] = useState<string[]>([]);
  const [q3Selections, setQ3Selections] = useState<string[]>([]);
  const [q4Answer, setQ4Answer] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const submitMutation = useSubmitWillWritingLead();
  const { getToken } = useRecaptcha();
  const adHeadline = useAdHeadline("");

  const totalSteps = 4;
  const progress = Math.round((step / totalSteps) * 100);

  function toggleMulti(option: string, selections: string[], setSelections: (v: string[]) => void) {
    if (option === "None of these") {
      setSelections(selections.includes("None of these") ? [] : ["None of these"]);
      return;
    }
    const without = selections.filter((s) => s !== "None of these");
    if (without.includes(option)) {
      setSelections(without.filter((s) => s !== option));
    } else {
      setSelections([...without, option]);
    }
  }

  function handleQ1(answer: string) {
    if (animating) return;
    setAnimating(true);
    setQ1Answer(answer);
    setTimeout(() => { setStep(1); setAnimating(false); }, 200);
  }

  function handleQ2Continue() {
    if (q2Selections.length === 0) return;
    setAnimating(true);
    setTimeout(() => { setStep(2); setAnimating(false); }, 200);
  }

  function handleQ3Continue() {
    if (q3Selections.length === 0) return;
    setAnimating(true);
    setTimeout(() => { setStep(3); setAnimating(false); }, 200);
  }

  function handleQ4(answer: string) {
    if (animating) return;
    setAnimating(true);
    setQ4Answer(answer);
    setTimeout(() => {
      setPhase("result");
      setAnimating(false);
      window.scrollTo(0, 0);
      try { window.gtag?.("event", "will_writing_quiz_completed", { event_category: "lead" }); } catch { /* ignore */ }
    }, 200);
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const route = computeRoute(q1Answer, q2Selections);
    const answers: Record<string, string> = {
      q1: q1Answer,
      q2: q2Selections.join(", "),
      q3: q3Selections.join(", "),
      q4: q4Answer,
    };

    const utmParams = getUtmParams();
    const params = new URLSearchParams(window.location.search);
    const gclid = params.get("gclid") ?? undefined;

    // Fire the lead event + show results straight away — nothing waits on the server.
    try { window.dataLayer?.push({ event: "funnel_leads_all", lead_type: "will_writing" }); } catch { /* ignore */ }
    sessionStorage.setItem("ea_lead_firstname", firstName);
    setLocation("/will-writing/results", {
      state: { firstName, route, q2Selections, q3Selections },
    });

    // Save the lead in the background — never blocks the visitor.
    let recaptchaToken: string | undefined;
    try { recaptchaToken = await getToken("submit"); } catch { /* fail open */ }

    submitMutation.mutate({
      data: {
        name: [firstName, lastName].filter(Boolean).join(" "),
        phone,
        email,
        honeypot: honeypot || undefined,
        recaptchaToken,
        route,
        answers,
        gclid,
        utmSource: utmParams["utm_source"],
        utmCampaign: utmParams["utm_campaign"],
        utmMedium: utmParams["utm_medium"],
        utmTerm: utmParams["utm_term"],
        utmContent: utmParams["utm_content"],
        referrer: document.referrer || undefined,
      },
    });
  };

  if (phase === "result") {
    const route = computeRoute(q1Answer, q2Selections);
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <SiteHeader />
        <div className="flex-1 py-8 px-4">
          <div className="max-w-2xl mx-auto space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
              {route === "no-will" && <NoWillResults firstName="" q3={q3Selections} />}
              {route === "outdated" && <OutdatedResults firstName="" q2={q2Selections} />}
              {route === "review" && <ReviewResults firstName="" />}
            </div>

            <a
              href="tel:+441228272395"
              data-testid="result-phone-will-writing"
              className="block w-full bg-[#0e7490] hover:bg-[#0a5a70] active:bg-[#084d60] text-white text-center rounded-2xl py-5 px-4 transition-colors shadow-sm"
            >
              <p className="text-xs font-medium text-white/80 mb-1">Want to talk it through now?</p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">01228 272395</p>
              <p className="text-xs text-white/70 mt-1">Mon–Fri, 9am–5pm</p>
            </a>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <h2 className="font-bold text-[#1a3a4a] text-lg mb-2">Would you like us to sort this for you?</h2>
              <p className="text-gray-600 text-sm mb-5">
                Enter your details and a Carlisle solicitor will call you within 24 hours. Fixed fees, no obligation.
              </p>
              <button
                data-testid="result-cta-will-writing-form"
                onClick={() => { setPhase("form"); window.scrollTo(0, 0); }}
                className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-4 rounded-lg text-base transition-colors shadow-md"
              >
                Request My Free Call →
              </button>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (phase === "form") {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 bg-gray-50 py-12 px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1a3a4a] mb-2">Request a Free Call</h2>
              <p className="text-gray-600 mb-6">Enter your details and a Carlisle solicitor will call you within 24 hours. Fixed fees, no obligation.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                    <input
                      data-testid="input-firstname"
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
                    <input
                      data-testid="input-lastname"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    data-testid="input-phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    data-testid="input-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
                  />
                </div>
                <input
                  type="text"
                  name="website"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
                />
                <button
                  data-testid="button-submit-will-writing"
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-[#0e7490] hover:bg-[#0a5a70] disabled:opacity-60 text-white font-bold py-4 rounded-lg text-lg transition-colors"
                >
                  {submitMutation.isPending ? "Submitting..." : "Request My Free Call →"}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Your information is confidential and will only be used to contact you about your enquiry.
              </p>
            </div>
          </div>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {adHeadline && (
            <div className="bg-[#0e7490]/10 border border-[#0e7490]/20 rounded-lg px-4 py-2 mb-6 text-sm text-[#0e7490] font-medium text-center">
              {adHeadline}
            </div>
          )}

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Question {step + 1} of {totalSteps}</span>
              <span>{progress}% complete</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#0e7490] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Q1 — Single select */}
          {step === 0 && (
            <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a4a] mb-6">
                Do you currently have a will?
              </h2>
              <div className="space-y-3">
                {q1Options.map((option) => (
                  <button
                    key={option}
                    data-testid={`quiz-option-${option.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
                    onClick={() => handleQ1(option)}
                    className="w-full text-left border-2 border-gray-200 hover:border-[#0e7490] hover:bg-teal-50 rounded-xl px-5 py-4 text-gray-700 font-medium transition-all duration-150 group"
                  >
                    <span className="group-hover:text-[#0e7490] transition-colors">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Q2 — Multi-select */}
          {step === 1 && (
            <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a4a] mb-2">
                Have any of these happened in the last few years?
              </h2>
              <p className="text-gray-500 text-sm mb-5">Select all that apply</p>
              <div className="space-y-3 mb-6">
                {q2Options.map((option) => {
                  const selected = q2Selections.includes(option);
                  return (
                    <button
                      key={option}
                      data-testid={`quiz-option-${option.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
                      onClick={() => toggleMulti(option, q2Selections, setQ2Selections)}
                      className={`w-full text-left border-2 rounded-xl px-5 py-4 text-gray-700 font-medium transition-all duration-150 flex items-center gap-3 ${
                        selected ? "border-[#0e7490] bg-teal-50 text-[#0e7490]" : "border-gray-200 hover:border-[#0e7490] hover:bg-teal-50"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${selected ? "border-[#0e7490] bg-[#0e7490]" : "border-gray-300"}`}>
                        {selected && <span className="text-white text-xs">✓</span>}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleQ2Continue}
                disabled={q2Selections.length === 0}
                className="w-full bg-[#0e7490] hover:bg-[#0a5a70] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg text-lg transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Q3 — Multi-select */}
          {step === 2 && (
            <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a4a] mb-2">
                Which of these apply to you right now?
              </h2>
              <p className="text-gray-500 text-sm mb-5">Select all that apply</p>
              <div className="space-y-3 mb-6">
                {q3Options.map((option) => {
                  const selected = q3Selections.includes(option);
                  return (
                    <button
                      key={option}
                      data-testid={`quiz-option-${option.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
                      onClick={() => toggleMulti(option, q3Selections, setQ3Selections)}
                      className={`w-full text-left border-2 rounded-xl px-5 py-4 text-gray-700 font-medium transition-all duration-150 flex items-center gap-3 ${
                        selected ? "border-[#0e7490] bg-teal-50 text-[#0e7490]" : "border-gray-200 hover:border-[#0e7490] hover:bg-teal-50"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${selected ? "border-[#0e7490] bg-[#0e7490]" : "border-gray-300"}`}>
                        {selected && <span className="text-white text-xs">✓</span>}
                      </span>
                      <span>{option}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={handleQ3Continue}
                disabled={q3Selections.length === 0}
                className="w-full bg-[#0e7490] hover:bg-[#0a5a70] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-4 rounded-lg text-lg transition-colors"
              >
                Continue →
              </button>
            </div>
          )}

          {/* Q4 — Single select */}
          {step === 3 && (
            <div className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a4a] mb-6">
                What matters most to you?
              </h2>
              <div className="space-y-3">
                {q4Options.map((option) => (
                  <button
                    key={option}
                    data-testid={`quiz-option-${option.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
                    onClick={() => handleQ4(option)}
                    className="w-full text-left border-2 border-gray-200 hover:border-[#0e7490] hover:bg-teal-50 rounded-xl px-5 py-4 text-gray-700 font-medium transition-all duration-150 group"
                  >
                    <span className="group-hover:text-[#0e7490] transition-colors">{option}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Back button */}
          {step > 0 && (
            <button
              onClick={handleBack}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Back
            </button>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            Or call us directly on{" "}
            <a href="tel:+441228272395" className="text-[#0e7490] font-semibold">01228 272395</a>
          </p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
