import LabelList from "@/components/label-list";
import MailItem from "@/components/mail-item";
import PaginationButtons from "@/components/paginationButtons";

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
  const { emails, nextPageToken } = data;
  return (
    <div>
      <LabelList />
      <MailItem />
      <MailItem />
      <MailItem />
      <PaginationButtons pageToken={nextPageToken} />
    </div>
  );
}
