import { useState } from "react";
import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useSubmitVisaLead } from "@workspace/api-client-react";
import { getUtmParams, setEnhancedConversionData } from "@/lib/tracking";
import { useAdHeadline } from "@/hooks/useAdHeadline";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { getVisaResultContent } from "./VisaThankYou";

type ResultBand = "strong" | "challenges" | "expert";

interface QuizOption {
  text: string;
  score: number;
}

interface VisaQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

const visaQuestions: VisaQuestion[] = [
  {
    id: "q1",
    text: "What's your relationship status with your partner?",
    options: [
      { text: "Legally married", score: 3 },
      { text: "Civil partnership", score: 3 },
      { text: "Living together for 2 or more years", score: 2 },
      { text: "Less than 2 years together", score: 1 },
      { text: "Engaged but not yet married", score: 0 },
      { text: "In a relationship but we don't live together", score: 0 },
    ],
  },
  {
    id: "q2",
    text: "What is your current annual income (before tax)?",
    options: [
      { text: "£29,000 or more", score: 3 },
      { text: "Between £23,500 and £28,999", score: 1 },
      { text: "Below £23,500", score: 0 },
      { text: "I am self-employed", score: 1 },
      { text: "I am not currently working", score: 0 },
    ],
  },
  {
    id: "q3",
    text: "Do you have savings that could support your application?",
    options: [
      { text: "Over £16,000 in savings", score: 3 },
      { text: "Less than £16,000 in savings", score: 1 },
      { text: "No significant savings", score: 0 },
      { text: "Not sure what counts as savings for the visa", score: 1 },
    ],
  },
  {
    id: "q4",
    text: "Does your partner meet the English language requirement?",
    options: [
      { text: "My partner is from an English-speaking country", score: 3 },
      { text: "My partner has a relevant English test or UK degree", score: 3 },
      { text: "My partner plans to take the English test", score: 2 },
      { text: "English is a barrier for my partner", score: 0 },
      { text: "I'm not sure what the requirement is", score: 1 },
    ],
  },
  {
    id: "q5",
    text: "Do you have suitable accommodation arranged in the UK?",
    options: [
      { text: "We own or rent a property with enough space", score: 3 },
      { text: "We'll be living with family", score: 2 },
      { text: "I still need to arrange accommodation", score: 1 },
      { text: "I'm not sure what 'adequate accommodation' means", score: 1 },
    ],
  },
  {
    id: "q6",
    text: "Has your partner ever been refused a UK visa or had any immigration issues?",
    options: [
      { text: "Clean immigration history", score: 3 },
      { text: "A previous visa refusal", score: 1 },
      { text: "A previous overstay in the UK", score: 0 },
      { text: "Subject to a deportation order or re-entry ban", score: 0 },
      { text: "Not sure", score: 1 },
    ],
  },
  {
    id: "q7",
    text: "How much evidence of your relationship do you have?",
    options: [
      { text: "Lots — photos, messages, joint accounts, travel history", score: 3 },
      { text: "Some — a few items showing our relationship", score: 2 },
      { text: "Not much — we haven't documented our relationship well", score: 1 },
      { text: "We got married quickly or have a short relationship history", score: 0 },
    ],
  },
];

function getResultBand(score: number): ResultBand {
  if (score >= 16) return "strong";
  if (score >= 10) return "challenges";
  return "expert";
}

type Phase = "quiz" | "result" | "form";

export default function VisaQuiz() {
  useSeoMeta(
    "UK Spouse Visa Assessment — Edward & Amaury Solicitors",
    "Free online UK spouse visa eligibility check. Find out your chances in under 2 minutes. Expert immigration solicitors in Carlisle, Cumbria."
  );
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>("quiz");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [animating, setAnimating] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partnerNationality, setPartnerNationality] = useState("");
  const [honeypot, setHoneypot] = useState("");

  const submitMutation = useSubmitVisaLead();
  const { getToken } = useRecaptcha();

  const totalSteps = visaQuestions.length;
  const progress = Math.round((step / totalSteps) * 100);
  const currentQuestion = visaQuestions[step];

  const handleAnswer = (question: VisaQuestion, option: QuizOption) => {
    if (animating) return;
    setAnimating(true);

    const newScores = [...scores, option.score];
    const newAnswers = { ...answers, [question.id]: option.text };
    setScores(newScores);
    setAnswers(newAnswers);

    if (step < totalSteps - 1) {
      setTimeout(() => { setStep(step + 1); setAnimating(false); }, 200);
    } else {
      setTimeout(() => {
        setPhase("result");
        setAnimating(false);
        window.scrollTo(0, 0);
        try { window.gtag?.("event", "visa_quiz_completed", { event_category: "lead" }); } catch { /* ignore */ }
      }, 200);
    }
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const adHeadline = useAdHeadline("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = getResultBand(totalScore);
    const utmParams = getUtmParams();
    const gclid = utmParams["gclid"];

    // Fire the lead event + show the result straight away — it's already worked
    // out on the visitor's own device and needs nothing from the server.
    setEnhancedConversionData(email, phone);
    try { window.dataLayer?.push({ event: "funnel_leads_all", lead_type: "spouse_visa" }); } catch { /* ignore */ }
    sessionStorage.setItem("ea_lead_firstname", firstName);
    setLocation("/uk-spouse-visa/thank-you", {
      state: { firstName, result, score: totalScore },
    });

    // Save the lead in the background. This is a client-side route change, so
    // the tab never unloads and this request keeps running — the visitor is
    // never blocked by a slow save or email.
    let recaptchaToken: string | undefined;
    try { recaptchaToken = await getToken("submit"); } catch { /* fail open */ }

    submitMutation.mutate({
      data: {
        fullName: [firstName, lastName].filter(Boolean).join(" "),
        email,
        phone,
        partnerNationality,
        honeypot: honeypot || undefined,
        recaptchaToken,
        score: totalScore,
        result,
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
    const result = getResultBand(totalScore);
    const content = getVisaResultContent({ result });
    const badge =
      result === "strong"
        ? { label: "Strong Application", bg: "bg-green-50 border-green-200", text: "text-green-700" }
        : result === "challenges"
        ? { label: "Some Challenges", bg: "bg-amber-50 border-amber-200", text: "text-amber-700" }
        : { label: "Expert Support Needed", bg: "bg-[#0e7490]/8 border-[#0e7490]/20", text: "text-[#0e7490]" };
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <SiteHeader />
        <div className="flex-1 py-6 px-4">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-center mb-3">
                <span className={`inline-block border rounded-full px-3 py-1 text-xs font-semibold ${badge.bg} ${badge.text}`}>
                  Your Assessment: {badge.label}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a3a4a] text-center mb-3 leading-tight">
                {content.heading}
              </h1>
              <p className="text-gray-600 text-sm sm:text-base text-center leading-relaxed">
                {content.body}
              </p>
            </div>

            <a
              href="tel:+441228272395"
              data-testid="result-phone-visa"
              className="block w-full bg-[#0e7490] hover:bg-[#0a5a70] active:bg-[#084d60] text-white text-center rounded-2xl py-5 px-4 transition-colors shadow-sm"
            >
              <p className="text-xs font-medium text-white/80 mb-1">Want to discuss your application now?</p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">01228 272395</p>
              <p className="text-xs text-white/70 mt-1">Mon to Fri, 9am to 5pm</p>
            </a>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <h2 className="font-bold text-[#1a3a4a] text-lg mb-2">Want our immigration team to review your case?</h2>
              <p className="text-gray-600 text-sm mb-5">
                Enter your details and a specialist solicitor will call you within 24 hours. Free first call, no obligation.
              </p>
              <button
                data-testid="result-cta-visa-form"
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
              <h2 className="text-2xl font-bold text-[#1a3a4a] mb-2">Request a Free Consultation</h2>
              <p className="text-gray-600 mb-6">Enter your details and a specialist immigration solicitor will call you within 24 hours. Free first call, no obligation.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                    <input
                      data-testid="input-firstname-visa"
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
                      data-testid="input-lastname-visa"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address *</label>
                  <input
                    data-testid="input-email-visa"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number *</label>
                  <input
                    data-testid="input-phone-visa"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Partner's Nationality *</label>
                  <input
                    data-testid="input-nationality"
                    type="text"
                    required
                    value={partnerNationality}
                    onChange={(e) => setPartnerNationality(e.target.value)}
                    placeholder="e.g. Indian, Nigerian, American"
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
                  data-testid="button-submit-visa"
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
          {/* Ad message match banner */}
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

          {/* Question card */}
          <div
            className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a4a] mb-6">
              {currentQuestion.text}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.text}
                  data-testid={`visa-option-${option.text.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
                  onClick={() => handleAnswer(currentQuestion, option)}
                  className="w-full text-left border-2 border-gray-200 hover:border-[#0e7490] hover:bg-teal-50 rounded-xl px-5 py-4 text-gray-700 font-medium transition-all duration-150 group"
                >
                  <span className="group-hover:text-[#0e7490] transition-colors">{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Back button */}
          {step > 0 && (
            <button
              onClick={() => {
                setStep(step - 1);
                setScores(scores.slice(0, -1));
                const newAnswers = { ...answers };
                delete newAnswers[visaQuestions[step].id];
                setAnswers(newAnswers);
              }}
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
