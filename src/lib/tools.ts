import { InferUITools, tool } from "ai";
import z from "zod";
import {
  createDraft,
  deleteDraft,
  getDraft,
  listDrafts,
  searchEmails,
  sendDraft,
  sendEmail,
  trashEmail,
  untrashEmail,
} from "./gmail";
import {
  createCalendarEvent,
  listCalendarEvents,
  listEventsByDate,
} from "./calendar";

const tools = {
  sendEmailTool: tool({
    description: "Used to send an email to a specified email address",
    inputSchema: z.object({
      to: z.string(),
      subject: z.string(),
      body: z.string(),
    }),
    needsApproval: true,
    execute: async ({ to, subject, body }) => {
      await sendEmail(to, subject, body);
    },
  }),

  createDraftTool: tool({
    description: "Used to create a Draft Email",
    inputSchema: z.object({
      to: z.string(),
      subject: z.string(),
      body: z.string(),
    }),
    needsApproval: true,
    execute: async ({ to, subject, body }) => {
      await createDraft(to, subject, body);
    },
  }),

  trashEmailTool: tool({
    description: "Used to send a particular email to the trash",
    inputSchema: z.object({
      messageId: z.string(),
    }),
    needsApproval: true,
    execute: async ({ messageId }) => {
      await trashEmail(messageId);
    },
  }),

  untrashEmailTool: tool({
    description: "Used to recover a particular email fom the trash",
    inputSchema: z.object({
      messageId: z.string(),
    }),
    execute: async ({ messageId }) => {
      await untrashEmail(messageId);
    },
  }),

  searchEmailTool: tool({
    description:
      "Used to get a list of specified number emails from a particular email adddress if provided or else it fetches the latest emails",
    inputSchema: z.object({
      sender: z.string().optional().describe("The email address of the sender"),
      query: z
        .string()
        .optional()
        .default("")
        .describe("Keywords to search for in the email body or subject"),
      maxResults: z
        .number()
        .optional()
        .default(10)
        .describe("The maximum number of results to return"),
      unreadOnly: z
        .boolean()
        .optional()
        .default(false)
        .describe("Whether to only show unread emails"),
      hasAttachments: z
        .boolean()
        .optional()
        .default(false)
        .describe("Whether the email must have attachments"),
      newerThan: z
        .string()
        .optional()
        .describe(
          'A date string or relative time (e.g., "7d" or "2023-01-01")',
        ),
    }),
    execute: async ({
      sender,
      query,
      maxResults,
      unreadOnly,
      hasAttachments,
      newerThan,
    }) => {
      const res = await searchEmails({
        sender,
        query,
        maxResults,
        unreadOnly,
        hasAttachments,
        newerThan,
      });

      return res;
    },
  }),

  createCalendarEventTool: tool({
    description:
      "Schedules a meeting or event in the user's Google Calendar. Handles titles, agendas, and invitations.",
    inputSchema: z.object({
      summary: z.string().describe("The concise title of the calendar event."),
      description: z
        .string()
        .describe("The meeting agenda, notes, or detailed description."),
      startTime: z.iso
        .datetime({ offset: true })
        .describe(
          "The start date and time in ISO 8601 format (e.g., '2026-02-10T10:00:00Z').",
        ),
      endTime: z.iso
        .datetime({ offset: true })
        .describe(
          "The end date and time in ISO 8601 format (e.g., '2026-02-10T11:00:00Z').",
        ),
      attendeeEmails: z
        .array(z.email())
        .optional()
        .describe("An array of email addresses for people to invite."),
    }),
    needsApproval: true,
    execute: async ({
      summary,
      description,
      startTime,
      endTime,
      attendeeEmails,
    }) => {
      const result = await createCalendarEvent(
        summary,
        description,
        startTime,
        endTime,
        attendeeEmails,
      );

      return {
        status: "success",
        eventId: result.id,
        calendarLink: result.htmlLink,
        googleMeetLink: result.hangoutLink,
      };
    },
  }),

  deleteDraftTool: tool({
    description: "Used to delete a draft email",
    inputSchema: z.object({
      draftId: z.string(),
    }),
    needsApproval: true,
    execute: async ({ draftId }) => {
      await deleteDraft(draftId);
    },
  }),

  listDraftsTool: tool({
    description: "Used to list a specified number of draft emails",
    inputSchema: z.object({
      maxResults: z.number().default(10),
    }),
    execute: async ({ maxResults }) => {
      await listDrafts(maxResults);
    },
  }),

  getDraftTool: tool({
    description: "Used to get a specified draft email",
    inputSchema: z.object({
      draftId: z.string(),
    }),
    execute: async ({ draftId }) => {
      await getDraft(draftId);
    },
  }),

  sendDraftTool: tool({
    description: "Used to send a specified draft email",
    inputSchema: z.object({
      draftId: z.string(),
    }),
    needsApproval: true,
    execute: async ({ draftId }) => {
      await sendDraft(draftId);
    },
  }),

  modifyLabelTool: tool({
    description: "",
    inputSchema: z.object({}),
    execute: async () => {},
  }),

  listCalendarEventsTool: tool({
    description: "Used to list the calendar events",
    inputSchema: z.object({
      maxResults: z.number(),
    }),
    execute: async ({ maxResults }) => {
      await listCalendarEvents(maxResults);
    },
  }),

  listCalendarEventByDateTool: tool({
    description: "Fetches calendar events or meetings on any particular date",
    inputSchema: z.object({
      dateString: z
        .string()
        .describe("The date to fetch events for, in YYYY-MM-DD format"),
    }),
    execute: async ({ dateString }) => {
      const targetDate = new Date(dateString);
      return await listEventsByDate(targetDate);
    },
  }),
};

export type MyTools = InferUITools<typeof tools>;

export const {
  createCalendarEventTool,
  createDraftTool,
  deleteDraftTool,
  getDraftTool,
  listCalendarEventByDateTool,
  listCalendarEventsTool,
  listDraftsTool,
  modifyLabelTool,
  searchEmailTool,
  sendDraftTool,
  sendEmailTool,
  trashEmailTool,
  untrashEmailTool,
} = tools;
