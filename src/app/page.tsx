import EmailsFetcher from "@/components/emails-fetcher";
import LabelList from "@/components/label-list";
import MailListLoader from "@/components/mail-list-loading";
import { Skeleton } from "@/components/ui/skeleton";
import { MailItemType } from "@/lib/types";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ pageToken?: string }>;
}) {
  const { pageToken } = await searchParams;
  // const { NEXT_PUBLIC_BASEURL } = process.env;
  // const url = new URL(`${NEXT_PUBLIC_BASEURL}/api/get`);
  // if (pageToken) {
  //   url.searchParams.set("pageToken", pageToken);
  // }
  // const response = await fetch(url);
  // const data = await response.json();
  // const {
  //   emails,
  //   nextPageToken,
  // }: { emails: MailItemType[]; nextPageToken: string } = data;
  // const hasEmails = Array.isArray(emails) && emails.length > 0;
  return (
    <div className="w-full overflow-x-hidden">
      <LabelList />
      <Suspense fallback={<MailListLoader />}>
        <EmailsFetcher pageToken={pageToken} />
      </Suspense>
    </div>
  );
}
