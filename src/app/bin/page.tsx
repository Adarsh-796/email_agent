import MailListLoader from "@/components/mail-list-loader";
import OptimisticEmails from "@/components/opt-emails";
import { Suspense } from "react";

export default async function BinPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Suspense fallback={<MailListLoader />}>
        <BinMails />
      </Suspense>
    </div>
  );
}

async function BinMails() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/bin`);
  const data = await response.json();
  const { emails, nextPageToken } = data;
  const hasEmails = emails.length > 0;
  return (
    <>
      {hasEmails ? (
        <OptimisticEmails emails={emails} />
      ) : (
        <p className="text-center">
          No emails found. Try a different search or check back later.
        </p>
      )}
    </>
  );
}
