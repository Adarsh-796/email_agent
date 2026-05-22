import OptimisticEmails from "./opt-emails";
import PaginationButtons from "./paginationButtons";

export default async function EmailsFetcher({
  pageToken,
}: {
  pageToken?: string;
}) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BASEURL}/api/get`);
  if (pageToken) url.searchParams.set("pageToken", pageToken);

  const response = await fetch(url, {
    next: { tags: ["fetchEmails"] },
  });
  const { emails, nextPageToken } = await response.json();

  return (
    <>
      {emails?.length > 0 ? (
        <OptimisticEmails emails={emails} />
      ) : (
        <p>No emails found.</p>
      )}
      <PaginationButtons pageToken={nextPageToken} />
    </>
  );
}
