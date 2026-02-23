"use client";

import EmailActionProvider from "@/contexts/email-action/email-action-context";
import { handleLabelAction } from "@/lib/actions";
import { MailItemType, modifyEmailLabelsOptions } from "@/lib/types";
import { useOptimistic, useTransition } from "react";
import MailItem from "./mail-item";

export type OptEmailInputType = {
  id: string;
  action: "star" | "unstar" | "read" | "unread";
};

export default function OptimisticEmails({
  emails,
}: {
  emails: MailItemType[];
}) {
  const [isPending, startTransition] = useTransition();
  const [optEmails, setOptEmails] = useOptimistic(
    emails,
    (currentEmails, { id, action }: OptEmailInputType) => {
      switch (action) {
        case "read":
          return currentEmails.map((email) =>
            email.id === id ? { ...email, isUnread: false } : email,
          );
        case "unread":
          return currentEmails.map((email) =>
            email.id === id ? { ...email, isUnread: true } : email,
          );
        case "star":
          return currentEmails.map((email) =>
            email.id === id ? { ...email, isStarred: true } : email,
          );
        case "unstar":
          return currentEmails.map((email) =>
            email.id === id ? { ...email, isStarred: false } : email,
          );
      }
    },
  );

  const emailAction = async ({ id, action }: OptEmailInputType) => {
    startTransition(async () => {
      setOptEmails({ id, action });
      let options: modifyEmailLabelsOptions = {};
      if (action === "star") {
        options = { isStarred: true };
      } else if (action === "unstar") {
        options = { isStarred: false };
      } else if (action === "read") {
        options = { isRead: true };
      } else if (action === "unread") {
        options = { isRead: false };
      }
      await handleLabelAction(id, options);
    });
  };

  return (
    <>
      <EmailActionProvider onAction={emailAction}>
        {optEmails?.map((email: MailItemType) => (
          <MailItem key={email.id} mailItem={email} />
        ))}
      </EmailActionProvider>
    </>
  );
}
