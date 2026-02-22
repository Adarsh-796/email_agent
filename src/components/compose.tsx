import { PenIcon } from "lucide-react";
import { Card } from "./ui/card";

export default function Compose() {
  return (
    <Card className="w-45 bg-[rgb(194,231,255)] rounded-2xl py-5 ml-4">
      <div className="flex px-8 gap-6 items-center">
        <PenIcon size={18} />
        Compose
      </div>
    </Card>
  );
}
