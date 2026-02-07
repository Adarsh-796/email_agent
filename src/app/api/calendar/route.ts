import { NextResponse } from "next/server";
import { createCalendarEvent, listCalendarEvents } from "@/lib/calendar";

export async function POST(request: Request) {
  try {
    // 1. Parse and validate the JSON body
    const body = await request.json();
    const { action, title, desc, start, end, emails } = body;

    // 2. Route to the correct Calendar logic based on 'action'
    switch (action) {
      /** ACTION: CREATE EVENT **/
      case "createEvent":
        if (!title || !start || !end) {
          return NextResponse.json(
            { error: "Missing required fields for event creation" },
            { status: 400 },
          );
        }

        try {
          const event = await createCalendarEvent(
            title,
            desc,
            start,
            end,
            emails || [],
          );
          return NextResponse.json({
            success: true,
            message: "Event created successfully",
            link: event.htmlLink,
            eventId: event.id,
          });
        } catch (calendarError) {
          console.error("Calendar Create Error:", calendarError);
          return NextResponse.json(
            {
              error: "Failed to create event",
              details: calendarError instanceof Error && calendarError.message,
            },
            { status: 500 },
          );
        }

      /** ACTION: LIST EVENTS **/
      case "listEvents":
        try {
          const events = await listCalendarEvents(10);
          return NextResponse.json({
            success: true,
            count: events.length,
            data: events.map((event) => ({
              id: event.id,
              summary: event.summary || "No Title",
              start: event.start?.dateTime || event.start?.date,
              end: event.end?.dateTime || event.end?.date,
              link: event.htmlLink,
            })),
          });
        } catch (listError) {
          console.error("Calendar List Error:", listError);
          return NextResponse.json(
            {
              error: "Failed to list events",
              details: listError instanceof Error && listError.message,
            },
            { status: 500 },
          );
        }

      /** DEFAULT CASE **/
      default:
        return NextResponse.json(
          { error: `Invalid action: ${action}` },
          { status: 400 },
        );
    }
  } catch (error) {
    // Catch JSON parsing errors or general server crashes
    console.error("Critical Server Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Malformed JSON body",
      },
      { status: 500 },
    );
  }
}
