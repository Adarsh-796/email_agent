import { PenIcon } from "lucide-react";
import { Card } from "./ui/card";

export default function Compose() {
  return (
    <Card className="w-50 bg-[rgb(194,231,255)] rounded-2xl py-5">
      <div className="flex px-8 gap-10">
        <PenIcon />
        Compose
      </div>
    </Card>
  );
}
