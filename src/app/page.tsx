import LabelList from "@/components/label-list";
import MailItem from "@/components/mail-item";
import PaginationButtons from "@/components/paginationButtons";
import { MailItemType } from "@/lib/types";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ pageToken?: string }>;
}) {
  const { pageToken } = await searchParams;
  const { BASEURL } = process.env;
  const url = new URL(`${BASEURL}/api/get`);
  if (pageToken) {
    url.searchParams.set("pageToken", pageToken);
  }
  const response = await fetch(url);
  const data = await response.json();
  console.log(data);
  const { emails, nextPageToken } = data;
  const hasEmails = Array.isArray(emails) && emails.length > 0;
  return (
    <div className="w-full overflow-x-hidden">
      <LabelList />
      {hasEmails ? (
        emails.map((email: MailItemType) => (
          <MailItem key={email.id} mailItem={email} />
        ))
      ) : (
        <p className="text-center">
          No emails found. Try a different search or check back later.
        </p>
      )}
      <PaginationButtons pageToken={nextPageToken} />
    </div>
  );
}
