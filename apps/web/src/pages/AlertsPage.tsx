import { useState } from "react";
import { usePortalContext } from "../components/layout/portalContext";
import PageHeader from "../components/ui/PageHeader";
import AlertItem from "../features/student/components/AlertItem";
import { useStudent } from "../features/student/context";
import { matches } from "../features/student/lib";
import type { AlertKind } from "../features/student/types";
import { usePageTitle } from "../hooks/usePageTitle";
import { useLanguage } from "../i18n/context";

type Filter = "all" | AlertKind;
const filters: Filter[] = ["all", "warn", "due", "info"];

export default function AlertsPage() {
  const { t } = useLanguage();
  const { query } = usePortalContext();
  const { alerts, unread, markAllRead } = useStudent();
  const [filter, setFilter] = useState<Filter>("all");
  usePageTitle(t.n_al);

  const list = alerts
    .filter((a) => filter === "all" || a.kind === filter)
    .filter((a) => matches(query, a.title.en, a.title.ar, a.body.en, a.body.ar))
    .sort((a, b) => Number(a.read) - Number(b.read) || a.daysFromNow - b.daysFromNow);

  return (
    <>
      <PageHeader
        title={t.a_t}
        subtitle={t.a_sub}
        action={
          unread > 0 && (
            <button type="button" onClick={markAllRead} className="cursor-pointer border-0 bg-transparent text-[.88rem] font-bold text-teal">
              {t.mka}
            </button>
          )
        }
      />

      <div className="mb-1.5 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
            className={`cursor-pointer rounded-full border-[1.5px] px-4 py-[5px] text-[.84rem] font-bold ${
              filter === f
                ? "border-[#0a4a5a] bg-[linear-gradient(180deg,#0f7f89,#0a4a5a)] text-white"
                : "border-line bg-transparent text-mute"
            }`}
          >
            {t[`f_${f}` as const]}
          </button>
        ))}
      </div>

      {list.length ? list.map((a) => <AlertItem key={a.id} alert={a} />) : <div className="py-10 text-center text-mute">{t.none}</div>}
    </>
  );
}
