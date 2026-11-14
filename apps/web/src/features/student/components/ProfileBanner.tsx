import ArchPattern from "../../../components/illustrations/ArchPattern";
import ScholarIllustration from "../../../components/illustrations/ScholarIllustration";
import { useLanguage } from "../../../i18n/context";
import { useFormat } from "../../../i18n/useFormat";
import { useStudent } from "../context";

export default function ProfileBanner() {
  const { t, lang } = useLanguage();
  const { date } = useFormat();
  const { student, department } = useStudent();

  const words = student.name[lang].split(" ");
  const last = words.pop();

  return (
    <section className="relative mb-[34px] flex min-h-[280px] flex-col justify-between gap-[22px] overflow-hidden rounded-[28px] bg-brand-gradient px-[22px] py-[26px] text-[#f8f1df] split:min-h-[300px] split:px-10 split:py-[34px]">
      <ArchPattern className="absolute inset-0 z-0 size-full opacity-50" />
      <div className="absolute -end-[10%] -bottom-[20%] z-[1] aspect-square w-[60%] bg-[radial-gradient(circle,rgba(229,185,79,.38),transparent_62%)]" />
      <ScholarIllustration className="absolute -end-[4%] bottom-0 z-[1] h-[56%] opacity-85 drop-shadow-[0_24px_40px_rgba(0,0,0,.4)] split:end-[5%] split:h-[94%] split:opacity-100" />

      <div className="relative z-[2]">
        <span className="inline-block rounded-full border border-white/30 px-3.5 py-[3px] text-[.8rem] font-bold">{t.term}</span>
        <div className="mt-4 text-[.8rem] opacity-85 before:me-2 before:inline-block before:h-0.5 before:w-7 before:bg-gold before:align-middle before:content-['']">
          {date(new Date(), { weekday: "long", day: "numeric", month: "long" })} · {t.city}
        </div>
        <h1 className="mt-3.5 mb-1.5 max-w-[560px] font-display text-[clamp(2.3rem,4.6vw,3.6rem)] leading-[1.15] font-bold rtl:text-[clamp(1.9rem,3.6vw,2.7rem)] rtl:leading-[1.4]">
          {words.join(" ")} <em className="text-gold not-italic">{last}</em>
        </h1>
        <p className="hidden max-w-[420px] leading-[1.7] opacity-90 split:block">
          {department.name[lang]} · {t.lv}{student.level}
        </p>
      </div>

      <div className="relative z-[2] flex flex-wrap gap-[30px] text-[.86rem]">
        {[
          [t.fId, student.university_id],
          [t.fDept, department.name[lang]],
          [t.fLvl, `${t.lv}${student.level}`],
        ].map(([label, value]) => (
          <div key={label} className="border-s-2 border-gold ps-3">
            <small className="block text-[.74rem] opacity-70">{label}</small>
            <b className="font-bold">{value}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
