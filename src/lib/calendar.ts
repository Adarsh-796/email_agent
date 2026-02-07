import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config({ quiet: true });

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN } =
  process.env;

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
  refresh_token: GOOGLE_REFRESH_TOKEN,
});

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

export async function createCalendarEvent(
  summary: string,
  description: string,
  startTime: string, // ISO string: "2026-02-10T10:00:00Z"
  endTime: string,
  attendeeEmails: string[],
) {
  try {
    const res = await calendar.events.insert({
      calendarId: "primary",
      sendUpdates: "all", // This triggers the email notification
      requestBody: {
        summary: summary,
        description: description,
        start: {
          dateTime: startTime,
          timeZone: "UTC", // Or your local timezone
        },
        end: {
          dateTime: endTime,
          timeZone: "UTC",
        },
        attendees: attendeeEmails.map((email) => ({ email })),
        // Optional: Add a Google Meet link automatically
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: { type: "hangoutsMeet" },
          },
        },
      },
      conferenceDataVersion: 1,
    });

    return res.data;
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Calendar Error:", msg);
    throw error;
  }
}

export async function listCalendarEvents(maxResults: number = 10) {
  const calendar = google.calendar({ version: "v3", auth: oauth2Client });

  try {
    const res = await calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(), // Only fetch events from this moment onwards
      maxResults: maxResults,
      singleEvents: true, // Expands recurring events into individual instances
      orderBy: "startTime",
    });

    return res.data.items || [];
  } catch (error) {
    console.error(
      "Error fetching events:",
      error instanceof Error && error.message,
    );
    throw error;
  }
}
