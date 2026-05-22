import { MailType } from "@/lib/types";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { MyTools } from "@/lib/tools";
import { Button } from "./ui/button";
import { memo } from "react";

type CreateDraftType = MailType & {
  input?: {
    to?: string;
    subject?: string;
    body?: string;
  };
  output?: MyTools["createDraftTool"]["output"];
};

function CreateDraft({
  state,
  input,
  output,
  addToolApprovalResponse,
  approvalId,
}: CreateDraftType) {
  if (state === "approval-requested")
    return (
      <Card>
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
          >
            Deny
          </Button>
        </div>
      </Card>
    );
  else if (state === "approval-responded") {
    return <div>Loading...</div>;
  } else if (state === "output-available") {
    return <div>Created a draft successfully</div>;
  }
}

const CardData = memo(function CardData({
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
});

export default memo(CreateDraft);
