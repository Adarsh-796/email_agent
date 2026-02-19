"use client";

import AIMessage from "@/components/aimessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMessage from "@/components/usermessage";
import { useChat } from "@ai-sdk/react";
import {
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { MyUIMessage } from "@/app/api/chat/route";
import SendMail from "@/components/sendmail";
import CreateDraft from "@/components/createdraft";

export default function Home() {
  const { sendMessage, messages, addToolApprovalResponse } =
    useChat<MyUIMessage>({
      transport: new DefaultChatTransport({
        api: "/api/chat",
      }),
      sendAutomaticallyWhen:
        lastAssistantMessageIsCompleteWithApprovalResponses,
    });

  const [input, setInput] = useState<string>("");

  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex min-h-screen items-center justify-center relative bg-black/80 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col gap-4 py-32 px-16 bg-white dark:bg-black sm:items-start">
        {messages?.map((m) => (
          <div className="w-full" data-id={m.id} key={m.id}>
            {m.parts?.map((part, i) => {
              switch (part.type) {
                case "text":
                  return m.role === "assistant" ? (
                    <AIMessage
                      role={m.role}
                      key={`${m.id}-${i}`}
                      message={part.text}
                    />
                  ) : (
                    <UserMessage
                      role={m.role}
                      key={`${m.id}-${i}`}
                      message={part.text}
                    />
                  );
                case "tool-sendEmailTool":
                  return (
                    <SendMail
                      key={`${m.id}-${i}`}
                      state={part.state}
                      input={part.input}
                      output={part.output}
                      addToolApprovalResponse={addToolApprovalResponse}
                      approvalId={part.approval?.id}
                    />
                  );
                case "tool-createDraftTool":
                  return (
                    <CreateDraft
                      key={`${m.id}-${i}`}
                      state={part.state}
                      input={part.input}
                      approvalId={part.approval?.id}
                      output={part.output}
                      addToolApprovalResponse={addToolApprovalResponse}
                    />
                  );
              }
            })}
          </div>
        ))}
        <Link href="/email">Email</Link>
      </main>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-[calc(100%-2rem)] max-w-3xl flex gap-3 z-50 left-1/2 -translate-x-1/2 p-3 shadow-2xl bg-white/80 dark:bg-black/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800"
      >
        <Input
          value={input}
          onChange={handleInput}
          className="flex-1"
          placeholder="Ask something..."
        />
        <Button>Submit</Button>
      </form>
    </div>
  );
}
