import { fetchBinEmails } from "@/lib/gmail";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { emails, nextPageToken } = await fetchBinEmails({ maxResults: 30 });
    return NextResponse.json({ emails, nextPageToken }, { status: 200 });
  } catch (error) {
    console.error("Error fetching trash emails:", error);
    return NextResponse.json(
      { error: "Failed to fetch trash emails" },
      { status: 500 },
    );
  }
}
