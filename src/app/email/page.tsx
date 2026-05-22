"use client";

import AIMessage from "@/components/aimessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserMessage from "@/components/usermessage";
import { useChat } from "@ai-sdk/react";
import {
  ChatAddToolApproveResponseFunction,
  DefaultChatTransport,
  lastAssistantMessageIsCompleteWithApprovalResponses,
} from "ai";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { MyUIMessage } from "@/app/api/chat/route";
import SendMail from "@/components/sendmail";
import CreateDraft from "@/components/createdraft";

export default function Home() {
  const { sendMessage, messages, addToolApprovalResponse } =
    useChat<MyUIMessage>({
      transport: new DefaultChatTransport({
        // api: "/api/chat",
        api: "/api/agent",
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
    if (!input) return;
    sendMessage({ text: input });
    setInput("");
  }

  return (
    <div className="flex items-center justify-center relative  font-sans dark:bg-black">
      <ChatData
        messages={messages}
        addToolApprovalResponse={addToolApprovalResponse}
      />
      <Form
        input={input}
        handleInput={handleInput}
        handleSubmit={handleSubmit}
      />
    </div>
  );
}

type FormProps = {
  handleInput(e: ChangeEvent<HTMLInputElement>): void;
  input: string;
  handleSubmit(e: FormEvent<HTMLFormElement>): void;
};

function Form({ handleInput, input, handleSubmit }: FormProps) {
  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-8 w-[calc(100%-2rem)] max-w-3xl flex gap-3 z-5 p-3 shadow-2xl bg-white/80 rounded-sm dark:bg-black/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 mx-auto"
    >
      <Input
        value={input}
        onChange={handleInput}
        className="flex-1"
        placeholder="Ask something..."
      />
      <Button>Submit</Button>
    </form>
  );
}

type ChatDataProps = {
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  messages: MyUIMessage[];
};

const ChatData = React.memo(function ChatData({
  messages,
  addToolApprovalResponse,
}: ChatDataProps) {
  return (
    <main className="flex min-h-screen w-full max-w-3xl flex-col gap-4 py-4 px-4 bg-white dark:bg-black sm:items-start">
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
    </main>
  );
});
