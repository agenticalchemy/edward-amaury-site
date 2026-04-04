import { google } from "googleapis";

const creds = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
const sheetId = process.env.GOOGLE_SHEET_ID;

const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const r = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
console.log("Spreadsheet title:", r.data.properties.title);
console.log("Tabs:");
r.data.sheets.forEach(s => {
  console.log(" -", JSON.stringify(s.properties.title));
});
