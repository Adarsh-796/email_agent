import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
// import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  generateText,
  Output,
  wrapLanguageModel,
} from "ai";
import z from "zod";

export const model = wrapLanguageModel({
  model: google("gemini-3-flash-preview"),
  //   model: openai("gpt-4.1-nano"),
  middleware: devToolsMiddleware(),
});

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { messages } = await req.json();

  const { output } = await generateText({
    model,
    system: `You are a helpful email assistant that writes natural, polite replies.
             Generate 2-3 good reply drafts for the current email thread.
             - Reply in the same language as the incoming email.
             - Match a professional yet friendly tone (adjust slightly warmer or more formal if the thread feels that way).
             - Keep replies short and clear — usually 2-8 sentences.
             - Include a greeting, main response, next step or question if needed, and a simple closing.
             - Reference key points from the thread naturally.
             - Do not explain anything — just output the drafts.`,
    messages: await convertToModelMessages(messages),
    output: Output.object({
      schema: z.object({
        replies: z.array(z.string()).max(3),
      }),
    }),
  });

  return NextResponse.json(output.replies);
}
