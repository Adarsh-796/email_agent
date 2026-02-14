import { google } from "@ai-sdk/google";
import { generateText, Output, stepCountIs, wrapLanguageModel } from "ai";
import z from "zod";
import { createCalendarEventTool, listCalendarEventByDateTool } from "../tools";
import { devToolsMiddleware } from "@ai-sdk/devtools";

const model = wrapLanguageModel({
  model: google("gemini-3-flash-preview"),
  middleware: devToolsMiddleware(),
});

export async function EventCreationWorker(input: string) {
  const { date, summary, description, endTime, startTime, attendeeEmails } =
    await fetchEventDate(input);

  const events = await EventDetails(date);

  if (events === "None") {
    console.log("Entered inside none");
    const a = await CreateEvent(
      summary,
      description,
      startTime,
      endTime,
      attendeeEmails,
    );
    console.log("Completed creating event");
    return a;
  } else {
    return "No Event has been created";
  }
}

async function EventDetails(input: string) {
  const eventsOnAParticularDate = await generateText({
    model,
    system:
      "Your job is fetch calendar events on a particular date, if there are no events return none",
    prompt: `Fetch the events from this particular date: ${input}`,
    tools: {
      listCalendarEventByDateTool,
    },
    stopWhen: stepCountIs(3),
    output: Output.object({
      schema: z.union([
        z.array(
          z.object({
            startTime: z.iso.datetime().describe("Start Time of the event"),
            endTime: z.iso.datetime().describe("The end Time of the event"),
            date: z.iso
              .datetime()
              .describe("The date on which the event is there"),
            eventTitle: z.string().describe("Event Name"),
          }),
        ),
        z.literal("None"),
      ]),
    }),
  });

  return eventsOnAParticularDate.output;
}

async function fetchEventDate(input: string) {
  const { output } = await generateText({
    model,
    system:
      "Your role is to return the date in ISO format from the provided data",
    prompt: `Fetch the date in ISO format from: ${input}`,
    output: Output.object({
      schema: z.object({
        date: z.iso.datetime(),
        summary: z
          .string()
          .describe("The concise title of the calendar event."),
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
    }),
  });

  return output;
}

async function CreateEvent(
  summary: string,
  description: string,
  startTime: string,
  endTime: string,
  attendeeEmails: string[] | undefined,
) {
  await generateText({
    model,
    prompt: `Create the calendar event and parameters of the tool are summary: ${summary}, description: ${description}, endTime: ${endTime}, startTime: ${startTime}, attendeeEmails: ${attendeeEmails}`,
    tools: { createCalendarEventTool },
    stopWhen: stepCountIs(3),
    output: Output.object({
      schema: z.object({
        success: z.literal("Event created successfull"),
      }),
    }),
  });
}
