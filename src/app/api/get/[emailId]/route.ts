import { NextRequest, NextResponse } from "next/server";
import { fetchEmailById } from "@/lib/gmail"; // Ensure this path matches your file structure

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ emailId: string }> },
) {
  const { emailId } = await params;

  if (!emailId) {
    return NextResponse.json(
      { error: "Email ID is required in the URL path" },
      { status: 400 },
    );
  }

  try {
    const email = await fetchEmailById(emailId);

    return NextResponse.json(email);
  } catch (error) {
    console.error(`Next.js API Error for ${emailId}:`, error);

    const status = 500;
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch email from Gmail";

    return NextResponse.json({ error: message }, { status: status });
  }
}
