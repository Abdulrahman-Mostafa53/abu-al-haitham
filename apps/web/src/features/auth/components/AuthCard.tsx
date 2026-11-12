import { useEffect, useState } from "react";
import { useLanguage } from "../../../i18n/context";
import AuthForm from "./AuthForm";
import ModeTabs from "./ModeTabs";
import RoleSelector from "./RoleSelector";
import type { AuthMode, Role } from "../types";

export default function AuthCard({ notify }: { notify: (message: string) => void }) {
  const { t } = useLanguage();
  const [mode, setMode] = useState<AuthMode>("in");
  const [role, setRole] = useState<Role>("student");
  const up = mode === "up";

  useEffect(() => {
    document.title = `${t.brand} · ${up ? t.signup : t.signin}`;
  }, [t, up]);

  return (
    <div className="w-full max-w-[420px] px-1 py-1.5">
      <ModeTabs mode={mode} onChange={setMode} />

      <h2 className="mb-1 font-display text-[2.1rem] font-bold after:mt-2.5 after:block after:h-[3px] after:w-11 after:rounded-[3px] after:bg-gold after:content-['']">
        {up ? t.t_up : t.t_in}
      </h2>
      <p className="mt-3 mb-4 text-[.92rem] text-mute">{up ? t.s_up : t.s_in}</p>

      <RoleSelector role={role} onChange={setRole} />
      <AuthForm mode={mode} role={role} notify={notify} />

      <p className="mt-[18px] text-center text-[.78rem] text-mute">{t.foot}</p>
    </div>
  );
}
