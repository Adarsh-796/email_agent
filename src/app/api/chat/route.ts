import { MyTools } from "@/lib/tools";
import { DraftType, DraftWorker } from "@/lib/worker/draft-worker";
// import { EventCreationWorker } from "@/lib/worker/event-worker";
import { GeneralWorker } from "@/lib/worker/general-worker";
import routerWorker from "@/lib/worker/router-worker";
import { devToolsMiddleware } from "@ai-sdk/devtools";
// import { google } from "@ai-sdk/google";
import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  // generateText,
  streamText,
  UIMessage,
  wrapLanguageModel,
} from "ai";

export const model = wrapLanguageModel({
  // model: google("gemini-3-flash-preview"),
  model: openai("gpt-4.1-nano"),
  middleware: devToolsMiddleware(),
});

export type MyUIMessage = UIMessage<never, never, MyTools>;

export async function POST(request: Request) {
  const { messages }: { messages: MyUIMessage[] } = await request.json();
  try {
    let route: string | null = null;
    let draftType: string | null = null;
    if (route === null) {
      route = await routerWorker(messages);
    }
    if (route === "Gmail Worker") {
      if (draftType === null) {
        draftType = await DraftType(messages);
      }

      // await GeneralWorker(messages);
    } else if (route === "Draft Worker") {
      await DraftWorker(messages);
    } else if (route === "Event Worker") {
      // await EventCreationWorker(messages);
    }

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (err) {
    if (err instanceof Error) {
      return Response.json({ error: JSON.stringify(err) });
      throw err;
    } else {
      return Response.json({ error: "Failed to fetch" });
      throw new Error("Falied to perform action");
    }
  }
}
