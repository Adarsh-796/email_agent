"use client";

import {
  CircleAlert,
  FileText,
  Inbox,
  SendHorizonal,
  Star,
  Trash,
  Bot,
} from "lucide-react";
import SideBarTab from "./sidebar-tab";
import Compose from "./compose";

// const tabs = [
//   { icon: Inbox, tabName: "Inbox" },
//   { icon: Star, tabName: "Starred" },
//   { icon: SendHorizonal, tabName: "Sent" },
//   { icon: FileText, tabName: "Draft" },
//   { icon: CircleAlert, tabName: "Span" },
//   { icon: Trash, tabName: "Bin" },
// ];

export default function SideBar() {
  return (
    <div className="mt-4">
      <Compose />
      <div className="w-62.5 py-3 pe-3 mt-4">
        <SideBarTab icon={Inbox} tabName="Inbox" route="inbox" />
        <SideBarTab icon={Star} tabName="Starred" route="starred" />
        <SideBarTab icon={SendHorizonal} tabName="Sent" route="sent" />
        <SideBarTab icon={FileText} tabName="Draft" route="draft" />
        <SideBarTab icon={CircleAlert} tabName="Spam" route="spam" />
        <SideBarTab icon={Trash} tabName="Bin" route="bin" />
        <SideBarTab icon={Bot} tabName="Agent" route="email" />
      </div>
    </div>
  );
}
