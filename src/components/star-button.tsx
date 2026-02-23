"use client";
import { useEmailActionContext } from "@/contexts/email-action/email-action-context";
import { Star } from "lucide-react";

export default function StarButton({
  isStarred,
  id,
}: {
  isStarred: boolean;
  id?: string | null;
}) {
  const { onAction } = useEmailActionContext();
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
