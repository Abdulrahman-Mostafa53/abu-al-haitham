import { PERIODS } from "../../../data/mock";
import { useLanguage } from "../../../i18n/context";
import { useStudent } from "../context";
import type { ClassType } from "../types";

const cellTone: Record<ClassType, string> = {
  lec: "border-s-teal",
  tut: "border-s-gold",
  lab: "border-s-teal-deep bg-teal/8",
};

export function ClassTag({ type }: { type: ClassType }) {
  const { t } = useLanguage();
  const tone =
    type === "lab"
      ? "border-teal bg-teal/10 text-teal"
      : type === "tut"
        ? "border-gold bg-gold/12 text-gold-deep"
        : "border-line text-mute";
  return (
    <span className={`inline-block rounded-[999px_999px_6px_6px] border-[1.5px] px-3 pt-[5px] pb-0.5 text-[.72rem] font-bold ${tone}`}>
      {t[type]}
    </span>
  );
}

export default function ScheduleGrid() {
  const { t, lang } = useLanguage();
  const { schedule, courseById } = useStudent();
  const today = (new Date().getDay() + 1) % 7; // Sat = 0 … Thu = 5, Fri = 6 (weekend)

  return (
    <div className="mb-[34px] overflow-x-auto border-y border-line">
      <table className="w-full min-w-[900px] table-fixed border-collapse text-[.9rem]">
        <thead>
          <tr>
            <th className="w-[92px] border-b border-line px-2 py-3.5 text-center text-[.86rem]">{t.th_time}</th>
            {t.days.map((d, i) => (
              <th
                key={d}
                className={`border-s border-b border-line px-2 py-3.5 text-center text-[.86rem] font-bold ${
                  i === today ? "bg-gold/20 shadow-[inset_0_-3px_0_var(--color-gold)]" : ""
                }`}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map(([from, to], p) => (
            <tr key={from}>
              <td className="border-b border-line text-center align-middle font-extrabold tabular-nums">
                {from}
                <small dir="ltr" className="block text-[.72rem] font-semibold text-mute">– {to}</small>
              </td>
              {t.days.map((_, d) => {
                const slot = schedule.find((s) => s.day === d && s.period === p);
                const course = slot && courseById(slot.course_id);
                return (
                  <td
                    key={d}
                    className={`h-[104px] border-s border-b border-line p-2 align-top ${d === today ? "bg-gold/7" : ""}`}
                  >
                    {slot && course && (
                      <div className={`h-full rounded-xl border border-line border-s-4 bg-card px-2.5 py-[9px] text-[.78rem] leading-[1.45] ${cellTone[slot.type]}`}>
                        <b className="block text-[.8rem] text-teal-deep dark:text-gold">{course.code}</b>
                        <span className="block font-semibold">{course.name[lang]}</span>
                        <small className="mt-0.5 block text-mute">
                          {t[slot.type]} · {t[slot.room.kind]} {slot.room.label}
                        </small>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
