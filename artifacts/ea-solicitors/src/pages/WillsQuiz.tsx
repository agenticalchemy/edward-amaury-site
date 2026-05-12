import { useState } from "react";
import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useSubmitWillsLead } from "@workspace/api-client-react";
import { getUtmParams } from "@/lib/tracking";
import { useAdHeadline } from "@/hooks/useAdHeadline";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useSeoMeta } from "@/hooks/useSeoMeta";

type Route = "probate" | "wills" | "both" | "not-sure";

interface Question {
  id: string;
  text: string;
  options: string[];
}

const q1: Question = {
  id: "q1",
  text: "What best describes your situation right now?",
  options: [
    "Someone has died and I'm dealing with their estate",
    "I'm alive and want to put a will in place or update one",
    "Both — a recent death, and I also need to sort my own will",
    "I'm not sure, I just need someone to guide me",
  ],
};

const pathA: Question[] = [
  {
    id: "q2",
    text: "Do you know if the person who died left a will?",
    options: ["Yes, there is a will", "No, there is no will", "I'm not sure"],
  },
  {
    id: "q3",
    text: "Have you already started the probate process?",
    options: [
      "No, I don't know where to begin",
      "I've started but I'm stuck",
      "I need professional help to take over",
      "Another solicitor was handling it but it's not working out",
    ],
  },
  {
    id: "q4",
    text: "What would help you most right now?",
    options: [
      "Someone to handle the whole process",
      "Understanding what needs to happen and what it costs",
      "Help with a specific part",
      "I just need to talk to someone who understands",
    ],
  },
];

const pathB: Question[] = [
  {
    id: "q2b",
    text: "What's prompted you to look into this now?",
    options: [
      "New baby or expecting",
      "Recently married or engaged",
      "Bought a property",
      "I own a business",
      "Just want to get it sorted",
      "Updating an existing will",
    ],
  },
  {
    id: "q3b",
    text: "Do you currently have a will in place?",
    options: [
      "No, this would be my first",
      "Yes, but it needs updating",
      "Yes, but I'm not sure it's still valid",
      "My partner and I both need wills",
    ],
  },
  {
    id: "q4b",
    text: "What matters most to you?",
    options: [
      "Protecting my children's future",
      "Making sure my partner is provided for",
      "Keeping things simple for my family",
      "Protecting business assets",
      "Reducing inheritance tax",
    ],
  },
];

const pathD: Question[] = [
  {
    id: "q2d",
    text: "Has someone close to you recently passed away?",
    options: ["Yes", "No"],
  },
  {
    id: "q3d",
    text: "Do you currently have a will in place?",
    options: ["Yes", "No", "I don't know"],
  },
  {
    id: "q4d",
    text: "What would be most helpful for you right now?",
    options: [
      "A free conversation to understand my options",
      "Clear guidance on what I need and what it costs",
      "Someone to point me in the right direction",
    ],
  },
];

const pathCExtra: Question = {
  id: "q4c",
  text: "For your own will — what's the main reason?",
  options: [
    "I don't want my family going through what I'm going through now",
    "I'm a parent and need to protect my children",
    "I own property or a business",
    "I just want everything in order",
  ],
};

function getRouteFromQ1(answer: string): Route {
  if (answer.startsWith("Someone has died")) return "probate";
  if (answer.startsWith("I'm alive")) return "wills";
  if (answer.startsWith("Both")) return "both";
  return "not-sure";
}

function buildQuestions(route: Route): Question[] {
  if (route === "probate") return pathA;
  if (route === "wills") return pathB;
  if (route === "both") return [...pathA.slice(0, 2), pathCExtra];
  return pathD;
}

type Phase = "quiz" | "form";

export default function WillsQuiz() {
  useSeoMeta(
    "Wills & Probate Assessment — Edward & Amaury Solicitors",
    "Answer a few quick questions to find out which wills or probate service is right for you. SRA regulated solicitors in Carlisle."
  );
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>("quiz");
  const [step, setStep] = useState(0);
  const [route, setRoute] = useState<Route | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [animating, setAnimating] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formError, setFormError] = useState("");

  const submitMutation = useSubmitWillsLead();
  const { getToken } = useRecaptcha();

  const allQuestions = [q1, ...questions];
  const totalSteps = allQuestions.length;
  const progress = Math.round(((step) / (totalSteps)) * 100);

  const handleAnswer = (question: Question, answer: string) => {
    if (animating) return;
    setAnimating(true);

    const newAnswers = { ...answers, [question.id]: answer };
    setAnswers(newAnswers);

    if (step === 0) {
      const r = getRouteFromQ1(answer);
      setRoute(r);
      setQuestions(buildQuestions(r));
      setTimeout(() => { setStep(1); setAnimating(false); }, 200);
    } else if (step < totalSteps - 1) {
      setTimeout(() => { setStep(step + 1); setAnimating(false); }, 200);
    } else {
      setTimeout(() => { setPhase("form"); setAnimating(false); }, 200);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const utmParams = getUtmParams();
    const params = new URLSearchParams(window.location.search);

    let recaptchaToken: string | undefined;
    try { recaptchaToken = await getToken("submit"); } catch { /* fail open */ }

    submitMutation.mutate(
      {
        data: {
          name: [firstName, lastName].filter(Boolean).join(" "),
          phone,
          email,
          honeypot: honeypot || undefined,
          recaptchaToken,
          route: route!,
          answers,
          gclid: params.get("gclid") ?? undefined,
          utmSource: utmParams["utm_source"],
          utmCampaign: utmParams["utm_campaign"],
          utmMedium: utmParams["utm_medium"],
          utmTerm: utmParams["utm_term"],
          utmContent: utmParams["utm_content"],
          referrer: document.referrer || undefined,
        },
      },
      {
        onSuccess: () => {
          try {
            (window.dataLayer as unknown[]).push({ event: "Wills_leads" });
          } catch { /* ignore */ }
          sessionStorage.setItem("ea_lead_firstname", firstName);
          setLocation("/wills-and-probate/thank-you", {
            state: {
              firstName,
              route,
              answers,
            },
          });
        },
        onError: () => {
          setFormError("Something went wrong. Please try again or call us on 01228 272395.");
        },
      }
    );
  };

  const currentQuestion = allQuestions[step];
  const adHeadline = useAdHeadline("");

  if (phase === "form") {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 bg-gray-50 py-12 px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1a3a4a] mb-2">Almost there</h2>
              <p className="text-gray-600 mb-6">Enter your details to see your personalised recommendation</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                    <input
                      data-testid="input-firstname-wills"
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
                      data-testid="input-lastname-wills"
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
                {formError && (
                  <p className="text-red-600 text-sm" data-testid="form-error">{formError}</p>
                )}
                <button
                  data-testid="button-submit-wills"
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-[#0e7490] hover:bg-[#0a5a70] disabled:opacity-60 text-white font-bold py-4 rounded-lg text-lg transition-colors"
                >
                  {submitMutation.isPending ? "Submitting..." : "See My Recommendation"}
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
                  key={option}
                  data-testid={`quiz-option-${option.slice(0, 20).replace(/\s/g, "-").toLowerCase()}`}
                  onClick={() => handleAnswer(currentQuestion, option)}
                  className="w-full text-left border-2 border-gray-200 hover:border-[#0e7490] hover:bg-teal-50 rounded-xl px-5 py-4 text-gray-700 font-medium transition-all duration-150 group"
                >
                  <span className="group-hover:text-[#0e7490] transition-colors">{option}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Back button */}
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
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
