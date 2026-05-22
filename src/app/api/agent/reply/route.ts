// import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
// import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  Output,
  streamText,
  UIMessage,
  wrapLanguageModel,
} from "ai";
import z from "zod";

// export const model = wrapLanguageModel({
//   model: google("gemini-3-flash-preview"),
//   //   model: openai("gpt-4.1-nano"),
//   middleware: devToolsMiddleware(),
// });

const model = google("gemini-3-flash-preview");

export type ReplyUIMessage = UIMessage<
  unknown,
  {
    replies: string[];
  }
>;

export async function POST(req: Request) {
  const body = await req.json();
  const { messages }: { messages: UIMessage[] } = body;

  const stream = createUIMessageStream<ReplyUIMessage>({
    execute: async ({ writer }) => {
      const result = streamText({
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
            replies: z.array(z.string()).length(3),
          }),
        }),
      });

      const dataPartId = crypto.randomUUID();

      for await (const chunk of result.partialOutputStream) {
        writer.write({
          id: dataPartId,
          type: "data-replies",
          data: chunk.replies?.filter((reply) => reply !== undefined) ?? [],
        });
      }
    },
  });

  return createUIMessageStreamResponse({
    stream,
  });
}
