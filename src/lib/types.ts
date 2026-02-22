import { ChatAddToolApproveResponseFunction, ToolUIPart } from "ai";

export type MailType = {
  state: ToolUIPart["state"];
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  approvalId?: string;
};

export type MailItemType = {
  id: string | null | undefined;
  threadId: string | null | undefined;
  isUnread: boolean;
  isStarred: boolean;
  subject: string;
  from: string;
  date: string;
  snippet: string | null | undefined;
};

export type modifyEmailLabelsOptions = {
  isStarred?: boolean;
  isRead?: boolean;
  isTrashed?: boolean;
  isArchived?: boolean;
};
