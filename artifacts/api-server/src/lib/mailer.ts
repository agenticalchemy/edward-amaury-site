import nodemailer from "nodemailer";
import { logger } from "./logger";

function getTransporter() {
  const host = process.env["SMTP_HOST"];
  const port = parseInt(process.env["SMTP_PORT"] ?? "587", 10);
  const user = process.env["SMTP_USER"];
  const pass = process.env["SMTP_PASS"];

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const transporter = getTransporter();
  const fromEmail = process.env["FROM_EMAIL"] ?? "noreply@edwardamaury.co.uk";

  if (!transporter) {
    logger.info({ to: options.to }, "SMTP not configured, skipping email");
    return;
  }

  try {
    await transporter.sendMail({
      from: `Edward & Amaury Solicitors <${fromEmail}>`,
      ...options,
    });
    logger.info({ to: options.to }, "Email sent");
  } catch (err) {
    logger.error({ err }, "Failed to send email");
  }
}

export async function sendNotification(subject: string, html: string): Promise<void> {
  const notificationEmail = process.env["NOTIFICATION_EMAIL"];
  if (!notificationEmail) {
    logger.info("NOTIFICATION_EMAIL not set, skipping notification");
    return;
  }
  await sendEmail({ to: notificationEmail, subject, html });
}
