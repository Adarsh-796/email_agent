import MailListLoader from "@/components/mail-list-loader";
import OptimisticEmails from "@/components/opt-emails";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

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
  const response = await fetch(
    `${process.env.BASEURL ?? "http://localhost:3000"}/api/star`,
    {
      cache: "no-store",
    },
  );
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
