import { Skeleton } from "./ui/skeleton";

export default function MailItemLoader() {
  return (
    <div className="flex w-full flex-col gap-7 px-5">
      <Skeleton className="h-140 w-full bg-blue-300" />
    </div>
  );
}
