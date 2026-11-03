import { logger } from "./logger";

const ENDPOINT = "https://api.typesafe.ai/v1/systemone";
const MODEL = "jev-latest";
export const JEV_VERSION = "v2";
const TIMEOUT_MS = 4000;
const RETRY_STATUSES = new Set([429, 529]);

const BUSINESS =
  "Edward & Amaury Solicitors is a law firm in Carlisle, Cumbria. This enquiry came from its UK spouse visa page. The firm helps people apply for, extend and challenge refusals of UK spouse, partner and fiance visas. It does not do legal aid work.";

const QUESTIONS = {
  quality: {
    type: "score",
    instructions:
      "How likely this enquiry is to become a paid spouse or partner visa case for the law firm, judged mainly on what the person wrote in their own words",
    criteria: [
      "Spam, a test, a sales pitch, or not a real enquiry",
      "A one or two word message, a one-line price question, or no real situation described",
      "A real spouse or partner visa situation but few details, such as one short sentence",
      "A clear spouse or partner visa situation described in detail: who is applying, where they are now, and what they need help with or by when",
    ],
  },
  spam: {
    type: "noul",
    instructions: "This message is spam, a test, or someone selling their own services to the law firm",
  },
  not_spouse_visa: {
    type: "noul",
    instructions: "The enquiry is about a different kind of visa, not a UK spouse, partner or fiance visa",
  },
  home_office: {
    type: "noul",
    instructions: "The person is trying to contact the Home Office or UKVI, not looking for a solicitor",
  },
};

const RULES = {
  spam: 8.5,
  homeOffice: 7,
  notSpouseVisa: 8.5,
  gradeA: 7.5,
  gradeB: 4,
  shortestEnquiry: 10,
};

export type Grade = {
  grade: "A" | "B" | "C" | "Other" | "Spam";
  urgent: boolean;
  reason: string;
};

type Answer = { label: string; value: string };

const get = (answers: Answer[], label: string) => answers.find((a) => a.label === label)?.value ?? "";

function enquiryText(answers: Answer[]): string {
  return `In their own words: ${get(answers, "About the enquiry")}. Answers: immigration status ${get(answers, "Current immigration status")}; lived in the UK ${get(answers, "How long lived in the UK")}; deadline ${get(answers, "Any deadlines")}; married ${get(answers, "Married")}; dependents ${get(answers, "Any dependents")}.`;
}

async function ask(key: string, state: unknown) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    const r = await fetch(ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ state, model: MODEL, questions: QUESTIONS }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (RETRY_STATUSES.has(r.status) && attempt < 2) {
      await new Promise((res) => setTimeout(res, 500));
      continue;
    }
    if (!r.ok) throw new Error(`Jev answered HTTP ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return ((await r.json()) as { answers: any }).answers;
  }
}

export async function gradeVisaLead(answers: Answer[]): Promise<Grade | null> {
  const urgent = get(answers, "Any deadlines") === "Yes";
  if (get(answers, "About the enquiry").trim().length < RULES.shortestEnquiry) {
    return { grade: "C", urgent, reason: "Very short message" };
  }
  const key = process.env.TYPESAFE_API_KEY?.trim();
  if (!key) return null;
  try {
    const a = await ask(key, { business: BUSINESS, enquiry: enquiryText(answers) });
    const q = (a.quality.score * 10) / 3;
    if (a.spam.noul * 10 >= RULES.spam) return { grade: "Spam", urgent: false, reason: "Spam or test" };
    if (a.home_office.noul * 10 >= RULES.homeOffice) return { grade: "Other", urgent, reason: "Trying to contact the Home Office" };
    if (a.not_spouse_visa.noul * 10 >= RULES.notSpouseVisa) return { grade: "Other", urgent, reason: "Not a spouse visa enquiry" };
    if (get(answers, "Requiring legal aid") === "Yes") return { grade: "C", urgent, reason: "Wants legal aid" };
    if (get(answers, "Married") === "Not married") return { grade: "C", urgent, reason: "Not married or living together" };
    if (q >= RULES.gradeA) return { grade: "A", urgent, reason: "Clear case" };
    if (q >= RULES.gradeB) return { grade: "B", urgent, reason: "Real case, few details" };
    return { grade: "C", urgent, reason: "Vague message" };
  } catch (error) {
    logger.error({ err: error }, "Jev could not grade visa lead");
    return null;
  }
}
