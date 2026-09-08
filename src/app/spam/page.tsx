import OptimisticEmails from "@/components/opt-emails";
import MailListLoader from "@/components/mail-list-loader";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function SpamPage() {
  return (
    <div className="w-full overflow-x-hidden">
      <Suspense fallback={<MailListLoader />}>
        <SpamEmails />
      </Suspense>
    </div>
  );
}

async function SpamEmails() {
  const response = await fetch(`${process.env.BASEURL}/api/spam`, {
    cache: "no-store",
  });
  if (!response.ok) {
    return (
      <p className="text-center">
        No emails found. Try a different search or check back later.
      </p>
    );
  }
  const data = await response.json();
  const { emails } = data;

  const hasEmails = emails?.length > 0;

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
