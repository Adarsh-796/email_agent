import {
  createDraft,
  deleteDraft,
  fetchDraftEmails,
  getDraft,
  listDrafts,
} from "@/lib/gmail";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const createDraftSchema = z.object({
  to: z.string(),
  subject: z.string(),
  body: z.string().optional(),
  html: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const json = await request.json();
    const result = createDraftSchema.safeParse(json);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 },
      );
    }

    const draft = await createDraft(result.data);

    return NextResponse.json({
      success: true,
      draftId: draft.id,
    });
  } catch (err) {
    console.error("Draft API Error:", err);
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to create a Draft",
      },
      { status: 500 },
    );
  }
}

// export async function POST(request: Request) {
//   try {
//     const { input } = await request.json();

//     const a = await DraftWorker(input);
//     return NextResponse.json({
//       success: true,
//       event: a?.success,
//     });
//   } catch (err) {
//     return NextResponse.json(
//       {
//         error: err instanceof Error ? err.message : "Failed to create a Draft",
//       },
//       { status: 500 },
//     );
//   }
// }

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

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const draftId = searchParams.get("draftId");

//   if (!draftId) {
//     return NextResponse.json({ error: "draftId is required" }, { status: 400 });
//   }

//   try {
//     const draftContent = await getDraft(draftId);
//     return NextResponse.json(draftContent);
//   } catch (error) {
//     return NextResponse.json(
//       { error: error instanceof Error ? error.message : "Draft not found" },
//       { status: 404 },
//     );
//   }
// }

export async function GET() {
  // const { searchParams } = new URL(request.url);
  // const draftId = searchParams.get("draftId");

  const { emails, nextPageToken } = await fetchDraftEmails({ maxResults: 30 });

  try {
    // const draftContent = await getDraft(draftId);
    return NextResponse.json({ emails, nextPageToken }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Draft not found" },
      { status: 404 },
    );
  }
}
