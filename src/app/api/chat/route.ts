import { searchEmailTool, sendEmailTool } from "@/lib/tools";
import { generateText, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";

export async function POST(request: Request) {
  const { question } = await request.json();

  try {
    const { text, toolResults } = await generateText({
      model: google("gemini-2.5-flash"),
      system: `You're an AI Gmail Agent who can send mails or search emails using the provided tools`,
      prompt: question,
      tools: {
        searchEmailTool,
        sendEmailTool,
      },
      stopWhen: stepCountIs(5),
    });

    return Response.json({ text, results: toolResults });
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    } else {
      throw new Error("Falied to perform action");
    }
  }
}
