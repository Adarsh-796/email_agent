import { MyTools } from "@/lib/tools";
import { MailType } from "@/lib/types";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type SendMailType = MailType & {
  input?: {
    to?: string;
    subject?: string;
    body?: string;
  };
  output?: MyTools["sendEmailTool"]["output"];
};

export default function SendMail({
  state,
  input,
  output,
  addToolApprovalResponse,
  approvalId,
}: SendMailType) {
  if (state === "approval-requested") {
    return (
      <Card className="w-150">
        <CardHeader>
          <CardData title="To" description={input?.to} />
          <CardData title="Subject" description={input?.subject} />
          <CardData title="Body" description={input?.body} />
        </CardHeader>
        <div className="flex space-x-7 px-5">
          <Button
            onClick={() => {
              if (!approvalId) return;
              addToolApprovalResponse({ id: approvalId, approved: true });
            }}
          >
            Approve
          </Button>
          <Button
            onClick={() => {
              if (!approvalId) return;
              addToolApprovalResponse({ id: approvalId, approved: false });
            }}
            variant="destructive"
          >
            Deny
          </Button>
        </div>
      </Card>
    );
  } else if (state === "approval-responded") {
    return <div>Loading...</div>;
  } else if (state === "output-available") {
    return <div></div>;
  }
}

function CardData({
  title,
  description,
}: {
  title: string;
  description: string | undefined;
}) {
  return (
    <>
      <CardTitle>{title}: </CardTitle>
      <CardDescription className="text-initial">{description}</CardDescription>
    </>
  );
}
