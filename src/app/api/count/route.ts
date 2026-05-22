import { getDraftEmailsCount, getUnreadEmailCount } from "@/lib/gmail";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // We execute these in parallel to make the API response faster
    const [inboxData, draftsData] = await Promise.all([
      // 1. Get precise Inbox count using labels.get
      getUnreadEmailCount(),
      // 2. Get Drafts count using drafts.list
      getDraftEmailsCount(),
    ]);

    return NextResponse.json({
      inboxCount: inboxData.data.messagesTotal || 0,
      unreadInboxCount: inboxData.data.messagesUnread || 0,
      draftCount: draftsData.data.resultSizeEstimate || 0,
    });
  } catch (error: any) {
    console.error("Gmail API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Gmail counts", details: error.message },
      { status: 500 },
    );
  }
}
