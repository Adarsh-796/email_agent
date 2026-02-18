import {
  CircleAlert,
  FileText,
  Inbox,
  SendHorizonal,
  Star,
  Trash,
} from "lucide-react";
import SideBarTab from "./sidebar-tab";

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
    <div className="border-2 w-62.5 py-3 pe-3">
      <SideBarTab icon={Inbox} tabName="Inbox" isActive={true} />
      <SideBarTab icon={Star} tabName="Starred" isActive={false} />
      <SideBarTab icon={SendHorizonal} tabName="Sent" isActive={false} />
      <SideBarTab icon={FileText} tabName="Draft" isActive={false} />
      <SideBarTab icon={CircleAlert} tabName="Span" isActive={false} />
      <SideBarTab icon={Trash} tabName="Bin" isActive={false} />
    </div>
  );
}
