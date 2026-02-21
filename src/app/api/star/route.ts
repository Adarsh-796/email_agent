import { fetchStarredEmails } from "@/lib/gmail";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { emails, nextPageToken } = await fetchStarredEmails({
      maxResults: 30,
    });
    return NextResponse.json({ emails, nextPageToken }, { status: 200 });
  } catch (error) {
    console.error("Error fetching starred emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch starred emails" },
      { status: 500 },
    );
  }
}

// export async function POST(req: Request) {
//   try {
//     const {
//       messageId,
//       action,
//     }: { messageId: string; action?: "star" | "unstar" } = await req.json();

//     if (!messageId) {
//       return NextResponse.json(
//         { error: "messageId is required" },
//         { status: 400 },
//       );
//     }

//     const starAction = action || "star";

//     if (starAction === "star") {
//       await starEmail(messageId);
//     } else if (starAction === "unstar") {
//       await unstarEmail(messageId);
//     } else {
//       return NextResponse.json(
//         { error: "Invalid action. Use 'star' or 'unstar'" },
//         { status: 400 },
//       );
//     }

//     return NextResponse.json(
//       { success: true, messageId, action: starAction },
//       { status: 200 },
//     );
//   } catch (error) {
//     console.error("Error modifying email star status:", error);
//     return NextResponse.json(
//       { error: "Failed to modify email star status" },
//       { status: 500 },
//     );
//   }
// }
