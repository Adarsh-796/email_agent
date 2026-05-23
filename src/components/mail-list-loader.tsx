import { arrayLength } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";

export default function MailListLoader() {
  return (
    <div className="flex w-full flex-col gap-7 px-5">
      {arrayLength(8).map((i) => (
        <Skeleton key={i} className="h-8 w-full bg-blue-300" />
      ))}
    </div>
  );
}
