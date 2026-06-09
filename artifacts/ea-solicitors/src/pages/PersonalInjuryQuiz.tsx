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

type Phase = "quiz" | "result" | "form";

function accidentTypeWithArticle(a: AccidentType): string {
  switch (a) {
    case "rta": return "a road traffic accident";
    case "work": return "an accident at work";
    case "slip": return "a slip, trip or fall";
    case "med-neg": return "a case of medical negligence";
    case "other": return "an injury caused by someone else";
  }
}

function whenLabel(w: When): string {
  switch (w) {
    case "last-6-months": return "in the last 6 months";
    case "6-12-months": return "6 to 12 months ago";
    case "1-2-years": return "1 to 2 years ago";
    case "over-2-years": return "over 2 years ago";
  }
}

function impactClause(i: Impact): string {
  switch (i) {
    case "major": return "it's left you off work or your daily life seriously disrupted";
    case "ongoing": return "you're still in pain or in treatment";
    case "some": return "it knocked you for a while, even if you've mostly recovered";
    case "minor": return "the day-to-day impact has been minor";
  }
}

function faultNote(state: QuizState): string {
  if (state.fault === "i-think-so" || state.fault === "not-sure") {
    return " Fault is one piece our specialists would look at with you.";
  }
  return "";
}

function doctorNote(state: QuizState): string {
  if (state.doctor === "no-planning" || state.doctor === "no-not-serious") {
    return " It's worth seeing a GP soon. A medical record makes any claim stronger.";
  }
  return "";
}

function buildPersonalContent(state: QuizState, result: ResultBand) {
  const aType = accidentTypeWithArticle(state.accidentType!);
  const when = whenLabel(state.when!);
  const impact = impactClause(state.impact!);

  const recap = `You told us about ${aType} ${when}, and ${impact}.`;

  if (result === "strong") {
    return {
      label: "Strong Claim",
      badgeBg: "bg-green-50 border-green-200",
      badgeText: "text-green-700",
      heading: "Your Claim Looks Strong",
      body: `${recap} It looks like you have a potential claim. Find out what you could be owed by speaking to our personal injury specialists today.`,
    };
  }

  if (result === "possible") {
    return {
      label: "Possible Claim",
      badgeBg: "bg-amber-50 border-amber-200",
      badgeText: "text-amber-700",
      heading: "There's a Claim Here Worth Looking At",
      body: `${recap} That's the kind of situation that often turns into a claim worth pursuing.${faultNote(state)}${doctorNote(state)} Speak to our personal injury specialists today to see what you could be owed.`,
    };
  }

  if (state.when === "over-2-years") {
    return {
      label: "Time Limit Concern",
      badgeBg: "bg-[#0e7490]/8 border-[#0e7490]/20",
      badgeText: "text-[#0e7490]",
      heading: "Time Limits Are Working Against You",
      body: `${recap} The standard two-year window has likely passed, but there are exceptions. Speak to our personal injury specialist today.`,
    };
  }

  if (state.fault === "no-or-mine") {
    return {
      label: "Fault Needs a Closer Look",
      badgeBg: "bg-[#0e7490]/8 border-[#0e7490]/20",
      badgeText: "text-[#0e7490]",
      heading: "Fault Needs a Closer Look",
      body: `${recap} You mentioned fault might be shared. Partial fault doesn't kill a claim, it requires expert help.${doctorNote(state)} Speak to our personal injury specialists today.`,
    };
  }

  return {
    label: "Worth a Direct Conversation",
    badgeBg: "bg-[#0e7490]/8 border-[#0e7490]/20",
    badgeText: "text-[#0e7490]",
    heading: "Worth a Direct Conversation",
    body: `${recap} A few things in your situation need a real conversation with a personal injury expert.${faultNote(state)}${doctorNote(state)}`,
  };
}

export default function PersonalInjuryQuiz() {
  useSeoMeta(
    "Personal Injury Claim Assessment | Edward & Amaury Solicitors",
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
      setTimeout(() => {
        setPhase("result");
        setAnimating(false);
        try {
          window.gtag?.("event", "personal_injury_quiz_completed", { event_category: "lead" });
        } catch { /* ignore */ }
      }, 200);
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
    const gclid = params.get("gclid") ?? undefined;

    // Show the result straight away — it's already worked out on the visitor's
    // device. The save runs in the background and never blocks them.
    sessionStorage.setItem("ea_lead_firstname", firstName);
    setLocation("/personal-injury/thank-you", {
      state: { firstName, result, score: totalScore },
    });

    // Save the lead in the background.
    let recaptchaToken: string | undefined;
    try { recaptchaToken = await getToken("submit"); } catch { /* fail open */ }

    submitMutation.mutate({
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
    if (!quizState.accidentType || !quizState.when || !quizState.fault || !quizState.doctor || !quizState.impact) {
      setPhase("quiz");
      return null;
    }
    const result = getResultBand(quizState, totalScore);
    const content = buildPersonalContent(quizState, result);
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
                <span className={`inline-block border rounded-full px-3 py-1 text-xs font-semibold ${content.badgeBg} ${content.badgeText}`}>
                  Your Assessment: {content.label}
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
              data-testid="result-phone-pi"
              className="block w-full bg-[#0e7490] hover:bg-[#0a5a70] active:bg-[#084d60] text-white text-center rounded-2xl py-5 px-4 transition-colors shadow-sm"
            >
              <p className="text-xs font-medium text-white/80 mb-1">Want to discuss your claim now?</p>
              <p className="text-2xl sm:text-3xl font-bold tracking-tight">01228 272395</p>
              <p className="text-xs text-white/70 mt-1">Mon to Fri, 9am to 5pm</p>
            </a>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
              <h2 className="font-bold text-[#1a3a4a] text-lg mb-2">Would you like us to handle your case?</h2>
              <p className="text-gray-600 text-sm mb-5">
                Enter your details and a Carlisle solicitor will call you within 24 hours. No win no fee. Free consultation. No obligation.
              </p>
              <button
                data-testid="result-cta-pi-form"
                onClick={() => setPhase("form")}
                className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-4 rounded-lg text-base transition-colors shadow-md"
              >
                Request a Free Consultation →
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
              <p className="text-gray-600 mb-6">Enter your details and a Carlisle solicitor will call you within 24 hours.</p>
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
                  {submitMutation.isPending ? "Submitting..." : "Submit Request"}
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
