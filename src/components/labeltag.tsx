import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export default function LabelTag({
  icon: Icon,
  labelTagName,
}: {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  labelTagName: string;
}) {
  return (
    <section className="flex gap-6 py-4 ps-2 w-58 items-center hover:cursor-pointer hover:bg-blue-100">
      <Icon />
      {labelTagName}
    </section>
  );
}
