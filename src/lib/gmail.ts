import { google } from "googleapis";
import dotenv from "dotenv";

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

const gmail = google.gmail({ version: "v1", auth: oauth2Client });

// export async function searchEmails({
//   sender,
//   maxResults = 10,
//   query = "",
// }: {
//   sender?: string;
//   maxResults?: number;
//   query?: string;
// }) {
//   try {
//     const searchQuery = sender ? `from:${sender} ${query}`.trim() : query;

//     const listRes = await gmail.users.messages.list({
//       userId: "me",
//       maxResults,
//       q: searchQuery,
//     });

//     const messages = listRes.data.messages || [];

//     if (messages.length === 0) return [];

//     const emailData = await Promise.all(
//       messages.map(async (msg) => {
//         const detailRes = await gmail.users.messages.get({
//           userId: "me",
//           id: msg.id!,
//           format: "metadata",
//         });

//         const headers = detailRes.data.payload?.headers;

//         return {
//           id: msg.id,
//           threadId: msg.threadId,
//           subject:
//             headers?.find((h) => h.name === "Subject")?.value || "No Subject",
//           from:
//             headers?.find((h) => h.name === "From")?.value || "Unknown Sender",
//           date: headers?.find((h) => h.name === "Date")?.value || "",
//           snippet: detailRes.data.snippet,
//         };
//       }),
//     );

//     return emailData;
//   } catch (error) {
//     console.error("Unified Gmail API Error:", error);
//     throw error;
//   }
// }

export async function searchEmails({
  sender,
  maxResults = 10,
  query = "",
  unreadOnly = false,
  hasAttachments = false,
  newerThan, // e.g., '2d', '1m', '1y'
}: {
  sender?: string;
  maxResults?: number;
  query?: string;
  unreadOnly?: boolean;
  hasAttachments?: boolean;
  newerThan?: string;
}) {
  try {
    // 1. Build the dynamic Gmail search query
    let searchQuery = query;

    if (sender) searchQuery += ` from:${sender}`;
    if (unreadOnly) searchQuery += ` is:unread`;
    if (hasAttachments) searchQuery += ` has:attachment`;
    if (newerThan) searchQuery += ` newer_than:${newerThan}`;

    searchQuery = searchQuery.trim();

    // 2. Fetch the list of message IDs
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      q: searchQuery,
    });

    const messages = listRes.data.messages || [];
    if (messages.length === 0) return [];

    // 3. Fetch details for each message in parallel
    const emailData = await Promise.all(
      messages.map(async (msg) => {
        const detailRes = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata", // Fast: only gets headers/snippet
        });

        const headers = detailRes.data.payload?.headers;
        const labelIds = detailRes.data.labelIds || [];

        return {
          id: msg.id,
          threadId: msg.threadId,
          // Check if the message is actually unread by looking at labels
          isUnread: labelIds.includes("UNREAD"),
          subject:
            headers?.find((h) => h.name === "Subject")?.value || "No Subject",
          from:
            headers?.find((h) => h.name === "From")?.value || "Unknown Sender",
          date: headers?.find((h) => h.name === "Date")?.value || "",
          snippet: detailRes.data.snippet,
        };
      }),
    );

    return emailData;
  } catch (error) {
    console.error("Unified Gmail API Error:", error);
    throw error;
  }
}

export async function trashEmail(messageId: string) {
  try {
    const res = await gmail.users.messages.trash({
      userId: "me",
      id: messageId,
    });

    console.log(`Email ${messageId} moved to trash.`);
    return res.data;
  } catch (error) {
    console.error("Error trashing email:", error);
    throw error;
  }
}

export async function untrashEmail(messageId: string) {
  try {
    const res = await gmail.users.messages.untrash({
      userId: "me",
      id: messageId,
    });

    console.log(`Email ${messageId} restored from trash.`);
    return res.data;
  } catch (error) {
    console.error("Gmail Untrash Error:", error);
    throw error;
  }
}
