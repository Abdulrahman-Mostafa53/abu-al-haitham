export default function GradePill({ grade }: { grade: string | null }) {
  const tone = !grade
    ? "border-dashed font-semibold"
    : grade[0] === "A"
      ? "border-gold bg-gold/20 text-gold-deep"
      : grade[0] === "B"
        ? "border-teal bg-teal/12 text-teal"
        : "";
  return (
    <span
      className={`inline-block min-w-[46px] rounded-[999px_999px_6px_6px] border-[1.5px] border-line px-2.5 pt-1 pb-0.5 text-center text-[.85rem] font-extrabold text-mute ${tone}`}
    >
      {grade ?? "—"}
    </span>
  );
}
