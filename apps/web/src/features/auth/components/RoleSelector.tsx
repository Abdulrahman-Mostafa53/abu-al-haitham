import type { ReactNode } from "react";
import { useLanguage } from "../../../i18n/context";
import { ROLES, type Role } from "../types";

const icons: Record<Role, ReactNode> = {
  student: (
    <>
      <path d="M2 9l10-5 10 5-10 5z" />
      <path d="M6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />
    </>
  ),
  prof: (
    <>
      <path d="M4 5h16v10H4z" />
      <path d="M8 20l4-5 4 5" />
      <path d="M8 9h8" />
    </>
  ),
  admin: (
    <>
      <path d="M12 3l8 3v6c0 4.5-3.2 7.8-8 9-4.8-1.2-8-4.5-8-9V6z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
};

interface Props {
  role: Role;
  onChange: (role: Role) => void;
}

export default function RoleSelector({ role, onChange }: Props) {
  const { t } = useLanguage();

  return (
    <>
      <p className="mb-2 text-[.82rem] font-bold tracking-[.02em] text-mute">{t.iam}</p>
      <div className="mb-6 grid grid-cols-3 gap-3">
        {ROLES.map((r) => {
          const active = role === r;
          return (
            <button
              key={r}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(r)}
              className={`flex cursor-pointer flex-col items-center gap-2 rounded-[999px_999px_14px_14px] border-[1.5px] px-1.5 pt-6 pb-3 text-[.86rem] font-bold transition ${
                active
                  ? "border-[#0a4a5a] bg-[linear-gradient(180deg,#0f7f89,#0a4a5a)] text-white"
                  : "border-line bg-transparent text-mute"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                className={`size-[26px] ${active ? "text-gold" : ""}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {icons[r]}
              </svg>
              <span>{t[r]}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
