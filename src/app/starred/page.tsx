import MailListLoader from "@/components/mail-list-loader";
import OptimisticEmails from "@/components/opt-emails";
import { Suspense } from "react";

export default async function StarredPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Suspense fallback={<MailListLoader />}>
        <StarredEmails />
      </Suspense>
    </div>
  );
}

async function StarredEmails() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/star`);
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
