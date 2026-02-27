import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";

type TDetails = {
  Cc: boolean;
  Bcc: boolean;
};

type TMailData = {
  To: string;
  Cc?: string;
  Bcc?: string;
  Subject?: string;
  Content?: string;
};

export default function ComposeMail({
  setIsDraftOpen,
}: {
  setIsDraftOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [details, setDetails] = useState<TDetails>({ Cc: false, Bcc: false });
  const [mailData, setMailData] = useState<TMailData>({
    To: "",
    Cc: "",
    Bcc: "",
    Subject: "",
    Content: "",
  });

  async function handleSaveDraftAndClose() {
    setIsDraftOpen(false);
    if (!mailData.To || !mailData.Subject || !mailData.Content) {
      return;
    }
    try {
      if (mailData.To || mailData.Subject || mailData.Content) {
        await fetch("/api/draft", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: mailData.To || " ",
            subject: mailData.Subject || " (No Subject)",
            body: mailData.Content || " ",
          }),
        });
      }
    } catch (error) {
      console.error("Failed to save draft:", error);
    }
  }

  function handleDetails(detail: "Cc" | "Bcc") {
    if (detail === "Cc") {
      setDetails((prev) => ({ ...prev, Cc: true }));
    } else {
      setDetails((prev) => ({ ...prev, Bcc: true }));
    }
  }

  function handleMailData(
    name: keyof TMailData,
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>,
  ) {
    setMailData((data) => ({ ...data, [name]: e.target.value }));
  }

  const [isSending, setIsSending] = useState(false);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!mailData.To) {
      alert("Please specify at least one recipient.");
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "sendDirect",
          to: mailData.To,
          subject: mailData.Subject || "(No Subject)",
          body: mailData.Content || "",
          cc: mailData.Cc || undefined,
          bcc: mailData.Bcc || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send email");
      }

      alert("Email sent successfully!");
      setIsDraftOpen(false);
    } catch (error) {
      console.error("Send Error:", error);
      alert(error instanceof Error ? error.message : "Failed to send email");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <Card className="bg-amber-50 hover:cursor-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>New Message</CardTitle>
          <CardAction>
            <Button
              className="hover:cursor-pointer"
              variant="link"
              onClick={handleSaveDraftAndClose}
            >
              Close
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSend}>
          <div className="flex items-center gap-1">
            <EmailInput
              name="To"
              onChange={handleMailData}
              value={mailData.To}
            />
            <p
              onClick={() => handleDetails("Cc")}
              className="hover:cursor-pointer"
            >
              {!details.Cc && "Cc"}
            </p>
            <p
              onClick={() => handleDetails("Bcc")}
              className="hover:cursor-pointer"
            >
              {!details.Bcc && "Bcc"}
            </p>
          </div>
          <Separator />
          {details.Cc && (
            <>
              <div className="flex items-center gap-1">
                <EmailInput
                  name="Cc"
                  onChange={handleMailData}
                  value={mailData.Cc || ""}
                />
              </div>
              <Separator />
            </>
          )}
          {details.Bcc && (
            <>
              <div className="flex items-center gap-1">
                <EmailInput
                  name="Bcc"
                  onChange={handleMailData}
                  value={mailData.Bcc || ""}
                />
              </div>
              <Separator />
            </>
          )}
          <div className="flex items-center gap-1">
            <EmailInput
              name="Subject"
              onChange={handleMailData}
              value={mailData.Subject || ""}
            />
          </div>
          <Separator className="mb-2" />
          <Textarea
            value={mailData.Content}
            className="mb-2"
            name="Content"
            onChange={(e) => handleMailData("Content", e)}
          />
          <Button
            type="submit"
            disabled={isSending}
            className="hover:cursor-pointer"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function EmailInput({
  name,
  onChange,
  value,
}: {
  name: keyof TMailData;
  onChange: (name: keyof TMailData, e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
}) {
  return (
    <>
      <p>{name}:</p>
      <Input
        onChange={(e) => onChange(name, e)}
        className="flex-1 shadow-none border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent"
        value={value}
      />
    </>
  );
}
