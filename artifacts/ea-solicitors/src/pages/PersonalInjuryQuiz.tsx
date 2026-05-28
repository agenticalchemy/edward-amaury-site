import { useState } from "react";
import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { useSubmitPersonalInjuryLead } from "@workspace/api-client-react";
import { getUtmParams } from "@/lib/tracking";
import { useAdHeadline } from "@/hooks/useAdHeadline";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import type {
  PersonalInjuryLeadBodyAccidentType,
  PersonalInjuryLeadBodyWhen,
  PersonalInjuryLeadBodyFault,
  PersonalInjuryLeadBodyDoctor,
  PersonalInjuryLeadBodyImpact,
  PersonalInjuryLeadBodyResult,
} from "@workspace/api-client-react";

type AccidentType = PersonalInjuryLeadBodyAccidentType;
type When = PersonalInjuryLeadBodyWhen;
type Fault = PersonalInjuryLeadBodyFault;
type Doctor = PersonalInjuryLeadBodyDoctor;
type Impact = PersonalInjuryLeadBodyImpact;
type ResultBand = PersonalInjuryLeadBodyResult;

interface QuizOption<V extends string> {
  text: string;
  value: V;
  score: number;
}

interface PIQuestion<V extends string> {
  id: string;
  field: "accidentType" | "when" | "fault" | "doctor" | "impact";
  text: string;
  options: QuizOption<V>[];
}

const q1: PIQuestion<AccidentType> = {
  id: "q1",
  field: "accidentType",
  text: "What kind of accident or injury was it?",
  options: [
    { text: "Road traffic accident", value: "rta", score: 3 },
    { text: "Accident at work", value: "work", score: 3 },
    { text: "Slip, trip, or fall", value: "slip", score: 3 },
    { text: "Medical negligence", value: "med-neg", score: 3 },
    { text: "Other injury caused by someone else", value: "other", score: 2 },
  ],
};

const q2: PIQuestion<When> = {
  id: "q2",
  field: "when",
  text: "When did it happen?",
  options: [
    { text: "In the last 6 months", value: "last-6-months", score: 3 },
    { text: "6 to 12 months ago", value: "6-12-months", score: 3 },
    { text: "1 to 2 years ago", value: "1-2-years", score: 2 },
    { text: "Over 2 years ago", value: "over-2-years", score: 0 },
  ],
};

const q3: PIQuestion<Fault> = {
  id: "q3",
  field: "fault",
  text: "Was someone else at fault?",
  options: [
    { text: "Yes, clearly", value: "yes-clearly", score: 3 },
    { text: "I think so", value: "i-think-so", score: 2 },
    { text: "I'm not sure", value: "not-sure", score: 1 },
    { text: "No, or it was my fault", value: "no-or-mine", score: 0 },
  ],
};

const q4: PIQuestion<Doctor> = {
  id: "q4",
  field: "doctor",
  text: "Have you seen a doctor about the injury?",
  options: [
    { text: "Yes, treated by GP or hospital", value: "yes-treated", score: 3 },
    { text: "Yes, still in treatment", value: "yes-ongoing", score: 3 },
    { text: "No, but planning to", value: "no-planning", score: 1 },
    { text: "No, didn't think it was serious enough", value: "no-not-serious", score: 0 },
  ],
};

const q5: PIQuestion<Impact> = {
  id: "q5",
  field: "impact",
  text: "How has the injury affected you?",
  options: [
    { text: "Off work or major impact on daily life", value: "major", score: 3 },
    { text: "Ongoing pain or treatment needed", value: "ongoing", score: 2 },
    { text: "Some impact but mostly recovered", value: "some", score: 1 },
    { text: "Inconvenience but no lasting effect", value: "minor", score: 0 },
  ],
};

const questions = [q1, q2, q3, q4, q5] as const;

interface QuizState {
  accidentType?: AccidentType;
  when?: When;
  fault?: Fault;
  doctor?: Doctor;
  impact?: Impact;
}

function getResultBand(state: QuizState, score: number): ResultBand {
  if (state.when === "over-2-years") return "complex";
  if (state.fault === "no-or-mine") return "complex";
  if (score >= 12) return "strong";
  if (score >= 7) return "possible";
  return "complex";
}

type Phase = "quiz" | "form";

export default function PersonalInjuryQuiz() {
  useSeoMeta(
    "Personal Injury Claim Assessment — Edward & Amaury Solicitors",
    "Free 2-minute personal injury claim assessment. Find out if you have a claim worth pursuing. Carlisle solicitors."
  );
  const [, setLocation] = useLocation();
  const [phase, setPhase] = useState<Phase>("quiz");
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizState, setQuizState] = useState<QuizState>({});
  const [animating, setAnimating] = useState(false);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [formError, setFormError] = useState("");

  const submitMutation = useSubmitPersonalInjuryLead();
  const { getToken } = useRecaptcha();

  const totalSteps = questions.length;
  const progress = Math.round((step / totalSteps) * 100);
  const currentQuestion = questions[step];

  const handleAnswer = (
    question: typeof currentQuestion,
    option: QuizOption<string>
  ) => {
    if (animating) return;
    setAnimating(true);

    const newScores = [...scores, option.score];
    const newAnswers = { ...answers, [question.id]: option.text };
    const newQuizState = { ...quizState, [question.field]: option.value };

    setScores(newScores);
    setAnswers(newAnswers);
    setQuizState(newQuizState);

    if (step < totalSteps - 1) {
      setTimeout(() => { setStep(step + 1); setAnimating(false); }, 200);
    } else {
      setTimeout(() => { setPhase("form"); setAnimating(false); }, 200);
    }
  };

  const totalScore = scores.reduce((a, b) => a + b, 0);
  const adHeadline = useAdHeadline("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!quizState.accidentType || !quizState.when || !quizState.fault || !quizState.doctor || !quizState.impact) {
      setFormError("Please complete the quiz before submitting.");
      return;
    }

    const result = getResultBand(quizState, totalScore);
    const utmParams = getUtmParams();
    const params = new URLSearchParams(window.location.search);

    let recaptchaToken: string | undefined;
    try { recaptchaToken = await getToken("submit"); } catch { /* fail open */ }

    submitMutation.mutate(
      {
        data: {
          name: [firstName, lastName].filter(Boolean).join(" "),
          email,
          phone,
          honeypot: honeypot || undefined,
          recaptchaToken,
          accidentType: quizState.accidentType,
          when: quizState.when,
          fault: quizState.fault,
          doctor: quizState.doctor,
          impact: quizState.impact,
          score: totalScore,
          result,
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
          sessionStorage.setItem("ea_lead_firstname", firstName);
          setLocation("/personal-injury/thank-you", {
            state: {
              firstName,
              result,
              score: totalScore,
            },
          });
        },
        onError: () => {
          setFormError("Something went wrong. Please try again or call us on 01228 272395.");
        },
      }
    );
  };

  if (phase === "form") {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <div className="flex-1 bg-gray-50 py-12 px-4">
          <div className="max-w-lg mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-[#1a3a4a] mb-2">Almost there</h2>
              <p className="text-gray-600 mb-6">Enter your details to see your assessment.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">First Name *</label>
                    <input
                      data-testid="input-firstname-pi"
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
                      data-testid="input-lastname-pi"
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
                    data-testid="input-email-pi"
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
                    data-testid="input-phone-pi"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Your phone number"
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
                  <p className="text-red-600 text-sm" data-testid="form-error-pi">{formError}</p>
                )}
                <button
                  data-testid="button-submit-pi"
                  type="submit"
                  disabled={submitMutation.isPending}
                  className="w-full bg-[#0e7490] hover:bg-[#0a5a70] disabled:opacity-60 text-white font-bold py-4 rounded-lg text-lg transition-colors"
                >
                  {submitMutation.isPending ? "Submitting..." : "See My Results"}
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

          <div
            className={`bg-white rounded-2xl shadow-lg p-6 sm:p-8 transition-opacity duration-200 ${animating ? "opacity-0" : "opacity-100"}`}
          >
            <h2 className="text-xl sm:text-2xl font-bold text-[#1a3a4a] mb-6">
              {currentQuestion.text}
            </h2>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  data-testid={`pi-option-${option.value}`}
                  onClick={() => handleAnswer(currentQuestion, option)}
                  className="w-full text-left border-2 border-gray-200 hover:border-[#0e7490] hover:bg-teal-50 rounded-xl px-5 py-4 text-gray-700 font-medium transition-all duration-150 group"
                >
                  <span className="group-hover:text-[#0e7490] transition-colors">{option.text}</span>
                </button>
              ))}
            </div>
          </div>

          {step > 0 && (
            <button
              onClick={() => {
                const prev = step - 1;
                setStep(prev);
                setScores(scores.slice(0, -1));
                const newAnswers = { ...answers };
                delete newAnswers[questions[prev].id];
                setAnswers(newAnswers);
                const newState = { ...quizState };
                delete newState[questions[prev].field];
                setQuizState(newState);
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
