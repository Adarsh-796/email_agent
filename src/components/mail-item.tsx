import { MailItemType } from "@/lib/types";
import Link from "next/link";
import MailItemButtons from "./mail-item-buttons";
import StarButton from "./star-button";
import { Checkbox } from "./ui/checkbox";
import { memo } from "react";

function formatEmailDate(dateStr: string): string {
  const LOCALE = "en-US";
  const date = new Date(dateStr);
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    return date.toLocaleTimeString(LOCALE, {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  if (sameYear) {
    return date.toLocaleDateString(LOCALE, {
      day: "numeric",
      month: "short",
    });
  }
  return date.toLocaleDateString(LOCALE, {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

function MailItem({ mailItem }: { mailItem: MailItemType }) {
  const { id, date, from, isStarred, isUnread, threadId, snippet, subject } =
    mailItem;
  console.log(`MailItem - ${id} rendered`);
  console.log(`isStarred: ${isStarred}`);
  return (
    <section className="group w-full flex h-12 hover:shadow-md py-2 px-3 items-center transition-shadow duration-200 overflow-hidden relative">
      <Link href={`/inbox/${id}`} className="absolute inset-0 z-0">
        <span className="sr-only">View email</span>
      </Link>
      <div className="flex items-center w-56 shrink-0 gap-x-4 relative z-10">
        <Checkbox />
        <StarButton isStarred={isStarred} id={id} />
        <h3 className="truncate text-sm font-medium pointer-events-none">
          {from.split("<")[0].replace(/"/g, "").trim()}
        </h3>
      </div>
      <div className="flex-1 min-w-0 relative z-10 pointer-events-none pr-4">
        <p className="text-sm line-clamp-1">
          <span
            className={
              isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"
            }
          >
            {subject || "(No subject)"}
          </span>
          <span className="mx-2 text-gray-400 font-normal">-</span>
          <span className="text-gray-400 font-normal">
            {(snippet || "").replace(/<[^>]*>/g, "")}
          </span>
        </p>
      </div>
      <div className="shrink-0 flex items-center pointer-events-auto relative z-10">
        <p className="group-hover:hidden text-sm text-gray-500 whitespace-nowrap">
          {formatEmailDate(date)}
        </p>
        <div className="hidden group-hover:flex gap-2">
          <MailItemButtons id={id} isUnread={isUnread} />
        </div>
      </div>
    </section>
  );
}

export default memo(MailItem);
