import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../../i18n/context";
import { useAuth } from "../context";
import TextField from "../../../components/ui/TextField";
import type {Role } from "../types";

interface Props {
  role: Role;
  notify: (message: string) => void;
}

const empty = {uid: "", mail: "", pw: ""};

export default function AuthForm({role, notify }: Props) {
  const { t } = useLanguage();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [values, setValues] = useState(empty);
  const [showPw, setShowPw] = useState(false);

  const onChange = (key: keyof typeof empty) => (e: ChangeEvent<HTMLInputElement>) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  const idLabel = t[`id_${role}` as const];

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const id = values.uid.trim();
    const name = values.name.trim();

    if (!id || !values.pw) return notify(t.err);

    // TODO: replace with a real API call (Supabase / your backend)
    login(role);
    navigate("/profile");
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextField
        id="uid"
        label={idLabel}
        autoComplete="username"
        inputMode="email"
        name="university_id"
        value={values.uid}
        onChange={onChange("uid")}
      />

      <TextField
        id="pw"
        label={t.pass}
        type={showPw ? "text" : "password"}
        autoComplete={"current-password"}
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

      <div className="mt-0.5 mb-4 flex items-center justify-between gap-2.5 text-[.86rem]">
        <label className="flex cursor-pointer items-center gap-2">
          <input type="checkbox" defaultChecked className="size-[17px] accent-teal" />
          <span>{t.rem}</span>
        </label>
        <a href="#" className="font-bold text-teal no-underline">
          {t.forgot}
        </a>
      </div>
  
      <button
        type="submit"
        className="flex h-[54px] w-full cursor-pointer items-center justify-between rounded-xl bg-teal-deep px-[22px] text-[1.02rem] font-extrabold text-white transition hover:bg-teal"
      >
        {t.go_in}
        <span aria-hidden="true" className="text-[1.3rem] rtl:-scale-x-100">
          →
        </span>
      </button>
    </form>
  );
}
