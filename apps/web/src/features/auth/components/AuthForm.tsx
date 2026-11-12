import { useState, type ChangeEvent, type FormEvent } from "react";
import { useLanguage } from "../../../i18n/context";
import TextField from "../../../components/ui/TextField";
import type { AuthMode, Role } from "../types";

interface Props {
  mode: AuthMode;
  role: Role;
  notify: (message: string) => void;
}

const empty = { name: "", uid: "", mail: "", pw: "", pw2: "" };

export default function AuthForm({ mode, role, notify }: Props) {
  const { t } = useLanguage();
  const up = mode === "up";
  const [values, setValues] = useState(empty);
  const [showPw, setShowPw] = useState(false);

  const onChange = (key: keyof typeof empty) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const idLabel = up ? t.id_up : t[`id_${role}` as const];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const id = values.uid.trim();
    const name = values.name.trim();

    if (!id || !values.pw || (up && (!name || !values.mail.trim()))) return notify(t.err);
    if (up && values.pw !== values.pw2) return notify(t.err2);

    // TODO: replace with a real API call (see features/auth/api.ts in the guide)
    notify((up ? t.ok_up + name : t.ok_in + id) + " · " + t[role]);
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {up && (
        <TextField id="name" label={t.name} autoComplete="name" value={values.name} onChange={onChange("name")} />
      )}

      <TextField
        id="uid"
        label={idLabel}
        autoComplete="username"
        inputMode="email"
        value={values.uid}
        onChange={onChange("uid")}
      />

      {up && (
        <TextField
          id="mail"
          type="email"
          label={t.mail}
          autoComplete="email"
          placeholder="name@alexu.edu.eg"
          value={values.mail}
          onChange={onChange("mail")}
        />
      )}

      <TextField
        id="pw"
        label={t.pass}
        type={showPw ? "text" : "password"}
        autoComplete={up ? "new-password" : "current-password"}
        value={values.pw}
        onChange={onChange("pw")}
        trailing={
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute end-0 top-1 h-9 w-12 cursor-pointer text-[.78rem] font-bold text-mute"
          >
            {showPw ? t.hide : t.show}
          </button>
        }
      />

      {up && (
        <TextField
          id="pw2"
          type="password"
          label={t.conf}
          autoComplete="new-password"
          value={values.pw2}
          onChange={onChange("pw2")}
        />
      )}

      {up && role === "admin" && (
        <p className="-mt-1 mb-3.5 rounded-[10px] border border-dashed border-gold/50 bg-gold/12 px-3 py-[9px] text-[.8rem] text-mute">
          {t.adm}
        </p>
      )}

      {!up && (
        <div className="mt-0.5 mb-4 flex items-center justify-between gap-2.5 text-[.86rem]">
          <label className="flex cursor-pointer items-center gap-2">
            <input type="checkbox" defaultChecked className="size-[17px] accent-teal" />
            <span>{t.rem}</span>
          </label>
          <a href="#" className="font-bold text-teal no-underline">
            {t.forgot}
          </a>
        </div>
      )}

      <button
        type="submit"
        className="flex h-[54px] w-full cursor-pointer items-center justify-between rounded-xl bg-teal-deep px-[22px] text-[1.02rem] font-extrabold text-white transition hover:bg-teal"
      >
        {up ? t.go_up : t.go_in}
        <span aria-hidden="true" className="text-[1.3rem] rtl:-scale-x-100">
          →
        </span>
      </button>
    </form>
  );
}
