import { Star } from "lucide-react";
import MailItemButtons from "./mail-item-buttons";
import { Checkbox } from "./ui/checkbox";

export default function MailItem() {
  return (
    <section className="group flex hover:cursor-pointer hover:shadow-md py-2 px-3 items-center transition-shadow duration-200">
      <div className="flex items-center w-60 gap-x-4">
        <Checkbox />
        <Star size={18} />
        <h3>Naukri</h3>
      </div>
      <div className="flex flex-1 justify-between items-center relative">
        <p>
          <span>Subject</span> - <span>Body</span>
        </p>
        <p className="group-hover:hidden h-8 flex items-center">Date</p>
        <div className="hidden group-hover:flex gap-2">
          <MailItemButtons />
        </div>
      </div>
    </section>
  );
}
