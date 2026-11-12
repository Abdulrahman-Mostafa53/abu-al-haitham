import { useLanguage } from "../../i18n/context";
import { useTheme } from "../../theme/context";

const btn =
  "inline-flex h-10 min-w-10 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-line bg-card px-3 font-bold transition hover:border-teal";

export default function Toolbar() {
  const { t, toggleLang } = useLanguage();
  const { toggleTheme } = useTheme();

  return (
    <div className="mb-1.5 flex justify-end gap-2 self-stretch split:absolute split:end-7 split:top-[calc(20px+env(safe-area-inset-top,0px))] split:mb-0 split:self-auto">
      <button type="button" className={btn} onClick={toggleLang} aria-label="Language">
        {t.langBtn}
      </button>
      <button type="button" className={btn} onClick={toggleTheme} aria-label="Toggle theme">
        ◐
      </button>
    </div>
  );
}
