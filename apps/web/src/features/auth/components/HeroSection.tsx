import { useLanguage } from "../../../i18n/context";
import ArchPattern from "../../../components/illustrations/ArchPattern";
import BrandIcon from "../../../components/illustrations/BrandIcon";
import ScholarIllustration from "../../../components/illustrations/ScholarIllustration";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-[300px] overflow-hidden bg-[linear-gradient(170deg,#139aa1_0%,#0b6a78_55%,#073f50_100%)] px-6 pt-7 pb-16 text-[#f8f1df] split:min-h-screen split:px-12 split:py-10">
      <ArchPattern className="absolute inset-0 size-full opacity-50" />
      <div className="absolute -bottom-[10%] -end-[10%] aspect-square w-[70%] bg-[radial-gradient(circle,rgba(229,185,79,.35),transparent_62%)]" />
      <ScholarIllustration className="absolute bottom-0 -end-[4%] h-[92%] max-h-[760px] opacity-90 drop-shadow-[0_24px_40px_rgba(0,0,0,.4)] split:end-[3%] split:h-[82%] split:opacity-100" />

      <div className="relative z-[2] flex items-center gap-3">
        <BrandIcon />
        <div>
          <b className="block text-[1.25rem] leading-[1.1] font-extrabold">{t.brand}</b>
          <small className="text-[.85rem] opacity-80">{t.uni}</small>
        </div>
      </div>

      <div className="relative z-[2] mt-[26px] max-w-[480px] split:mt-[clamp(20px,9vh,90px)]">
        <h1 className="mb-3 font-display text-[clamp(2.1rem,4.8vw,3.6rem)] leading-[1.15] font-bold">
          {t.heroA}
          <br />
          {t.heroB}
          <em className="text-gold not-italic">{t.heroEm}</em>
        </h1>
        <p className="hidden max-w-[380px] text-[1.02rem] leading-[1.7] opacity-90 split:block">{t.tag}</p>
      </div>

      <div className="absolute start-6 bottom-[22px] z-[2] hidden text-[.78rem] opacity-75 split:block before:me-2 before:inline-block before:h-0.5 before:w-7 before:bg-gold before:align-middle before:content-['']">
        {t.cap}
      </div>
    </section>
  );
}
