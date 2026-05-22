import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseSender(fromLine: string) {
  const regex =
    /(?:["']?(.*?)["']?\s)?<?([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})>?/;

  const match = fromLine.match(regex);

  if (match) {
    let name = match[1] ? match[1].trim() : "";
    const emailstring = match[2] ? match[2].trim() : "";

    // If no name was found, use the first part of the email as a fallback
    if (!name) {
      name = emailstring.split("@")[0];
    }

    return { name, emailstring };
  }

  return { name: "Unknown", emailstring: fromLine };
}

export function formatEmailDate(dateString: string) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    if (diffInHours === 0) {
      const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    }
    return `${diffInHours} hours ago`;
  } else if (diffInDays === 1) {
    return "yesterday";
  } else {
    return `${diffInDays} days ago`;
  }
}

export function arrayLength(len: number) {
  const arr: Array<number> = [];
  if (len < 0) {
    return arr;
  }
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
}
