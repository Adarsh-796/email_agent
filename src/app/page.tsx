import EmailsFetcher from "@/components/emails-fetcher";
import LabelList from "@/components/label-list";
import MailListLoader from "@/components/mail-list-loader";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ pageToken?: string }>;
}) {
  const { pageToken } = await searchParams;

  return (
    <div className="w-full overflow-x-hidden">
      <InboxEmails pageToken={pageToken} />
    </div>
  );
}

export async function InboxEmails({
  pageToken,
}: {
  pageToken: string | undefined;
}) {
  return (
    <>
      <LabelList />
      <Suspense fallback={<MailListLoader />}>
        <EmailsFetcher pageToken={pageToken} />
      </Suspense>
    </>
  );
}
