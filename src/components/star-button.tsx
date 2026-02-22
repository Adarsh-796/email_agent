"use client";
import { handleLabelAction } from "@/lib/actions";
import { Star } from "lucide-react";
import { OptEmailInputType } from "./opt-emails";

export default function StarButton({
  isStarred,
  id,
  onAction,
}: {
  isStarred: boolean;
  id?: string | null;
  onAction: ({ id, action }: OptEmailInputType) => Promise<void>;
}) {
  return (
    <Star
      size={18}
      fill={isStarred ? "yellow" : "none"}
      color={isStarred ? "yellow" : "black"}
      onClick={() => {
        console.log("Clicked");
        if (id) {
          onAction({ id, action: isStarred ? "unstar" : "star" });
        }
      }}
    />
  );
}
