import * as zod from "zod";

export const SubmitVisaChatLeadBody = zod.object({
  fullName: zod.string().min(1),
  email: zod.string().min(3),
  phone: zod.string().min(6),
  answers: zod.array(zod.object({ label: zod.string(), value: zod.string() })),
  countryOfOrigin: zod.string().optional(),
  recaptchaToken: zod.string().optional(),
  gclid: zod.string().optional(),
  utmSource: zod.string().optional(),
  utmCampaign: zod.string().optional(),
  utmMedium: zod.string().optional(),
  utmTerm: zod.string().optional(),
  utmContent: zod.string().optional(),
  referrer: zod.string().optional(),
});
