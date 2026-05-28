import { Router } from "express";
import { google } from "googleapis";
import { z } from "zod";
import { logger } from "../lib/logger";

const router = Router();

const InitSheetTabBody = z.object({
  tab: z.string().min(1).max(100),
  headers: z.array(z.string().min(1)).min(1).max(26),
});

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

  const parsed = InitSheetTabBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid body", details: parsed.error.issues });
    return;
  }

  const { tab, headers } = parsed.data;

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
