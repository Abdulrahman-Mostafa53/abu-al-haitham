import type { ReactNode } from "react";
import SectionTitle from "./SectionTitle";

interface Props {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: Props) {
  return (
    <div className="mb-3.5 flex flex-wrap items-end justify-between gap-4">
      <div>
        <SectionTitle>{title}</SectionTitle>
        {subtitle && <p className="mt-1.5 text-[.9rem] text-mute">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
