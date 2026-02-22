import { modifyEmailLabels } from "@/lib/gmail";
import { modifyEmailLabelsOptions } from "@/lib/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      messageId,
      options,
    }: { messageId: string; options: modifyEmailLabelsOptions } = body;

    if (!messageId) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 },
      );
    }

    const result = await modifyEmailLabels(messageId, options);

    return NextResponse.json({
      success: true,
      data: result ?? "No changes applied",
    });
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
