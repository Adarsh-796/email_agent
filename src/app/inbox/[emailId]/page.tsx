import { handleLabelAction } from "@/lib/actions";
import { formatEmailDate, getRelativeTime, parseSender } from "@/lib/utils";
import { CornerUpLeft, Star } from "lucide-react";
import { notFound } from "next/navigation";

interface EmailData {
  id: string;
  threadId: string;
  labelIds: string[];
  isUnread: boolean;
  isStarred: boolean;
  subject: string;
  from: string;
  to: string;
  date: string;
  snippet: string;
  bodyText: string;
  bodyHtml: string;
}

import ReplyGenerator from "@/components/ReplyGenerator";

export default async function EmailPage(props: PageProps<"/inbox/[emailId]">) {
  const { params } = props;
  const { emailId } = await params;

  const resp = await fetch(`http://localhost:3000/api/get/${emailId}`);

  if (!resp.ok) {
    if (resp.status === 404) notFound();
    throw new Error("Failed to fetch email");
  }

  const email: EmailData = await resp.json();
  const { name, emailstring } = parseSender(email?.from);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-semibold text-foreground/90 leading-tight">
            {email?.subject}
          </h1>
          <button
            className={`mt-1 shrink-0 transition-colors ${
              email?.isStarred
                ? "text-yellow-400 fill-yellow-400"
                : "text-muted-foreground hover:text-yellow-400"
            }`}
          >
            <Star size={24} />
          </button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-lg uppercase">
              {name.charAt(0)}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{name}</span>
                <span className="text-muted-foreground text-sm font-normal">
                  {"<"}
                  {emailstring}
                  {">"}
                </span>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium ml-1 transition-colors">
                  Unsubscribe
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                <span>to me</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end text-sm text-muted-foreground">
              <time className="font-medium">
                {formatEmailDate(email?.date)}
              </time>
              <span className="text-xs">({getRelativeTime(email?.date)})</span>
            </div>
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <CornerUpLeft size={18} />
            </button>
          </div>
        </div>
      </div>

      <hr className="border-border/60" />

      <div
        className="max-w-none prose dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: email?.bodyHtml }}
      />

      <ReplyGenerator
        emailBody={email?.bodyText || email?.bodyHtml}
        subject={email?.subject}
      />

      <div className="mt-8 flex items-center gap-3">
        {/* <button className="flex items-center gap-2 px-6 py-2 rounded-full border border-border hover:bg-muted transition-colors font-medium text-sm text-foreground">
          <CornerUpLeft size={18} />
          Reply
        </button> */}
      </div>
    </div>
  );
}
