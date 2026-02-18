import { Menu, SearchIcon } from "lucide-react";
import { Input } from "./ui/input";

export default function SearchForm() {
  return (
    <form className="bg-[rgb(233,238,246)] w-125 flex items-center border-2 rounded-2xl px-3 py-1 gap-2">
      <SearchIcon className="w-5 h-5 text-gray-500" />
      <Input className="flex-1 border-0 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:border-transparent" />
      <Menu className="w-5 h-5 text-gray-500 cursor-pointer" />
    </form>
  );
}
