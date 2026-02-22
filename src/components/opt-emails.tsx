"use client";

import { MailItemType, modifyEmailLabelsOptions } from "@/lib/types";
import { useOptimistic, useTransition } from "react";
import MailItem from "./mail-item";
import { handleLabelAction } from "@/lib/actions";
import Link from "next/link";

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
      {optEmails?.map((email: MailItemType) => (
        <Link href={`/inbox/${email.id}`} key={email.id}>
          <MailItem mailItem={email} onAction={emailAction} />
        </Link>
      ))}
    </>
  );
}
