import { Resend } from "resend";
import { logger } from "./logger";

function getResend() {
  const apiKey = process.env["RESEND_API_KEY"];
  if (!apiKey) return null;
  return new Resend(apiKey);
}

const FROM = "Edward & Amaury Solicitors <onboarding@resend.dev>";

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const resend = getResend();
  if (!resend) {
    logger.info({ to: options.to }, "RESEND_API_KEY not set, skipping email");
    return;
  }

  try {
    const fromEmail = process.env["FROM_EMAIL"];
    const from = fromEmail
      ? `Edward & Amaury Solicitors <${fromEmail}>`
      : FROM;

    await resend.emails.send({ from, to: options.to, ...options });
    logger.info({ to: options.to }, "Email sent via Resend");
  } catch (err) {
    logger.error({ err }, "Failed to send email via Resend");
  }
}

export async function sendNotification(subject: string, html: string): Promise<void> {
  const notificationEmail = process.env["NOTIFICATION_EMAIL"];
  if (!notificationEmail) {
    logger.info("NOTIFICATION_EMAIL not set, skipping notification");
    return;
  }
  const recipients = notificationEmail.split(",").map(e => e.trim()).filter(Boolean);
  await Promise.all(recipients.map(to => sendEmail({ to, subject, html })));
}
