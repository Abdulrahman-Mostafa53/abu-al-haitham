import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";
import ArchPattern from "../illustrations/ArchPattern";
import BrandIcon from "../illustrations/BrandIcon";
import Icon from "../ui/Icon";
import { useLanguage } from "../../i18n/context";
import { useStudent } from "../../features/student/context";
import type { Dict } from "../../i18n/translations";

interface Item {
  to: string;
  label: keyof Dict;
  hint?: keyof Dict;
  icon: ReactNode;
}

const items: Item[] = [
  { to: "/profile", label: "n_pf", hint: "n_pfs", icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></> },
  { to: "/courses", label: "n_co", hint: "n_cos", icon: <><path d="M4 5a2 2 0 0 1 2-2h12v16H6a2 2 0 0 0-2 2z" /><path d="M8 7h6M8 11h6" /></> },
  { to: "/grades", label: "n_gr", hint: "n_grs", icon: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /> },
  { to: "/schedule", label: "n_sc", hint: "n_scs", icon: <><rect x="3" y="5" width="18" height="16" rx="3" /><path d="M3 10h18M8 3v4M16 3v4" /></> },
  { to: "/alerts", label: "n_al", icon: <><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18h.01" /></> },
];

export default function Sidebar() {
  const { t } = useLanguage();
  const { unread } = useStudent();

  return (
    <aside className="relative flex flex-col overflow-hidden bg-brand-gradient p-4 text-[#f8f1df] split:sticky split:top-0 split:h-screen split:px-[18px] split:py-6">
      <ArchPattern className="absolute inset-0 size-full opacity-50" />

      <div className="relative mb-3 flex items-center gap-3 split:mb-[34px]">
        <BrandIcon size={48} />
        <div>
          <b className="block font-display text-[1.5rem] leading-tight">{t.brand}</b>
          <small className="text-[.82rem] opacity-80">{t.portalSub}</small>
        </div>
      </div>

      <div className="relative mx-3 mb-2.5 hidden text-[.78rem] opacity-65 split:block">{t.ws}</div>

      <nav className="relative flex gap-0.5 overflow-x-auto split:flex-col split:overflow-visible">
        {items.map((it) => (
          <NavLink
            key={it.to}
            to={it.to}
            className={({ isActive }) =>
              `relative flex flex-none items-center gap-3 rounded-xl px-3 py-[11px] font-semibold no-underline transition hover:bg-white/8 hover:opacity-100 ${
                isActive
                  ? "bg-white/13 opacity-100 before:absolute before:inset-y-[9px] before:start-0 before:w-[3px] before:rounded-[3px] before:bg-gold before:content-[''] [&_svg]:text-gold"
                  : "opacity-80"
              }`
            }
          >
            <Icon>{it.icon}</Icon>
            <span>{t[it.label] as string}</span>
            {it.hint && <small className="ms-auto hidden text-[.72rem] font-normal opacity-65 split:inline">{t[it.hint] as string}</small>}
            {it.to === "/alerts" && unread > 0 && (
              <span className="ms-auto rounded-full bg-gold px-2 text-[.72rem] font-extrabold text-[#3b2a00]">{unread}</span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative mt-auto hidden rounded-xl border border-dashed border-gold/55 bg-gold/12 p-3.5 text-[.84rem] split:block">
        <h3 className="mb-0.5 font-display text-[1.15rem] font-bold">{t.hp}</h3>
        <p className="mb-2 leading-relaxed opacity-85">{t.hpp}</p>
        <a href="mailto:studentaffairs@alexu.edu.eg" className="font-bold text-gold no-underline [overflow-wrap:anywhere]">
          studentaffairs@alexu.edu.eg
        </a>
      </div>
    </aside>
  );
}
