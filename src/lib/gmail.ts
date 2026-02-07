import { gmail_v1, google } from "googleapis";
import dotenv from "dotenv";
import MailComposer from "nodemailer/lib/mail-composer";

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

export async function createDraft(to: string, subject: string, body: string) {
  try {
    // 1. Compose the email
    const mail = new MailComposer({
      to,
      subject,
      text: body, // Use 'html' instead of 'text' if you want to send formatted HTML
      from: "me",
    });

    // 2. Compile it to a Buffer
    const message = await mail.compile().build();

    // 3. Encode to Base64URL (Google requirement: replace +, / and remove =)
    const raw = message
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // 4. Create the draft in Gmail
    const res = await gmail.users.drafts.create({
      userId: "me",
      requestBody: {
        message: {
          raw: raw,
        },
      },
    });

    return res.data;
  } catch (error) {
    console.error("Gmail Draft Creation Error:", error);
    throw error;
  }
}

export async function deleteDraft(draftId: string) {
  try {
    await gmail.users.drafts.delete({
      userId: "me",
      id: draftId,
    });

    console.log(`Draft ${draftId} deleted successfully.`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting draft:", error);
    throw error;
  }
}

export async function listDrafts(maxResults = 10) {
  try {
    const listRes = await gmail.users.drafts.list({
      userId: "me",
      maxResults: maxResults,
    });

    const drafts = listRes.data.drafts || [];

    // Fetch full details for each draft to get headers (Subject, To, etc.)
    const draftData = await Promise.all(
      drafts.map(async (d) => {
        const detailRes = await gmail.users.drafts.get({
          userId: "me",
          id: d.id!,
        });

        const headers = detailRes.data.message?.payload?.headers;

        return {
          draftId: d.id,
          threadId: d.message?.threadId,
          subject:
            headers?.find((h) => h.name === "Subject")?.value || "No Subject",
          to: headers?.find((h) => h.name === "To")?.value || "No Recipient",
          date: headers?.find((h) => h.name === "Date")?.value,
          snippet: detailRes.data.message?.snippet,
        };
      }),
    );

    return draftData;
  } catch (error) {
    console.error("Gmail List Drafts Error:", error);
    throw error;
  }
}

export async function getDraft(draftId: string) {
  try {
    const res = await gmail.users.drafts.get({
      userId: "me",
      id: draftId,
    });

    const message = res.data.message;
    const headers = message?.payload?.headers;

    // Extract headers
    const subject = headers?.find((h) => h.name === "Subject")?.value;
    const to = headers?.find((h) => h.name === "To")?.value;

    // Extract and decode the body
    let body = "";
    const extractBody = (part: gmail_v1.Schema$MessagePart) => {
      if (part.body?.data) {
        body += Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      if (part.parts) {
        part.parts.forEach(extractBody);
      }
    };

    if (message?.payload) {
      extractBody(message.payload);
    }

    return {
      draftId: res.data.id,
      subject,
      to,
      body,
      rawResponse: res.data, // Useful for debugging
    };
  } catch (error) {
    console.error("Error fetching draft:", error);
    throw error;
  }
}

export async function sendDraft(draftId: string) {
  try {
    const res = await gmail.users.drafts.send({
      userId: "me",
      requestBody: {
        id: draftId,
      },
    });

    console.log(
      `Draft ${draftId} sent successfully! Message ID: ${res.data.id}`,
    );
    return res.data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Error sending draft:", errorMessage);
    throw error;
  }
}

export async function sendEmail(to: string, subject: string, body: string) {
  try {
    const mail = new MailComposer({
      to,
      subject,
      text: body,
      from: "me",
    });

    const message = await mail.compile().build();

    const raw = message
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: raw,
      },
    });

    return res.data;
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Gmail Send Error:", errorMessage);
    throw error;
  }
}

export async function modifyEmailLabels(
  messageId: string,
  addLabelIds: string[] = [],
  removeLabelIds: string[] = [],
) {
  try {
    const res = await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        addLabelIds: addLabelIds,
        removeLabelIds: removeLabelIds,
      },
    });
    return res.data;
  } catch (error) {
    console.error(
      "Gmail Label Error:",
      error instanceof Error && error.message,
    );
    throw error;
  }
}
