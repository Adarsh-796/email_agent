"use client";
import { handleStarAction } from "@/lib/actions";
import { Star } from "lucide-react";

export default function StarButton({
  isStarred,
  id,
}: {
  isStarred: boolean;
  id?: string | null;
}) {
  return (
    <Star
      size={18}
      fill={isStarred ? "yellow" : "none"}
      color={isStarred ? "yellow" : "black"}
      onClick={() => {
        console.log("Clicked");
        if (id) {
          handleStarAction(id, { isStarred: !isStarred });
        }
      }}
    />
  );
}
