"use client";

import { useEmailActionContext } from "@/contexts/email-action/email-action-context";
import { handleLabelAction } from "@/lib/actions";
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
            handleLabelAction(id, { isArchived: true });
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
            handleLabelAction(id, { isTrashed: true });
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
            // handleLabelAction(id, { isRead: isUnread ? true : false });
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
