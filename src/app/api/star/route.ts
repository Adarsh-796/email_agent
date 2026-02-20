import { fetchStarredEmails } from "@/lib/gmail";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { emails, nextPageToken } = await fetchStarredEmails({ maxResults: 30 });
    return NextResponse.json({ emails, nextPageToken }, { status: 200 });
  } catch (error) {
    console.error("Error fetching starred emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch starred emails" },
      { status: 500 }
    );
  }
}
