import { Router } from "express";
import { google } from "googleapis";
import { logger } from "../lib/logger";

const router = Router();

function validateInitBody(body: unknown): { tab: string; headers: string[] } | string {
  if (!body || typeof body !== "object") return "Body must be an object";
  const b = body as Record<string, unknown>;
  if (typeof b["tab"] !== "string" || b["tab"].trim().length === 0 || b["tab"].length > 100) {
    return "tab must be a non-empty string under 100 chars";
  }
  if (!Array.isArray(b["headers"]) || b["headers"].length < 1 || b["headers"].length > 26) {
    return "headers must be an array of 1-26 strings";
  }
  if (b["headers"].some((h: unknown) => typeof h !== "string" || h.length === 0)) {
    return "every header must be a non-empty string";
  }
  return { tab: b["tab"].trim(), headers: b["headers"] as string[] };
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function columnLetter(n: number): string {
  let s = "";
  while (n > 0) {
    const r = (n - 1) % 26;
    s = String.fromCharCode(65 + r) + s;
    n = Math.floor((n - 1) / 26);
  }
  return s;
}

router.post("/admin/init-sheet-tab", async (req, res) => {
  const adminToken = process.env["ADMIN_TOKEN"];
  if (!adminToken) {
    res.status(503).json({ error: "Admin endpoint not configured" });
    return;
  }

  const provided = req.header("x-admin-token") ?? "";
  if (!timingSafeEqual(provided, adminToken)) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const parsed = validateInitBody(req.body);
  if (typeof parsed === "string") {
    res.status(400).json({ error: parsed });
    return;
  }

  const { tab, headers } = parsed;

  const sheetId = process.env["GOOGLE_SHEET_ID"];
  const credsRaw = process.env["GOOGLE_SHEETS_CREDENTIALS"];
  if (!sheetId || !credsRaw) {
    res.status(503).json({ error: "Sheets not configured" });
    return;
  }

  let credentials: object;
  try {
    credentials = JSON.parse(credsRaw);
  } catch {
    res.status(503).json({ error: "Sheets credentials malformed" });
    return;
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const sheets = google.sheets({ version: "v4", auth });

  const range = `'${tab}'!A1:${columnLetter(headers.length)}1`;

  try {
    const existing = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    });

    const row = existing.data.values?.[0] ?? [];
    const nonEmpty = row.filter((c) => String(c ?? "").trim() !== "");

    if (nonEmpty.length > 0) {
      res.status(409).json({
        error: "Tab already has data in row 1, refusing to overwrite",
        existing: row,
      });
      return;
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [headers] },
    });

    logger.info({ tab, count: headers.length }, "Initialised sheet tab headers");
    res.json({ success: true, tab, headersWritten: headers.length });
  } catch (err) {
    logger.error({ err, tab }, "Failed to initialise sheet tab");
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: "Sheets API failure", message });
  }
});

export default router;
