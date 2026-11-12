import { useLanguage } from "../../../i18n/context";
import type { AuthMode } from "../types";

interface Props {
  mode: AuthMode;
  onChange: (mode: AuthMode) => void;
}

export default function ModeTabs({ mode, onChange }: Props) {
  const { t } = useLanguage();
  const tabs: { id: AuthMode; label: string }[] = [
    { id: "in", label: t.signin },
    { id: "up", label: t.signup },
  ];

  return (
    <div role="tablist" className="mb-[26px] flex gap-7 border-b border-line">
      {tabs.map((tab) => {
        const active = mode === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={`relative cursor-pointer pb-3 text-base font-bold ${
              active
                ? "text-ink after:absolute after:inset-x-0 after:-bottom-px after:h-[3px] after:rounded-t-[3px] after:bg-gold after:content-['']"
                : "text-mute"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
