import { NextRequest, NextResponse } from "next/server";
import { sendDraft } from "@/lib/gmail";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: draftId } = await params;

    const body = await request.json();
    const { action } = body;

    if (action === "send") {
      if (!draftId) {
        return NextResponse.json(
          { error: "No ID found in URL" },
          { status: 400 },
        );
      }

      const sentMessage = await sendDraft(draftId);

      return NextResponse.json({
        message: "Draft sent successfully",
        messageId: sentMessage.id,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Draft API Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Operation failed" },
      { status: 500 },
    );
  }
}
