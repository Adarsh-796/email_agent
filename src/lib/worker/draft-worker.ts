import { devToolsMiddleware } from "@ai-sdk/devtools";
import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  generateText,
  Output,
  stepCountIs,
  wrapLanguageModel,
} from "ai";
import { createDraftTool, deleteDraftTool, sendDraftTool } from "../tools";
import z from "zod";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import "dotenv/config";
import { model, MyUIMessage } from "@/app/api/chat/route";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});

// const model = wrapLanguageModel({
//   // model: openrouter("openai/gpt-oss-120b"),
//   model: google("gemini-3-flash-preview"),
//   middleware: devToolsMiddleware(),
// });

export async function DraftWorker(input: MyUIMessage[]) {
  const { output: draftType } = await generateText({
    model,
    system: `Your responsibility is to classify whether user wants to create, send or delete draft based on the prompt`,
    // prompt: input,
    messages: await convertToModelMessages(input),
    output: Output.choice({
      options: ["Send Draft", "Create Draft", "Delete Draft"] as const,
    }),
  });

  if (draftType === "Create Draft") {
    //Create Draft
    const { output } = await generateText({
      model,
      system:
        "Your job is to create a draft mail using the tool provided to you",
      messages: await convertToModelMessages(input),
      stopWhen: stepCountIs(6),
      tools: { createDraftTool },
      output: Output.object({
        schema: z.object({
          success: z.string().describe("Success message"),
        }),
      }),
    });

    console.log(output);
    return output;
  } else if (draftType === "Send Draft" || draftType === "Delete Draft") {
    const { output } = await generateText({
      model,
      system:
        "Based on the user's input used the tools to send or delete a draft using the draftId",
      messages: await convertToModelMessages(input),
      stopWhen: stepCountIs(10),
      tools: {
        sendDraftTool,
        deleteDraftTool,
      },
      output: Output.object({
        schema: z.object({
          success: z.string().describe("Sucess event"),
        }),
      }),
    });
    console.log(output);
    return output;
  }
}

export async function DraftType(input: MyUIMessage[]) {
  const { output: draftType } = await generateText({
    model,
    system: `Your responsibility is to classify whether user wants to create, send or delete draft based on the prompt`,
    messages: await convertToModelMessages(input),
    output: Output.choice({
      options: ["Send Draft", "Create Draft", "Delete Draft"] as const,
    }),
  });
  return draftType;
}

export async function CreateDraftType(input: MyUIMessage[]) {
  const { output } = await generateText({
    model,
    system: "",
    messages: await convertToModelMessages(input),
    tools: { createDraftTool },
  });
}
