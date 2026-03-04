import { google } from "googleapis";
import type { RegistrationData } from "./validations";

function getAuth() {
  const privateKey = process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendRegistration(data: RegistrationData) {
  const auth = getAuth();
  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

  const timestamp = new Date().toISOString();

  const row = [
    timestamp,
    data.childName,
    data.childAge,
    data.parentName,
    data.parentEmail,
    data.parentPhone,
    data.swimExperience,
    data.hasSpecialNeeds ? "Yes" : "No",
    data.specialNeedsDetails || "",
    data.sessionPreference || "",
    data.photoConsent ? "Yes" : "No",
    data.liabilityWaiver ? "Yes" : "No",
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:L",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [row],
    },
  });
}
