import type { ReactNode } from "react";
import Icon from "../../../components/ui/Icon";
import { useLanguage } from "../../../i18n/context";
import { useFormat } from "../../../i18n/useFormat";
import { useStudent } from "../context";
import { addDays } from "../lib";
import type { AcademicAlert, AlertKind } from "../types";

const icons: Record<AlertKind, ReactNode> = {
  warn: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18h.01" /></>,
  due: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7.5h.01" /></>,
};

const tone: Record<AlertKind, string> = {
  warn: "border-[#d9822b] bg-[#d9822b]/12 text-[#d9822b]",
  due: "border-gold bg-gold/14 text-gold-deep",
  info: "border-line text-mute",
};

export default function AlertItem({ alert }: { alert: AcademicAlert }) {
  const { t, lang } = useLanguage();
  const { date, relativeDays } = useFormat();
  const { markRead } = useStudent();

  return (
    <article className="grid grid-cols-[44px_1fr] items-start gap-4 border-b border-line py-5 split:grid-cols-[44px_1fr_auto]">
      <div className={`grid size-10 place-items-center rounded-[999px_999px_10px_10px] border-[1.5px] ${tone[alert.kind]}`}>
        <Icon>{icons[alert.kind]}</Icon>
      </div>

      <div>
        <h3
          className={`text-[1.02rem] font-bold ${
            alert.read ? "" : "after:ms-2 after:inline-block after:size-2 after:rounded-full after:bg-gold after:content-['']"
          }`}
        >
          {alert.title[lang]}
        </h3>
        <p className="mt-1 max-w-[620px] text-[.88rem] leading-[1.65] text-mute">{alert.body[lang]}</p>
      </div>

      <div className="col-start-2 min-w-[120px] text-start text-[.8rem] text-mute split:col-start-auto split:text-end">
        <b className="block text-[.86rem] text-ink">{relativeDays(alert.daysFromNow)}</b>
        {date(addDays(alert.daysFromNow), { day: "numeric", month: "short" })}
        {!alert.read && (
          <button
            type="button"
            onClick={() => markRead(alert.id)}
            className="mt-1.5 block cursor-pointer border-0 bg-transparent p-0 text-[.78rem] font-bold text-teal split:ms-auto"
          >
            {t.mk}
          </button>
        )}
      </div>
    </article>
  );
}
