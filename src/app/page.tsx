import LabelList from "@/components/label-list";
import OptimisticEmails from "@/components/opt-emails";
import PaginationButtons from "@/components/paginationButtons";
import { MailItemType } from "@/lib/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ pageToken?: string }>;
}) {
  const { pageToken } = await searchParams;
  const { NEXT_PUBLIC_BASEURL } = process.env;
  const url = new URL(`${NEXT_PUBLIC_BASEURL}/api/get`);
  if (pageToken) {
    url.searchParams.set("pageToken", pageToken);
  }
  const response = await fetch(url);
  const data = await response.json();
  const {
    emails,
    nextPageToken,
  }: { emails: MailItemType[]; nextPageToken: string } = data;
  const hasEmails = Array.isArray(emails) && emails.length > 0;
  return (
    <div className="w-full overflow-x-hidden">
      <LabelList />
      {hasEmails ? (
        <OptimisticEmails emails={emails} />
      ) : (
        <p className="text-center">
          No emails found. Try a different search or check back later.
        </p>
      )}
      <PaginationButtons pageToken={nextPageToken} />
    </div>
  );
}
