import { MyUIMessage } from "@/app/api/chat/route";
import { devToolsMiddleware } from "@ai-sdk/devtools";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  generateText,
  Output,
  wrapLanguageModel,
} from "ai";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});

const model = wrapLanguageModel({
  model: openrouter("openai/gpt-oss-120b"),
  // model: google("gemini-3-flash-preview"),
  middleware: devToolsMiddleware(),
});

export default async function routerWorker(input: MyUIMessage[]) {
  const { output } = await generateText({
    model,
    system: `You're an intelligent assistant, you will be provided with a user's prompt, based on that prompt return Gmail Worker if the prompt is regarding search, read, deleting an email, Event Worker if the prompt is related to creatig an event, Draft Worker if it is related to creating, sending, deleting a draft`,
    // prompt: input,
    messages: await convertToModelMessages(input),
    output: Output.choice({
      options: ["Gmail Worker", "Event Worker", "Draft Worker"] as const,
    }),
  });
  return output;
}
