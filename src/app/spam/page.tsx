import OptimisticEmails from "@/components/opt-emails";
import { MailItemType } from "@/lib/types";

export default async function SpamPage() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASEURL}/api/spam`);
  const data = await response.json();
  const { emails, nextPageToken } = data;

  const hasEmails = emails.length > 0;
  return (
    <div className="w-full overflow-x-hidden">
      {hasEmails ? (
        <OptimisticEmails emails={emails} />
      ) : (
        <p className="text-center">
          No emails found. Try a different search or check back later.
        </p>
      )}
    </div>
  );
}
