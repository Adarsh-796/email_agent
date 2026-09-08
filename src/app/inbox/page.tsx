import { InboxEmails } from "../page";

export const dynamic = "force-dynamic";

export default async function InboxPage({
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
