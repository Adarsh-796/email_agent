import { CircleAlert, Inbox, Tag, Users } from "lucide-react";
import LabelTag from "./labeltag";

export default function LabelList() {
  return (
    <div className="flex">
      <LabelTag icon={Inbox} labelTagName="Primary" />
      <LabelTag icon={Tag} labelTagName="Promotions" />
      <LabelTag icon={Users} labelTagName="Social" />
      <LabelTag icon={CircleAlert} labelTagName="Updates" />
    </div>
  );
}
