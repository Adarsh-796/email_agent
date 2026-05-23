"use client";

import { ReplyUIMessage } from "@/app/api/agent/reply/route";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Check, Copy, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Card } from "./ui/card";

interface ReplyGeneratorProps {
  emailBody: string;
  subject: string;
}

export default function ReplyGenerator({
  emailBody,
  subject,
}: ReplyGeneratorProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const { messages, sendMessage, status } = useChat<ReplyUIMessage>({
    transport: new DefaultChatTransport({
      api: "http://localhost:3000/api/agent/reply",
    }),
  });

  function generateReplies() {
    sendMessage({
      text: `Subject: ${subject}\n\n${emailBody}`,
    });
  }

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="mt-8 border-t border-border pt-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="text-primary" size={20} />
          AI Suggested Replies
        </h3>
        <button
          onClick={generateReplies}
          disabled={status !== "ready"}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 font-medium"
        >
          {status === "streaming" || status === "submitted" ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generate Replies
            </>
          )}
        </button>
      </div>

      {/* {messages?.map((m) => (
        <div className="w-full" data-id={m.id} key={m.id}>
          {m.parts?.map((part, i) => {
            switch (part.type) {
              case "text":
                return (
                  m.role === "assistant" && (
                    <AIMessage
                      role={m.role}
                      key={`${m.id}-${i}`}
                      message={part.text}
                    />
                  )
                );
              default:
                return null;
            }
          })}
        </div>
      ))} */}

      {messages.map((m) =>
        m.parts?.map((part, i) => {
          switch (part.type) {
            case "data-replies":
              return part?.data.map((reply, i) => {
                return (
                  <Card key={reply}>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {reply}
                    </p>
                    <button
                      onClick={() => copyToClipboard(reply, i)}
                      className="absolute top-2 right-2 p-2 rounded-md bg-muted text-muted-foreground group-hover:opacity-100 transition-opacity hover:text-foreground"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === i ? (
                        <Check size={16} />
                      ) : (
                        <Copy size={16} />
                      )}
                    </button>
                  </Card>
                );
              });
          }
        }),
      )}

      {/* {replies.length > 0 && (
        <div className="grid gap-4 mt-4">
          {replies.map((reply, index) => (
            <div
              key={index}
              className="relative group p-4 rounded-xl border border-border bg-card hover:border-primary/50 transition-all"
            >
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {reply}
              </p>
              <button
                onClick={() => copyToClipboard(reply, index)}
                className="absolute top-2 right-2 p-2 rounded-md bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-foreground"
                title="Copy to clipboard"
              >
                {copiedIndex === index ? (
                  <Check size={16} />
                ) : (
                  <Copy size={16} />
                )}
              </button>
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}
