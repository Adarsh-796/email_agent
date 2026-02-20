import MailItem from "@/components/mail-item";
import { MailItemType } from "@/lib/types";

export default async function StarredPage() {
  const { BASEURL } = process.env;
  const response = await fetch(`${BASEURL}/api/star`);
  const data = await response.json();
  const { emails, nextPageToken } = data;
  const hasEmails = emails.length > 0;

  return (
    <div className="w-full overflow-x-hidden">
      {hasEmails ? (
        emails.map((email: MailItemType) => (
          <MailItem key={email.id} mailItem={email} />
        ))
      ) : (
        <p className="text-center">
          No emails found. Try a different search or check back later.
        </p>
      )}
    </div>
  );
}
