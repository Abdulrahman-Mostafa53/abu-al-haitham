import type { ReactNode } from "react";

export interface Stat {
  label: string;
  value: ReactNode;
  note: ReactNode;
  gold?: boolean;
}

export default function StatStrip({ items }: { items: Stat[] }) {
  return (
    <section
      className={`mb-10 grid grid-cols-2 border-y border-line ${items.length === 3 ? "split:grid-cols-3" : "split:grid-cols-4"}`}
    >
      {items.map((s, i) => (
        <div
          key={i}
          className={[
            "border-line px-6 py-5 split:border-t-0",
            i >= 2 ? "border-t" : "",
            i % 2 === 1 ? "border-s" : "",
            i === 0 ? "split:border-s-0" : "split:border-s",
          ].join(" ")}
        >
          <small className="block text-[.84rem] font-bold text-mute">{s.label}</small>
          <span className="block font-display text-[2.9rem] leading-[1.15] font-bold tabular-nums rtl:text-[2.3rem]">
            {s.value}
          </span>
          <em className={`text-[.8rem] font-bold not-italic ${s.gold ? "text-gold-deep" : "text-teal"}`}>{s.note}</em>
        </div>
      ))}
    </section>
  );
}
