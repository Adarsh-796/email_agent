import { sendEmail } from "@/lib/gmail";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const sendEmailSchema = z.object({
  action: z.literal("sendDirect"),
  to: z.email(),
  subject: z.string(),
  body: z.string().optional(),
  html: z.string().optional(),
  cc: z.union([z.string(), z.array(z.string())]).optional(),
  bcc: z.union([z.string(), z.array(z.string())]).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const sendEmailData = await request.json();
    const result = sendEmailSchema.safeParse(sendEmailData);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: result.error.format() },
        { status: 400 },
      );
    }

    const { to, subject, body, html, cc, bcc } = result.data;

    const sent = await sendEmail({
      to: to.trim(),
      subject,
      body,
      html,
      cc,
      bcc,
    });
    return NextResponse.json({ success: true, messageId: sent.id });
  } catch (error) {
    console.error("API Send Error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to send email",
      },
      { status: 500 },
    );
  }
}
