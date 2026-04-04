import { google } from "googleapis";
import { logger } from "./logger";

function getAuth() {
  const creds = process.env["GOOGLE_SHEETS_CREDENTIALS"];
  if (!creds) return null;
  try {
    const parsed = JSON.parse(creds) as object;
    return new google.auth.GoogleAuth({
      credentials: parsed,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
  } catch {
    logger.warn("Failed to parse GOOGLE_SHEETS_CREDENTIALS");
    return null;
  }
}

export async function appendToSheet(tabName: string, values: (string | number | null)[]): Promise<void> {
  const sheetId = process.env["GOOGLE_SHEET_ID"];
  if (!sheetId) {
    logger.info("GOOGLE_SHEET_ID not set, skipping Sheets append");
    return;
  }

  const auth = getAuth();
  if (!auth) {
    logger.info("Google Sheets credentials not set, skipping Sheets append");
    return;
  }

  try {
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${tabName}!A1`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
    logger.info({ tabName }, "Appended lead to Google Sheet");
  } catch (err) {
    logger.error({ err }, "Failed to append to Google Sheet");
  }
}
