import { Router } from "express";
import { appendToSheet } from "../lib/sheets";
import { sendEmail, sendNotification } from "../lib/mailer";
import { verifyRecaptcha } from "../lib/recaptcha";
import { SubmitWillsLeadBody, SubmitVisaLeadBody, SubmitWillWritingLeadBody } from "@workspace/api-zod";

const router = Router();

router.post("/leads/wills", async (req, res) => {
  const parsed = SubmitWillsLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const data = parsed.data;

  if (data.honeypot) {
    res.json({ success: true, message: "Lead submitted successfully" });
    return;
  }

  const recaptchaOk = await verifyRecaptcha(data.recaptchaToken);
  if (!recaptchaOk) {
    res.json({ success: true, message: "Lead submitted successfully" });
    return;
  }

  const timestamp = new Date().toISOString();
  const answersFlat = Object.entries(data.answers)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");

  await appendToSheet("Wills-probates", [
    timestamp,
    data.name,
    data.email,
    data.phone,
    data.route,
    answersFlat,
    data.gclid ?? "",
    data.utmSource ?? "",
    data.utmCampaign ?? "",
    data.utmMedium ?? "",
    data.utmTerm ?? "",
    data.utmContent ?? "",
    data.referrer ?? "",
  ]);

  const firstName = data.name.split(" ")[0];

  await sendNotification(
    `New Wills & Probate Lead — ${data.name}`,
    `
    <h2>New Lead: ${data.name}</h2>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Route:</strong> ${data.route}</p>
    <p><strong>Answers:</strong><br>${answersFlat.replace(/ \| /g, "<br>")}</p>
    <p><strong>UTM Source:</strong> ${data.utmSource ?? "direct"}</p>
    <p><strong>UTM Campaign:</strong> ${data.utmCampaign ?? "—"}</p>
    <p><strong>Referrer:</strong> ${data.referrer ?? "—"}</p>
    <p><strong>GCLID:</strong> ${data.gclid ?? "—"}</p>
    `
  );

  await sendEmail({
    to: data.email,
    subject: "We've received your enquiry — Edward & Amaury Solicitors",
    html: `
    <p>Dear ${firstName},</p>
    <p>Thank you for reaching out to Edward &amp; Amaury Solicitors. We have received your enquiry and a member of our team will contact you within 24 hours.</p>
    <p>If you need to speak to us sooner, please call us on <strong>01228 272395</strong>.</p>
    <p>Kind regards,<br>Edward &amp; Amaury Solicitors<br>Carlisle, Cumbria</p>
    `,
  });

  res.json({ success: true, message: "Lead submitted successfully" });
});

router.post("/leads/visa", async (req, res) => {
  const parsed = SubmitVisaLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const data = parsed.data;

  if (data.honeypot) {
    res.json({ success: true, message: "Lead submitted successfully" });
    return;
  }

  const recaptchaOk = await verifyRecaptcha(data.recaptchaToken);
  if (!recaptchaOk) {
    res.json({ success: true, message: "Lead submitted successfully" });
    return;
  }

  const timestamp = new Date().toISOString();
  const answersFlat = Object.entries(data.answers)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");

  await appendToSheet("Visa Leads", [
    timestamp,
    data.fullName,
    data.email,
    data.phone,
    data.partnerNationality,
    String(data.score),
    data.result,
    answersFlat,
    data.gclid ?? "",
    data.utmSource ?? "",
    data.utmCampaign ?? "",
    data.utmMedium ?? "",
    data.utmTerm ?? "",
    data.utmContent ?? "",
    data.referrer ?? "",
  ]);

  const firstName = data.fullName.split(" ")[0];

  await sendNotification(
    `New Spouse Visa Lead — ${data.fullName} (Score: ${data.score}, ${data.result})`,
    `
    <h2>New Lead: ${data.fullName}</h2>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Partner Nationality:</strong> ${data.partnerNationality}</p>
    <p><strong>Score:</strong> ${data.score} / 21 (${data.result})</p>
    <p><strong>Answers:</strong><br>${answersFlat.replace(/ \| /g, "<br>")}</p>
    <p><strong>UTM Source:</strong> ${data.utmSource ?? "direct"}</p>
    <p><strong>UTM Campaign:</strong> ${data.utmCampaign ?? "—"}</p>
    <p><strong>Referrer:</strong> ${data.referrer ?? "—"}</p>
    <p><strong>GCLID:</strong> ${data.gclid ?? "—"}</p>
    `
  );

  await sendEmail({
    to: data.email,
    subject: "We've received your visa enquiry — Edward & Amaury Solicitors",
    html: `
    <p>Dear ${firstName},</p>
    <p>Thank you for completing our UK Spouse Visa assessment with Edward &amp; Amaury Solicitors. A member of our specialist immigration team will contact you within 24 hours to discuss your results and next steps.</p>
    <p>If you need to speak to us sooner, please call us on <strong>01228 272395</strong>.</p>
    <p>Kind regards,<br>Edward &amp; Amaury Solicitors<br>Specialist Immigration Team, Carlisle</p>
    `,
  });

  res.json({ success: true, message: "Lead submitted successfully" });
});

router.post("/leads/will-writing", async (req, res) => {
  const parsed = SubmitWillWritingLeadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const data = parsed.data;

  if (data.honeypot) {
    res.json({ success: true, message: "Lead submitted successfully" });
    return;
  }

  const recaptchaOk = await verifyRecaptcha(data.recaptchaToken);
  if (!recaptchaOk) {
    res.json({ success: true, message: "Lead submitted successfully" });
    return;
  }

  const timestamp = new Date().toISOString();
  const answersFlat = Object.entries(data.answers)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" | ");

  await appendToSheet("Will Writing", [
    timestamp,
    data.name,
    data.email,
    data.phone,
    data.route,
    answersFlat,
    data.gclid ?? "",
    data.utmSource ?? "",
    data.utmCampaign ?? "",
    data.utmMedium ?? "",
    data.utmTerm ?? "",
    data.utmContent ?? "",
    data.referrer ?? "",
  ]);

  const firstName = data.name.split(" ")[0];

  await sendNotification(
    `New Will Writing Lead — ${data.name} (${data.route})`,
    `
    <h2>New Lead: ${data.name}</h2>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Route:</strong> ${data.route}</p>
    <p><strong>Answers:</strong><br>${answersFlat.replace(/ \| /g, "<br>")}</p>
    <p><strong>UTM Source:</strong> ${data.utmSource ?? "direct"}</p>
    <p><strong>UTM Campaign:</strong> ${data.utmCampaign ?? "—"}</p>
    <p><strong>Referrer:</strong> ${data.referrer ?? "—"}</p>
    <p><strong>GCLID:</strong> ${data.gclid ?? "—"}</p>
    `
  );

  await sendEmail({
    to: data.email,
    subject: "We've received your enquiry — Edward & Amaury Solicitors",
    html: `
    <p>Dear ${firstName},</p>
    <p>Thank you for completing our will writing check with Edward &amp; Amaury Solicitors. A member of our team will contact you within 24 hours to discuss your results and next steps.</p>
    <p>If you need to speak to us sooner, please call us on <strong>01228 272395</strong>.</p>
    <p>Kind regards,<br>Edward &amp; Amaury Solicitors<br>Carlisle, Cumbria</p>
    `,
  });

  res.json({ success: true, message: "Lead submitted successfully" });
});

export default router;
