import { useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { fireFunnelEvent, getUtmParams, setEnhancedConversionData } from "@/lib/tracking";
import { useAdHeadline } from "@/hooks/useAdHeadline";
import { useRecaptcha } from "@/hooks/useRecaptcha";
import { useSeoMeta } from "@/hooks/useSeoMeta";

type StepKind = "buttons" | "text" | "short" | "name" | "phone" | "email";

interface ChatStep {
  key: string;
  label: string;
  prompt: string;
  kind: StepKind;
  options?: string[];
  other?: boolean;
  placeholder?: string;
  when?: (answers: Record<string, string>) => boolean;
}

const OTHER = "Something else";

export const chatSteps: ChatStep[] = [
  {
    key: "enquiry",
    label: "About the enquiry",
    prompt: "In a few sentences, what would you like help with?",
    kind: "text",
    placeholder: "For example: I want my husband to join me in the UK",
  },
  {
    key: "status",
    label: "Current immigration status",
    prompt: "What is your current immigration status?",
    kind: "buttons",
    options: [
      "British citizen",
      "Settled status or indefinite leave to remain",
      "On a UK visa at the moment",
      "Living outside the UK",
      "Not sure",
    ],
    other: true,
  },
  {
    key: "years_in_uk",
    label: "How long lived in the UK",
    prompt: "How long have you lived in the UK?",
    kind: "buttons",
    options: ["I don't live in the UK", "Less than 1 year", "1 to 5 years", "More than 5 years", "All my life"],
  },
  {
    key: "country",
    label: "Country originally from",
    prompt: "Which country are you originally from?",
    kind: "short",
    placeholder: "Country",
    when: (a) => a.years_in_uk !== "All my life",
  },
  {
    key: "deadline",
    label: "Any deadlines",
    prompt: "Is there a deadline we need to know about, such as a visa running out?",
    kind: "buttons",
    options: ["Yes", "No", "Not sure"],
  },
  {
    key: "deadline_detail",
    label: "Deadline details",
    prompt: "What is the deadline, and when is it?",
    kind: "short",
    placeholder: "For example: visa expires 3 March",
    when: (a) => a.deadline === "Yes",
  },
  {
    key: "married",
    label: "Married",
    prompt: "Are you married?",
    kind: "buttons",
    options: ["Yes, married", "Civil partnership", "Engaged", "Not married, but living together", "Not married"],
  },
  {
    key: "dependents",
    label: "Any dependents",
    prompt: "Do you have any dependents, such as children?",
    kind: "buttons",
    options: ["Yes", "No"],
  },
  {
    key: "dependents_detail",
    label: "Dependents details",
    prompt: "How many, and how old are they?",
    kind: "short",
    placeholder: "For example: 2 children, aged 4 and 7",
    when: (a) => a.dependents === "Yes",
  },
  {
    key: "income",
    label: "Annual income before tax",
    prompt: "What is your current annual income (before tax)?",
    kind: "buttons",
    options: [
      "£29,000 or more",
      "Between £23,500 and £28,999",
      "Below £23,500",
      "I am self-employed",
      "I am not currently working",
    ],
  },
  {
    key: "legal_aid",
    label: "Requiring legal aid",
    prompt: "Will you be looking for legal aid to help pay for this?",
    kind: "buttons",
    options: ["Yes", "No", "Not sure"],
  },
  { key: "name", label: "Name", prompt: "Nearly done. What's your full name?", kind: "name", placeholder: "Full name" },
  { key: "phone", label: "Phone", prompt: "What's the best phone number to reach you on?", kind: "phone", placeholder: "Phone number" },
  { key: "email", label: "Email", prompt: "And your email address?", kind: "email", placeholder: "Email address" },
];

function visibleSteps(answers: Record<string, string>) {
  return chatSteps.filter((s) => !s.when || s.when(answers));
}

function validate(step: ChatStep, value: string): string | null {
  const v = value.trim();
  if (!v) return "Please type an answer.";
  if (step.kind === "phone" && v.replace(/\D/g, "").length < 10) return "Please enter a full phone number.";
  if (step.kind === "email" && !/^\S+@\S+\.\S+$/.test(v)) return "Please enter a valid email address.";
  return null;
}

function Bubble({ from, children }: { from: "bot" | "me"; children: React.ReactNode }) {
  return (
    <div className={`flex ${from === "me" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-line ${
          from === "me" ? "bg-[#0e7490] text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

export default function VisaChat() {
  useSeoMeta(
    "UK Spouse Visa Enquiry — Edward & Amaury Solicitors",
    "Tell us about your UK spouse visa enquiry and our immigration team will call you within 24 hours. Immigration solicitors in Carlisle, Cumbria."
  );
  const [, setLocation] = useLocation();
  const adHeadline = useAdHeadline("");
  const { getToken } = useRecaptcha();

  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [order, setOrder] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [typingOther, setTypingOther] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const steps = visibleSteps(answers);
  const current = steps.find((s) => !(s.key in answers));

  useEffect(() => {
    fireFunnelEvent("visa_chat_viewed");
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [order.length, started, typingOther]);

  const submit = async (final: Record<string, string>) => {
    setSubmitting(true);
    const utmParams = getUtmParams();
    const asked = visibleSteps(final).filter((s) => !["name", "phone", "email"].includes(s.key));
    const firstName = final.name.trim().split(" ")[0];

    setEnhancedConversionData(final.email.trim(), final.phone.trim());
    try { window.dataLayer?.push({ event: "funnel_leads_all", lead_type: "spouse_visa" }); } catch { /* ignore */ }
    sessionStorage.setItem("ea_lead_firstname", firstName);

    let recaptchaToken: string | undefined;
    try { recaptchaToken = await getToken("submit"); } catch { /* fail open */ }

    fetch("/api/leads/visa-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({
        fullName: final.name.trim(),
        email: final.email.trim(),
        phone: final.phone.trim(),
        countryOfOrigin: final.country,
        answers: asked.map((s) => ({ label: s.label, value: final[s.key] })),
        recaptchaToken,
        gclid: utmParams["gclid"],
        utmSource: utmParams["utm_source"],
        utmCampaign: utmParams["utm_campaign"],
        utmMedium: utmParams["utm_medium"],
        utmTerm: utmParams["utm_term"],
        utmContent: utmParams["utm_content"],
        referrer: document.referrer || undefined,
      }),
    }).catch(() => { /* ignore */ });

    setLocation("/uk-spouse-visa/thank-you", { state: { firstName, source: "chat" } });
  };

  const answer = (step: ChatStep, value: string) => {
    if (submitting) return;
    const problem = validate(step, value);
    if (problem) { setError(problem); return; }
    setError(null);
    const next = { ...answers, [step.key]: value.trim() };
    setAnswers(next);
    setOrder([...order, step.key]);
    setDraft("");
    setTypingOther(false);
    fireFunnelEvent(`visa_chat_step_${order.length + 1}`, { question_id: step.key });
    if (!visibleSteps(next).some((s) => !(s.key in next))) submit(next);
  };

  const goBack = () => {
    if (!order.length || submitting) return;
    const last = order[order.length - 1];
    const next = { ...answers };
    delete next[last];
    setAnswers(next);
    setOrder(order.slice(0, -1));
    setDraft("");
    setTypingOther(false);
    setError(null);
  };

  const stepByKey = (k: string) => chatSteps.find((s) => s.key === k)!;
  const showTextBox = current && (current.kind !== "buttons" || typingOther);
  const singleLine = current && ["short", "name", "phone", "email"].includes(current.kind);

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <div className="flex-1 bg-gray-50 py-6 px-4">
        <div className="max-w-lg mx-auto">
          {adHeadline && (
            <div className="bg-[#0e7490]/10 border border-[#0e7490]/20 rounded-lg px-4 py-2 mb-4 text-sm text-[#0e7490] font-medium text-center">
              {adHeadline}
            </div>
          )}

          <div className="bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-[#1a3a4a] text-white px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#0e7490] flex items-center justify-center text-sm font-bold">E&A</div>
              <div>
                <p className="font-semibold text-sm">Edward &amp; Amaury Solicitors</p>
                <p className="text-xs text-gray-300">Online agent</p>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <Bubble from="bot">
                Hello. I'm an online agent for Edward &amp; Amaury Solicitors, and I'm ready to help you with your enquiry.
                {"\n\n"}I'll ask you a few short questions about your spouse visa enquiry. Our immigration team will then call you within 24 hours. It takes about 3 minutes.
              </Bubble>

              {!started ? (
                <div className="pt-1">
                  <button
                    data-testid="visa-chat-start"
                    onClick={() => { setStarted(true); fireFunnelEvent("visa_chat_started"); }}
                    className="w-full bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold py-4 rounded-xl text-base transition-colors"
                  >
                    Let's start
                  </button>
                </div>
              ) : (
                <>
                  {order.map((k) => (
                    <div key={k} className="space-y-3">
                      <Bubble from="bot">{stepByKey(k).prompt}</Bubble>
                      <Bubble from="me">{answers[k]}</Bubble>
                    </div>
                  ))}

                  {current && <Bubble from="bot">{current.prompt}</Bubble>}

                  {current && current.kind === "buttons" && !typingOther && (
                    <div className="space-y-2 pt-1">
                      {current.options!.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => answer(current, opt)}
                          className="w-full text-left bg-white border-2 border-gray-200 hover:border-[#0e7490] rounded-xl px-4 py-3 text-gray-800 font-medium transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                      {current.other && (
                        <button
                          onClick={() => setTypingOther(true)}
                          className="w-full text-left bg-white border-2 border-gray-200 hover:border-[#0e7490] rounded-xl px-4 py-3 text-gray-800 font-medium transition-colors"
                        >
                          {OTHER}
                        </button>
                      )}
                    </div>
                  )}

                  {showTextBox && (
                    <form
                      onSubmit={(e) => { e.preventDefault(); answer(current!, draft); }}
                      className="flex gap-2 items-end pt-1"
                    >
                      {singleLine ? (
                        <input
                          autoFocus
                          type={current!.kind === "email" ? "email" : current!.kind === "phone" ? "tel" : "text"}
                          autoComplete={current!.kind === "name" ? "name" : current!.kind === "phone" ? "tel" : current!.kind === "email" ? "email" : "off"}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder={current!.placeholder ?? "Type your answer"}
                          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 bg-white focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
                        />
                      ) : (
                        <textarea
                          autoFocus
                          rows={3}
                          value={draft}
                          onChange={(e) => setDraft(e.target.value)}
                          placeholder={current!.placeholder ?? "Type your answer"}
                          className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#0e7490]"
                        />
                      )}
                      <button
                        type="submit"
                        className="bg-[#0e7490] hover:bg-[#0a5a70] text-white font-bold px-5 py-3 rounded-xl transition-colors"
                      >
                        Send
                      </button>
                    </form>
                  )}

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  {submitting && <Bubble from="bot">Thank you. Sending your details to our immigration team now.</Bubble>}

                  {order.length > 0 && !submitting && (
                    <button onClick={goBack} className="text-sm text-gray-500 hover:text-gray-700">
                      ← Change my last answer
                    </button>
                  )}
                </>
              )}
              <div ref={endRef} />
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">Your details are confidential.</p>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
