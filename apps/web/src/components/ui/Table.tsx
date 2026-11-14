import type { ReactNode } from "react";

interface TableProps {
  head: ReactNode;
  foot?: ReactNode;
  children: ReactNode;
}

export function Table({ head, foot, children }: TableProps) {
  return (
    <div className="mb-[34px] overflow-x-auto border-y border-line">
      <table className="w-full border-collapse text-[.9rem]">
        <thead>
          <tr>{head}</tr>
        </thead>
        <tbody className="[&>tr:hover]:bg-gold/7 [&>tr:last-child>td]:border-b-0">{children}</tbody>
        {foot}
      </table>
    </div>
  );
}

export function Th({ children, center }: { children?: ReactNode; center?: boolean }) {
  return (
    <th
      className={`border-b border-line px-3.5 py-3 text-[.78rem] font-bold whitespace-nowrap text-mute ${center ? "text-center" : "text-start"}`}
    >
      {children}
    </th>
  );
}

export function Td({ children, center, colSpan }: { children?: ReactNode; center?: boolean; colSpan?: number }) {
  return (
    <td colSpan={colSpan} className={`border-b border-line px-3.5 py-[13px] align-middle ${center ? "text-center tabular-nums" : ""}`}>
      {children}
    </td>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return <span className="font-extrabold text-teal-deep dark:text-gold">{children}</span>;
}
