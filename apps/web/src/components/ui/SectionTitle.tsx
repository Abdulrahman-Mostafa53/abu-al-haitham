import type { ReactNode } from "react";

export default function SectionTitle({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display text-[2.1rem] leading-tight font-bold rtl:text-[1.6rem] rtl:leading-normal after:mt-2.5 after:block after:h-[3px] after:w-11 after:rounded-[3px] after:bg-gold after:content-[''] ${className}`}
    >
      {children}
    </h2>
  );
}
