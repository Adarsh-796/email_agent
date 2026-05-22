import { MyUIMessage } from "@/app/api/chat/route";
import { Card, CardContent } from "./ui/card";
import { Streamdown } from "streamdown";
import { memo } from "react";

function AIMessage({
  message,
  role,
}: {
  message: string;
  role: MyUIMessage["role"];
}) {
  return (
    <div className="w-full flex justify-start">
      <div className="flex flex-col gap-y-2 flex-end">
        <strong>{role}</strong>
        <Card className="py-2">
          <CardContent>
            <Streamdown>{message}</Streamdown>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default memo(AIMessage);
