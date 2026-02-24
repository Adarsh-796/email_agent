import { PenIcon } from "lucide-react";
import { Card } from "./ui/card";
import { useState } from "react";
import ComposeMail from "./compose-mail";

export default function Compose() {
  const [isDraftOpen, setIsDraftOpen] = useState<boolean>(false);
  return (
    <Card className="w-45 bg-[rgb(194,231,255)] rounded-2xl py-5 ml-4">
      <div
        onClick={() => setIsDraftOpen((prev) => !prev)}
        className="flex px-8 gap-6 items-center hover:cursor-pointer"
      >
        <PenIcon size={18} />
        Compose
      </div>
      {isDraftOpen && (
        <div className="absolute right-16 bottom-3 w-125 z-20">
          <ComposeMail setIsDraftOpen={setIsDraftOpen} />
        </div>
      )}
    </Card>
  );
}
