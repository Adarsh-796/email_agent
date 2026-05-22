"use client";

import EmailActionProvider from "@/contexts/email-action/email-action-context";
import { handleLabelAction } from "@/lib/actions";
import { MailItemType, modifyEmailLabelsOptions } from "@/lib/types";
import { memo, useOptimistic, useState, useTransition } from "react";
import MailItem from "./mail-item";

export type OptEmailInputType = {
  id: string;
  action: "star" | "unstar" | "read" | "unread" | "trash" | "archieve";
};

function updateEmails(
  emails: MailItemType[],
  { id, action }: OptEmailInputType,
) {
  switch (action) {
    case "read":
      return emails.map((email) =>
        email.id === id ? { ...email, isUnread: false } : email,
      );
    case "unread":
      return emails.map((email) =>
        email.id === id ? { ...email, isUnread: true } : email,
      );
    case "star":
      return emails.map((email) =>
        email.id === id ? { ...email, isStarred: true } : email,
      );
    case "unstar":
      return emails.map((email) =>
        email.id === id ? { ...email, isStarred: false } : email,
      );
    case "trash":
      return emails.filter((email) => email.id !== id);
    case "archieve":
      return emails.filter((email) => email.id !== id);
  }
}

function OptimisticEmails({ emails }: { emails: MailItemType[] }) {
  const [emailsData, setEmailsData] = useState(emails);
  const [, startTransition] = useTransition();
  const [optEmails, setOptEmails] = useOptimistic(emailsData, updateEmails);

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
      } else if (action === "trash") {
        options = { isTrashed: true };
      } else if (action === "archieve") {
        options = { isArchived: true };
      }
      try {
        await handleLabelAction(id, options);
        setEmailsData((prevEmails) => updateEmails(prevEmails, { id, action }));
      } catch (err) {}
    });
  };

  return (
    <div className="h-137.5 overflow-y-auto">
      <EmailActionProvider onAction={emailAction}>
        {optEmails?.map((email: MailItemType) => (
          <MailItem key={email.id} mailItem={email} />
        ))}
      </EmailActionProvider>
    </div>
  );
}

export default memo(OptimisticEmails);
