"use client";

import { OptEmailInputType } from "@/components/opt-emails";
import { createContext, type ReactNode, use } from "react";

export type TEmailActionContext = {
  onAction: ({ id, action }: OptEmailInputType) => Promise<void>;
};

const EmailActionContext = createContext<TEmailActionContext | null>(null);

export default function EmailActionProvider({
  onAction,
  children,
}: TEmailActionContext & { children: ReactNode }) {
  return (
    <EmailActionContext value={{ onAction }}>{children}</EmailActionContext>
  );
}

export function useEmailActionContext() {
  const context = use(EmailActionContext);
  if (!context) {
    throw new Error("Email Action Context must be used within it's provider");
  }
  return context;
}
