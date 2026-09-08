import MailListLoader from "@/components/mail-list-loader";
import OptimisticEmails from "@/components/opt-emails";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

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
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/bin`, {
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
