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
import { google } from "@ai-sdk/google";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_AI_API_KEY,
});

const model = wrapLanguageModel({
  // model: openrouter("openai/gpt-oss-120b"),
  model: google("gemini-3-flash-preview"),
  middleware: devToolsMiddleware(),
});

// export async function GeneralWorker(input: MyUIMessage[]) {
//   const { output } = await generateText({
//     model,
//     system: `You are an email intent classification agent for Gmail.
//              Your task is to classify the user's message into exactly ONE of the following intents:
//              - "Send"   → The user wants to compose, write, draft, or send a new email or reply.
//              - "Delete" → The user wants to delete, remove, trash, or clear one or more emails.
//              - "Search" → The user wants to find, look up, filter, or view existing emails.
//              - Only output ONE word: Send, Delete, or Search.`,
//     // prompt: input,
//     messages: await convertToModelMessages(input),
//     output: Output.choice({
//       options: ["Send", "Delete", "Search"] as const,
//     }),
//   });

//   if (output === "Send") {
//     //Send Email
//     const { output: emailSentResponse } = await generateText({
//       model,
//       system: `You are an AI email assistant responsible for sending emails using sendEmailTool.

//                Your job is to:
//                1. Collect the recipient's email address (toEmail).
//                2. Collect the context/purpose of the email (what the email is about).

//                You MUST ask the user for any missing information before proceeding.

//                Rules:
//                - Do NOT ask the user to write the full email body.
//                - Only ask for:
//                  • Recipient email address
//                  • Context or purpose of the email
//                - You are responsible for generating:
//                  • A clear subject line
//                  • A professional and well-structured email body based on the provided context
//                - Do NOT invent recipient email addresses.
//                - Do NOT call sendEmailTool unless both recipient email and context are provided.

//                When you have both:
//                1. Generate an appropriate subject.
//                2. Generate a complete, well-written email body based on the context.
//                3. Call sendEmailTool with:
//                  - toEmail
//                  - generated subject
//                  - generated body

//                After successfully sending the email, return:
//                {
//                  "success": "<recipient_email>"
//                }`,
//       // prompt: input,
//       messages: await convertToModelMessages(input),
//       tools: { sendEmailTool },
//       output: Output.object({
//         schema: z.object({
//           success: z
//             .string()
//             .describe("Return the mail address to which email sent"),
//         }),
//       }),
//       stopWhen: stepCountIs(3),
//     });

//     return emailSentResponse;
//   } else if (output === "Delete") {
//     //Delete Email
//     const { output: deletedEmail } = await generateText({
//       model,
//       system: "Your task is to delete an email based on a messageId",
//       // prompt: input,
//       messages: await convertToModelMessages(input),
//       tools: { trashEmailTool },
//       output: Output.object({
//         schema: z.object({
//           success: z
//             .string()
//             .describe("Return the message id of the daleted email"),
//         }),
//       }),
//       stopWhen: stepCountIs(3),
//     });

//     return deletedEmail;
//   } else if (output === "Search") {
//     //Search Email
//     const { output: retrievedEmails } = await generateText({
//       model,
//       system: "Your task is to search email you're provided with a search tool",
//       // prompt: input,
//       messages: await convertToModelMessages(input),
//       tools: { searchEmailTool },
//       stopWhen: stepCountIs(3),
//     });
//     return retrievedEmails;
//   }
// }

export async function GeneralWorker(input: MyUIMessage[]) {
  const {} = await generateText({
    model,
    system: ``,
    messages: await convertToModelMessages(input),
    tools: {
      sendEmailTool,
    },
  });
}
