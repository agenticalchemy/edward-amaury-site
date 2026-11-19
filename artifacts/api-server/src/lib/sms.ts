import crypto from "node:crypto";

export function normaliseMobile(raw: string): string | null {
  const cleaned = raw.replace(/[^0-9+]/g, "");
  let n = cleaned;
  if (n.startsWith("00")) n = "+" + n.slice(2);
  if (n.startsWith("+44")) n = "0" + n.slice(3);
  if (/^07\d{9}$/.test(n)) return "+44" + n.slice(1);
  if (/^\+[1-9]\d{7,14}$/.test(n)) return n;
  return null;
}

function linkKey(): Buffer | null {
  const secret = process.env["LINK_SECRET"]?.trim();
  if (!secret) return null;
  return crypto.createHash("sha256").update(secret).digest();
}

export function makeLinkToken(phone: string): string | null {
  const key = linkKey();
  if (!key) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(phone, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), enc]).toString("base64url");
}

export function readLinkToken(token: string): string | null {
  const key = linkKey();
  if (!key || token.length > 300) return null;
  try {
    const buf = Buffer.from(token, "base64url");
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, buf.subarray(0, 12));
    decipher.setAuthTag(buf.subarray(12, 28));
    const dec = Buffer.concat([decipher.update(buf.subarray(28)), decipher.final()]).toString("utf8");
    return /^\+\d{8,15}$/.test(dec) ? dec : null;
  } catch {
    return null;
  }
}

export type SmsResult = { ok: true } | { ok: false; reason: string };

export async function sendSms(to: string, body: string): Promise<SmsResult> {
  const username = process.env["CLICKSEND_USERNAME"]?.trim();
  const apiKey = process.env["CLICKSEND_API_KEY"]?.trim();
  const from = process.env["SMS_SENDER"]?.trim() || "EandA";
  if (!username || !apiKey) return { ok: false, reason: "Text sending is not set up yet (no ClickSend login)." };

  try {
    const res = await fetch("https://rest.clicksend.com/v3/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + Buffer.from(`${username}:${apiKey}`).toString("base64"),
      },
      body: JSON.stringify({ messages: [{ source: "ea-call-link", from, to, body }] }),
    });
    const json = (await res.json().catch(() => null)) as
      | { response_code?: string; response_msg?: string; data?: { messages?: { status?: string }[] } }
      | null;
    const status = json?.data?.messages?.[0]?.status;
    if (res.ok && status === "SUCCESS") return { ok: true };
    if (json?.response_code === "INSUFFICIENT_CREDIT" || status === "INSUFFICIENT_CREDIT") {
      return { ok: false, reason: "The text account has run out of credit. Top up ClickSend." };
    }
    return { ok: false, reason: `ClickSend refused the text (${status ?? json?.response_code ?? res.status}).` };
  } catch {
    return { ok: false, reason: "Could not reach ClickSend. Try again in a minute." };
  }
}
