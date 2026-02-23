"use client";

import { useEmailActionContext } from "@/contexts/email-action/email-action-context";
import { Archive, Mail, MailOpen, Trash } from "lucide-react";
import { Button } from "./ui/button";
export default function MailItemButtons({
  id,
  isUnread,
}: {
  id?: string | null;
  isUnread: boolean;
}) {
  const { onAction } = useEmailActionContext();
  return (
    <>
      <Button
        variant={"ghost"}
        onClick={() => {
          if (id) {
            onAction({ id, action: "archieve" });
          }
        }}
        className="h-8 w-8 hover:bg-gray-200 rounded-full p-2 transition-colors"
      >
        <Archive className="w-4 h-4 text-gray-700" />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => {
          if (id) {
            onAction({ id, action: "trash" });
          }
        }}
        className="h-8 w-8 hover:bg-gray-200 rounded-full p-2 transition-colors"
      >
        <Trash className="w-4 h-4 text-gray-700" />
      </Button>
      <Button
        variant={"ghost"}
        onClick={() => {
          if (id) {
            onAction({ id, action: isUnread ? "read" : "unread" });
          }
        }}
        className="h-8 w-8 hover:bg-gray-200 rounded-full p-2 transition-colors"
      >
        {isUnread ? (
          <MailOpen className="w-4 h-4 text-gray-700" />
        ) : (
          <Mail className="w-4 h-4 text-gray-700" />
        )}
      </Button>
    </>
  );
}
