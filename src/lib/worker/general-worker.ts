import { devToolsMiddleware } from "@ai-sdk/devtools";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  generateText,
  Output,
  stepCountIs,
  wrapLanguageModel,
} from "ai";
import { searchEmailTool, sendEmailTool, trashEmailTool } from "../tools";
import z from "zod";
import { MyUIMessage } from "@/app/api/chat/route";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});

const model = wrapLanguageModel({
  model: openrouter("openai/gpt-oss-120b"),
  // model: google("gemini-3-flash-preview"),
  middleware: devToolsMiddleware(),
});

export async function GeneralWorker(input: MyUIMessage[]) {
  const { output } = await generateText({
    model,
    system: `You're a gmail agent and you need to classify between search, send, delete the emails based on the user's input`,
    // prompt: input,
    messages: await convertToModelMessages(input),
    output: Output.choice({
      options: ["Send", "Delete", "Search"] as const,
    }),
  });

  if (output === "Send") {
    //Send Email
    const { output: emailSentResponse } = await generateText({
      model,
      system:
        "Your task is to send an email, to send an email there must email toEmail address, subject and body",
      // prompt: input,
      messages: await convertToModelMessages(input),
      tools: { sendEmailTool },
      output: Output.object({
        schema: z.object({
          success: z
            .string()
            .describe("Return the mail address to which email sent"),
        }),
      }),
      stopWhen: stepCountIs(3),
    });

    return emailSentResponse;
  } else if (output === "Delete") {
    //Delete Email
    const { output: deletedEmail } = await generateText({
      model,
      system: "Your task is to delete an email based on a messageId",
      // prompt: input,
      messages: await convertToModelMessages(input),
      tools: { trashEmailTool },
      output: Output.object({
        schema: z.object({
          success: z
            .string()
            .describe("Return the message id of the daleted email"),
        }),
      }),
      stopWhen: stepCountIs(3),
    });

    return deletedEmail;
  } else if (output === "Search") {
    //Search Email
    const { output: retrievedEmails } = await generateText({
      model,
      system: "Your task is to search email you're provided with a search tool",
      // prompt: input,
      messages: await convertToModelMessages(input),
      tools: { searchEmailTool },
      stopWhen: stepCountIs(3),
    });
    return retrievedEmails;
  }
}
