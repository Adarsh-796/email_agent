import { NextRequest, NextResponse } from "next/server";
import { searchEmails, trashEmail, untrashEmail } from "@/lib/gmail";
import { fetchEmails } from "../../../lib/gmail";

// export async function GET() {
//   try {
//     const emails = await searchEmails({
//       // sender: "info@naukri.com",
//       maxResults: 10,
//       newerThan: "1d",
//       unreadOnly: true,
//     });
//     return NextResponse.json(emails);
//   } catch (error) {
//     if (error instanceof Error)
//       return NextResponse.json(
//         { error: JSON.stringify(error) },
//         { status: 500 },
//       );
//     else
//       return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
//   }
// }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  console.log(searchParams.get("pageToken"));
  try {
    const emails = await fetchEmails({ maxResults: 10 });
    return NextResponse.json(emails);
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json(
        { error: JSON.stringify(error) },
        { status: 500 },
      );
    else
      return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Read from body instead of params
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required in body" },
        { status: 400 },
      );
    }

    const a = await trashEmail(id);
    return NextResponse.json({ message: "Email moved to trash", ...a });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Something went wrong",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;

    if (!id) {
      return NextResponse.json(
        { error: "Message ID is required" },
        { status: 400 },
      );
    }

    const a = await untrashEmail(id);

    return NextResponse.json({
      message: "Email successfully restored from trash",
      ...a,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to restore email",
      },
      { status: 500 },
    );
  }
}
