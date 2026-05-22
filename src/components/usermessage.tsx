import { MyUIMessage } from "@/app/api/chat/route";
import { Card, CardContent } from "./ui/card";
import { memo } from "react";

function UserMessage({
  message,
  role,
}: {
  message: string;
  role: MyUIMessage["role"];
}) {
  return (
    <div className="w-full flex justify-end">
      <div className="flex flex-col gap-y-2">
        <strong>{role}</strong>
        <Card className="py-2">
          <CardContent>{message}</CardContent>
        </Card>
      </div>
    </div>
  );
}

export default memo(UserMessage);
