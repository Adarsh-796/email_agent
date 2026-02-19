import {
  CircleAlert,
  FileText,
  Inbox,
  SendHorizonal,
  Star,
  Trash,
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
        <SideBarTab
          icon={Inbox}
          tabName="Inbox"
          isActive={true}
          route="inbox"
        />
        <SideBarTab
          icon={Star}
          tabName="Starred"
          isActive={false}
          route="starred"
        />
        <SideBarTab
          icon={SendHorizonal}
          tabName="Sent"
          isActive={false}
          route="sent"
        />
        <SideBarTab
          icon={FileText}
          tabName="Draft"
          isActive={false}
          route="draft"
        />
        <SideBarTab
          icon={CircleAlert}
          tabName="Spam"
          isActive={false}
          route="spam"
        />
        <SideBarTab
          icon={Trash}
          tabName="Bin"
          isActive={false}
          route="delete"
        />
      </div>
    </div>
  );
}
