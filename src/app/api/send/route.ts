import { sendEmail } from "@/lib/gmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { action, to, subject, body } = await request.json();

    if (action === "sendDirect") {
      if (!to || !subject || !body) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      const sent = await sendEmail(to, subject, body);
      return NextResponse.json({ success: true, messageId: sent.id });
    }

    // ... other actions
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 },
    );
  }
}
