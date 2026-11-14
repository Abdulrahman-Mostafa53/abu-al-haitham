import type { ReactNode } from "react";

export default function KeyValueList({ items }: { items: [string, ReactNode][] }) {
  return (
    <dl className="mb-9 grid gap-x-9 split:grid-cols-2">
      {items.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-3.5 border-b border-line py-[13px] text-[.92rem]">
          <dt className="font-semibold text-mute">{label}</dt>
          <dd className="m-0 text-end font-bold tabular-nums [overflow-wrap:anywhere]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
