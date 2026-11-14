import { useNavigate } from "react-router-dom";
import ArchPattern from "../../../components/illustrations/ArchPattern";
import { REQUIRED_HOURS } from "../../../data/mock";
import { useLanguage } from "../../../i18n/context";
import { useStudent } from "../context";

export default function DegreePanel() {
  const { t } = useLanguage();
  const { student, summary } = useStudent();
  const navigate = useNavigate();
  const pct = Math.round((summary.earned / REQUIRED_HOURS) * 100);

  return (
    <div className="relative max-w-[420px] overflow-hidden rounded-[999px_999px_24px_24px] bg-brand-gradient px-7 pt-[84px] pb-7 text-[#f8f1df] before:pointer-events-none before:absolute before:inset-2 before:rounded-[999px_999px_18px_18px] before:border before:border-gold/35 before:content-[''] wide:max-w-none">
      <ArchPattern className="absolute inset-0 size-full opacity-50" />

      <div className="relative">
        <span className="mb-1.5 block text-center text-[.8rem] opacity-85">{t.dg}</span>
        <h2 className="text-center font-display text-[1.7rem] leading-[1.3] font-bold rtl:text-[1.3rem] rtl:leading-normal">
          {t.dg_t.replace("{a}", String(summary.earned)).replace("{b}", String(REQUIRED_HOURS))}
        </h2>
        <p className="mt-2 mb-5 text-center text-[.9rem] opacity-85">
          {t.lv}{student.level} · {t.term}
        </p>

        <div className="mb-[22px] flex justify-between">
          {[1, 2, 3, 4].map((n) => {
            const done = n < student.level;
            const now = n === student.level;
            return (
              <div key={n} className="text-center text-[.7rem] opacity-90">
                <span
                  className={`mx-auto mb-1.5 grid size-[34px] place-items-center rounded-[999px_999px_8px_8px] border-[1.5px] ${
                    done
                      ? "border-gold bg-gold font-extrabold text-[#3b2a00]"
                      : now
                        ? "border-[#fff7e0] bg-[#fff7e0] font-extrabold text-teal-deep shadow-[0_0_0_3px_rgba(229,185,79,.5)]"
                        : "border-gold/50"
                  }`}
                >
                  {done ? "✓" : n}
                </span>
                {t.lv}{n}
              </div>
            );
          })}
        </div>

        <div className="mb-2 flex justify-between text-[.85rem]">
          <span>{t.dg_g}</span>
          <b>{pct}%</b>
        </div>
        <div className="mb-[22px] h-1.5 overflow-hidden rounded-md bg-white/20">
          <i className="block h-full bg-gold" style={{ width: `${pct}%` }} />
        </div>

        <button
          type="button"
          onClick={() => navigate("/grades")}
          className="flex h-[54px] w-full cursor-pointer items-center justify-between rounded-xl bg-[#fffdf8] px-[22px] font-extrabold text-teal-deep transition hover:bg-[#fff3cf]"
        >
          {t.dg_b}
          <span aria-hidden="true" className="text-[1.3rem] rtl:-scale-x-100">→</span>
        </button>
      </div>
    </div>
  );
}
