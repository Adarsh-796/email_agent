"use client";

import { LucideProps } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export default function SideBarTab({
  icon: Icon,
  tabName,
  route,
}: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  tabName: string;
  route: string;
}) {
  const pathname = usePathname();
  const isActive =
    tabName === "Inbox" && pathname === "/"
      ? true
      : pathname === `/${route}` || pathname.includes(`/${route}`);

  return (
    <div
      className={`relative ${isActive ? "bg-[rgb(211,227,253)]" : ""} w-inherit pl-8 py-2 pe-3 rounded-r-2xl`}
    >
      <Link href={`/${route}`} className="absolute inset-0 z-10" />
      <div className="flex items-center gap-4">
        <Icon size={18} />
        <div className="flex justify-between flex-1">
          <span>{tabName}</span>
          {/* <div>10</div> */}
        </div>
      </div>
    </div>
  );
}
