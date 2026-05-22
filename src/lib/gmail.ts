import { gmail_v1, google } from "googleapis";
import dotenv from "dotenv";
import MailComposer from "nodemailer/lib/mail-composer";
import { modifyEmailLabelsOptions, SendEmailOptions } from "./types";

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

export async function fetchEmails({
  maxResults = 10,
  pageToken,
}: {
  maxResults?: number;
  pageToken?: string;
}) {
  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      pageToken,
      q: "in:inbox",
    });

    const messages = listRes.data.messages || [];
    const nextPageToken = listRes.data.nextPageToken || undefined;

    if (messages.length === 0) {
      return { emails: [], nextPageToken };
    }

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const detailRes = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
        });

        const headers = detailRes.data.payload?.headers;
        const labelIds = detailRes.data.labelIds || [];

        return {
          id: msg.id,
          threadId: msg.threadId,
          isUnread: labelIds.includes("UNREAD"),
          isStarred: labelIds.includes("STARRED"),
          subject:
            headers?.find((h) => h.name === "Subject")?.value || "No Subject",
          from:
            headers?.find((h) => h.name === "From")?.value || "Unknown Sender",
          date: headers?.find((h) => h.name === "Date")?.value || "",
          snippet: detailRes.data.snippet,
        };
      }),
    );

    return { emails, nextPageToken };
  } catch (error) {
    console.error("Gmail Fetch Error:", error);
    throw error;
  }
}

export async function fetchEmailById(messageId: string) {
  try {
    const res = await gmail.users.messages.get({
      userId: "me",
      id: messageId,
      format: "full", // "full" returns the parsed message payload
    });

    const payload = res.data.payload;
    const headers = payload?.headers;
    const labelIds = res.data.labelIds || [];

    const extractBody = (
      part: gmail_v1.Schema$MessagePart,
    ): { text: string; html: string } => {
      let text = "";
      let html = "";

      if (part.mimeType === "text/plain" && part.body?.data) {
        text += Buffer.from(part.body.data, "base64").toString("utf-8");
      } else if (part.mimeType === "text/html" && part.body?.data) {
        html += Buffer.from(part.body.data, "base64").toString("utf-8");
      }

      if (part.parts) {
        for (const subPart of part.parts) {
          const { text: subText, html: subHtml } = extractBody(subPart);
          text += subText;
          html += subHtml;
        }
      }

      return { text, html };
    };

    const bodyContent = payload ? extractBody(payload) : { text: "", html: "" };

    return {
      id: res.data.id,
      threadId: res.data.threadId,
      labelIds,
      isUnread: labelIds.includes("UNREAD"),
      isStarred: labelIds.includes("STARRED"),
      subject:
        headers?.find((h) => h.name === "Subject")?.value || "No Subject",
      from: headers?.find((h) => h.name === "From")?.value || "Unknown Sender",
      to: headers?.find((h) => h.name === "To")?.value || "",
      date: headers?.find((h) => h.name === "Date")?.value || "",
      snippet: res.data.snippet,
      bodyText: bodyContent.text,
      bodyHtml: bodyContent.html,
      attachments:
        payload?.parts
          ?.filter((part) => part.filename && part.filename.length > 0)
          .map((part) => ({
            filename: part.filename,
            mimeType: part.mimeType,
            attachmentId: part.body?.attachmentId,
            size: part.body?.size,
          })) || [],
    };
  } catch (error) {
    console.error(`Error fetching email ${messageId}:`, error);
    throw error;
  }
}

export async function fetchStarredEmails({
  maxResults = 10,
  pageToken,
}: {
  maxResults?: number;
  pageToken?: string;
}) {
  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      pageToken,
      q: "is:starred",
    });

    const messages = listRes.data.messages || [];
    const nextPageToken = listRes.data.nextPageToken || undefined;

    if (messages.length === 0) {
      return { emails: [], nextPageToken };
    }

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const detailRes = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
        });

        const headers = detailRes.data.payload?.headers;
        const labelIds = detailRes.data.labelIds || [];

        return {
          id: msg.id,
          threadId: msg.threadId,
          isUnread: labelIds.includes("UNREAD"),
          isStarred: labelIds.includes("STARRED"),
          subject:
            headers?.find((h) => h.name === "Subject")?.value || "No Subject",
          from:
            headers?.find((h) => h.name === "From")?.value || "Unknown Sender",
          date: headers?.find((h) => h.name === "Date")?.value || "",
          snippet: detailRes.data.snippet,
        };
      }),
    );

    return { emails, nextPageToken };
  } catch (error) {
    console.error("Gmail Starred Fetch Error:", error);
    throw error;
  }
}

export async function fetchDraftEmails({
  maxResults = 10,
  pageToken,
}: {
  maxResults?: number;
  pageToken?: string;
}) {
  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      pageToken,
      q: "in:drafts",
    });

    const messages = listRes.data.messages || [];
    const nextPageToken = listRes.data.nextPageToken || undefined;

    if (messages.length === 0) {
      return { emails: [], nextPageToken };
    }

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const detailRes = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
        });

        const headers = detailRes.data.payload?.headers;
        const labelIds = detailRes.data.labelIds || [];

        return {
          id: msg.id,
          threadId: msg.threadId,
          isUnread: labelIds.includes("UNREAD"),
          isStarred: labelIds.includes("STARRED"),
          subject:
            headers?.find((h) => h.name === "Subject")?.value || "(No Subject)",
          from:
            headers?.find((h) => h.name === "From")?.value || "Unknown Sender",
          to: headers?.find((h) => h.name === "To")?.value || "",
          date: headers?.find((h) => h.name === "Date")?.value || "",
          snippet: detailRes.data.snippet,
        };
      }),
    );

    return { emails, nextPageToken };
  } catch (error) {
    console.error("Gmail Draft Fetch Error:", error);
    throw error;
  }
}

export async function fetchSpamEmails({
  maxResults = 10,
  pageToken,
}: {
  maxResults?: number;
  pageToken?: string;
}) {
  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      pageToken,
      q: "in:spam",
    });

    const messages = listRes.data.messages || [];
    const nextPageToken = listRes.data.nextPageToken || undefined;

    if (messages.length === 0) {
      return { emails: [], nextPageToken };
    }

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const detailRes = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
        });

        const headers = detailRes.data.payload?.headers;
        const labelIds = detailRes.data.labelIds || [];

        return {
          id: msg.id,
          threadId: msg.threadId,
          isUnread: labelIds.includes("UNREAD"),
          isStarred: labelIds.includes("STARRED"),
          subject:
            headers?.find((h) => h.name === "Subject")?.value || "(No Subject)",
          from:
            headers?.find((h) => h.name === "From")?.value || "Unknown Sender",
          date: headers?.find((h) => h.name === "Date")?.value || "",
          snippet: detailRes.data.snippet,
        };
      }),
    );

    return { emails, nextPageToken };
  } catch (error) {
    console.error("Gmail Spam Fetch Error:", error);
    throw error;
  }
}

export async function fetchBinEmails({
  maxResults = 10,
  pageToken,
}: {
  maxResults?: number;
  pageToken?: string;
}) {
  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      maxResults,
      pageToken,
      q: "in:trash",
    });

    const messages = listRes.data.messages || [];
    const nextPageToken = listRes.data.nextPageToken || undefined;

    if (messages.length === 0) {
      return { emails: [], nextPageToken };
    }

    const emails = await Promise.all(
      messages.map(async (msg) => {
        const detailRes = await gmail.users.messages.get({
          userId: "me",
          id: msg.id!,
          format: "metadata",
        });

        const headers = detailRes.data.payload?.headers;
        const labelIds = detailRes.data.labelIds || [];

        return {
          id: msg.id,
          threadId: msg.threadId,
          isUnread: labelIds.includes("UNREAD"),
          isStarred: labelIds.includes("STARRED"),
          subject:
            headers?.find((h) => h.name === "Subject")?.value || "(No Subject)",
          from:
            headers?.find((h) => h.name === "From")?.value || "Unknown Sender",
          date: headers?.find((h) => h.name === "Date")?.value || "",
          snippet: detailRes.data.snippet,
        };
      }),
    );

    return { emails, nextPageToken };
  } catch (error) {
    console.error("Gmail Bin Fetch Error:", error);
    throw error;
  }
}

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
          isStarred: labelIds.includes("STARRED"),
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

export async function createDraft({
  to,
  subject,
  body,
  html,
  cc,
  bcc,
  attachments,
}: SendEmailOptions) {
  try {
    const mailOptions: Record<string, any> = {
      to,
      subject,
      from: "me",
    };

    if (body) mailOptions.text = body;
    if (html) mailOptions.html = html;
    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;
    if (attachments) mailOptions.attachments = attachments;

    // 1. Compose the email
    const mail = new MailComposer(mailOptions);

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

export async function getEmailCount() {
  try {
    const res = await gmail.users.getProfile({
      userId: "me",
    });

    return res;
  } catch (error) {
    throw error;
  }
}

export async function getUnreadEmailCount() {
  try {
    const res = await gmail.users.labels.get({
      userId: "me",
      id: "INBOX",
    });

    return res;
  } catch (err) {
    throw err;
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

export async function sendEmail(options: SendEmailOptions) {
  const { to, subject, body, html, cc, bcc, attachments } = options;
  try {
    if (!to || to.trim().length === 0) {
      throw new Error("Recipient address (to) is required");
    }

    const mailOptions: any = {
      from: "me",
      to: to.trim(),
      subject: subject || "(No Subject)",
    };

    if (body) mailOptions.text = body;
    if (html) mailOptions.html = html;

    if (cc) {
      mailOptions.cc = Array.isArray(cc) ? cc.map((c) => c.trim()) : cc.trim();
    }

    if (bcc) {
      mailOptions.bcc = Array.isArray(bcc)
        ? bcc.map((b) => b.trim())
        : bcc.trim();
    }

    if (attachments && attachments.length > 0) {
      mailOptions.attachments = attachments;
    }

    const mail = new MailComposer(mailOptions);
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
    console.error("Gmail Send Error Details:", {
      error: errorMessage,
      recipient: to,
    });
    throw error;
  }
}

export async function getSpamEmailsCount() {
  try {
    const listRes = await gmail.users.messages.list({
      userId: "me",
      q: "in:spam",
      maxResults: 1,
    });

    const count = listRes.data.resultSizeEstimate || 0;
    return count;
  } catch (error) {
    console.error("Error fetching spam emails count:", error);
    throw error;
  }
}

export async function getDraftEmailsCount() {
  try {
    // const listRes = await gmail.users.messages.list({
    //   userId: "me",
    //   q: "in:drafts",
    //   maxResults: 1,
    // });

    const listRes = await gmail.users.drafts.list({
      userId: "me",
    });

    return listRes;
  } catch (error) {
    console.error("Error fetching draft emails count:", error);
    throw error;
  }
}

export async function modifyEmailLabels(
  messageId: string,
  options: modifyEmailLabelsOptions,
) {
  const addLabelIds: string[] = [];
  const removeLabelIds: string[] = [];

  if (options.isStarred !== undefined) {
    if (options.isStarred) {
      addLabelIds.push("STARRED");
    } else {
      removeLabelIds.push("STARRED");
    }
  }

  if (options.isRead !== undefined) {
    if (options.isRead) {
      removeLabelIds.push("UNREAD");
    } else {
      addLabelIds.push("UNREAD");
    }
  }

  if (options.isTrashed !== undefined) {
    if (options.isTrashed) {
      addLabelIds.push("TRASH");
      removeLabelIds.push("INBOX");
    } else {
      removeLabelIds.push("TRASH");
      addLabelIds.push("INBOX");
    }
  } else if (options.isArchived !== undefined) {
    if (options.isArchived) {
      removeLabelIds.push("INBOX");
    } else {
      addLabelIds.push("INBOX");
    }
  }

  if (addLabelIds.length === 0 && removeLabelIds.length === 0) {
    return { status: "no-action", message: "No state changes provided." };
  }

  try {
    const res = await gmail.users.messages.modify({
      userId: "me",
      id: messageId,
      requestBody: {
        addLabelIds,
        removeLabelIds,
      },
    });

    console.log(`Successfully updated ${messageId}`);
    return res.data;
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown API Error";
    console.error(`Gmail Update Error [${messageId}]:`, msg);
    throw new Error(msg);
  }
}
