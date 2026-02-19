import { ChatAddToolApproveResponseFunction, ToolUIPart } from "ai";

export type MailType = {
  state: ToolUIPart["state"];
  addToolApprovalResponse: ChatAddToolApproveResponseFunction;
  approvalId?: string;
};

