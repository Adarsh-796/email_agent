import { Star } from "lucide-react";
import MailItemButtons from "./mail-item-buttons";
import { Checkbox } from "./ui/checkbox";
import { MailItemType } from "@/lib/types";

// Helper to format email dates according to requirements
function formatEmailDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const sameYear = date.getFullYear() === now.getFullYear();
  const sameDay = date.toDateString() === now.toDateString();

  if (sameDay) {
    // Return only time (e.g., "11:52 AM")
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  if (sameYear) {
    // Return day month (e.g., "13 Feb")
    return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }
  // Return full date in MM/DD/YYYY format for previous years
  return date.toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
}


export default function MailItem({ mailItem }: { mailItem: MailItemType }) {
  const { id, date, from, isStarred, isUnread, threadId, snippet, subject } =
    mailItem;
  console.log(mailItem);
  return (
    <section className="group w-full flex hover:cursor-pointer hover:shadow-md py-2 px-3 items-center transition-shadow duration-200 overflow-hidden">
      {/* Left: sender info – fixed width, no shrink */}
      <div className="flex items-center w-56 shrink-0 gap-x-4">
        <Checkbox />
        <Star
          size={18}
          fill={isStarred ? "yellow" : "none"}
          color={isStarred ? "yellow" : "black"}
        />
        <h3 className="truncate text-sm font-medium">{from.split('<')[0].replace(/"/g, '').trim()}</h3>
      </div>
      {/* Right: subject + snippet + date – fills remaining space */}
      <div className="flex flex-1 items-center min-w-0 gap-x-2">
        {/* Subject + snippet, truncated to one line */}
        <p className="flex-1 min-w-0 overflow-hidden whitespace-nowrap text-ellipsis text-sm">
          <span className={isUnread ? "font-bold text-gray-900" : "font-medium text-gray-700"}>
            {subject || "(No subject)"}
          </span>
          <span className="mx-2 text-gray-400">-</span>
          <span className="text-gray-400 font-normal">{(snippet || '').replace(/<[^>]*>/g, '')}</span>
        </p>
        {/* Date pinned to the right */}
        <div className="shrink-0 flex items-center">
          <p className="group-hover:hidden text-sm text-gray-500 whitespace-nowrap">
            {formatEmailDate(date)}
          </p>
          <div className="hidden group-hover:flex gap-2">
            <MailItemButtons />
          </div>
        </div>
      </div>
    </section>
  );
}
