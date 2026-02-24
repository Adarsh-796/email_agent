import { ChangeEvent, Dispatch, SetStateAction, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";

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

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>New Message</CardTitle>
          <CardDescription
            className="hover:cursor-pointer"
            onClick={() => setIsDraftOpen(false)}
          >
            x
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form>
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
            name="Content"
            onChange={(e) => handleMailData("Content", e)}
          />
          <Button onClick={() => {}}>Send</Button>
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
