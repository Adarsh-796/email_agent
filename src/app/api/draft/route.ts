import { createDraft, deleteDraft, getDraft } from "@/lib/gmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { to, subject, body } = await request.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const draft = await createDraft(to, subject, body);

    return NextResponse.json({
      success: true,
      draftId: draft.id,
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to create a Draft",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { draftId } = body;

    if (!draftId) {
      return NextResponse.json(
        { error: "draftId is required in the request body" },
        { status: 400 },
      );
    }

    await deleteDraft(draftId);

    return NextResponse.json({ message: "Draft deleted permanently" });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete draft",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const draftId = searchParams.get("draftId");

  if (!draftId) {
    return NextResponse.json({ error: "draftId is required" }, { status: 400 });
  }

  try {
    const draftContent = await getDraft(draftId);
    return NextResponse.json(draftContent);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Draft not found" },
      { status: 404 },
    );
  }
}
