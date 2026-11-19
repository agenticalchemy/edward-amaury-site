import { Router } from "express";
import crypto from "node:crypto";
import { makeLinkToken, normaliseMobile, readLinkToken, sendSms } from "../lib/sms";
import { logger } from "../lib/logger";

const router = Router();

const DEFAULT_TEXT =
  "Thanks for calling Edward & Amaury Solicitors. Please answer a few short questions about your enquiry here: {link}";

function pinOk(provided: string): boolean {
  const pin = process.env["STAFF_PIN"]?.trim();
  if (!pin) return false;
  const a = crypto.createHash("sha256").update(provided).digest();
  const b = crypto.createHash("sha256").update(pin).digest();
  return crypto.timingSafeEqual(a, b);
}

function siteUrl(req: { get(name: string): string | undefined; protocol: string }): string {
  const fixed = process.env["SITE_URL"]?.trim();
  if (fixed) return fixed.replace(/\/$/, "");
  const host = req.get("x-forwarded-host") ?? req.get("host");
  return `https://${host}`;
}

router.post("/team/check-pin", (req, res) => {
  if (!process.env["STAFF_PIN"]) {
    res.status(503).json({ error: "The staff PIN has not been set up yet." });
    return;
  }
  if (!pinOk(String(req.header("x-staff-pin") ?? ""))) {
    res.status(401).json({ error: "Wrong PIN." });
    return;
  }
  res.json({ ok: true });
});

router.post("/team/send-visa-link", async (req, res) => {
  if (!pinOk(String(req.header("x-staff-pin") ?? ""))) {
    res.status(401).json({ error: "Wrong PIN." });
    return;
  }

  const raw = typeof req.body?.phone === "string" ? req.body.phone : "";
  const to = normaliseMobile(raw);
  if (!to) {
    res.status(400).json({ error: "That doesn't look like a mobile number. UK mobiles start 07. Overseas numbers need the + and country code." });
    return;
  }

  const token = makeLinkToken(to);
  if (!token) {
    res.status(503).json({ error: "Link sending is not set up yet (no LINK_SECRET)." });
    return;
  }

  const link = `${siteUrl(req)}/uk-spouse-visa/quiz?c=${token}`;
  const template = process.env["SMS_LINK_TEXT"]?.trim() || DEFAULT_TEXT;
  const body = template.includes("{link}") ? template.replace("{link}", link) : `${template} ${link}`;

  const result = await sendSms(to, body);
  if (!result.ok) {
    logger.warn({ reason: result.reason }, "call link text failed");
    res.status(502).json({ error: result.reason });
    return;
  }

  res.json({ ok: true, to });
});

router.get("/team/link/:token", (req, res) => {
  const phone = readLinkToken(req.params.token);
  if (!phone) {
    res.status(404).json({ error: "Link not recognised" });
    return;
  }
  res.json({ phone });
});

export default router;
