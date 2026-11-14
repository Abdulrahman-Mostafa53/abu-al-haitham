import { useNavigate } from "react-router-dom";
import Icon from "../ui/Icon";
import { useLanguage } from "../../i18n/context";
import { useTheme } from "../../theme/context";
import { useAuth } from "../../features/auth/context";
import { useStudent } from "../../features/student/context";

const btn =
  "relative inline-flex h-10 min-w-10 cursor-pointer items-center justify-center rounded-xl border border-line bg-card px-3 font-bold transition hover:border-teal";

interface Props {
  query: string;
  onQuery: (q: string) => void;
}

export default function Topbar({ query, onQuery }: Props) {
  const { t, lang, toggleLang } = useLanguage();
  const { toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { student, department, unread } = useStudent();
  const navigate = useNavigate();

  const initials =
    lang === "ar"
      ? student.name.ar.split(" ").map((w) => w[0]).join(".")
      : student.name.en.split(" ").map((w) => w[0]).join("");

  return (
    <div className="flex items-center gap-3 py-5">
      <label className="flex h-11 flex-1 items-center gap-2.5 border-b-[1.5px] border-line text-mute transition focus-within:border-gold">
        <Icon><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></Icon>
        <input
          value={query}
          onChange={(e) => onQuery(e.target.value)}
          placeholder={t.ph}
          className="w-full min-w-0 border-0 bg-transparent text-ink outline-none"
        />
      </label>

      <button type="button" className={btn} onClick={toggleLang} aria-label="Language">{t.langBtn}</button>
      <button type="button" className={btn} onClick={toggleTheme} aria-label="Toggle theme">◐</button>
      <button type="button" className={btn} onClick={() => navigate("/alerts")} aria-label={t.n_al}>
        <Icon><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4" /></Icon>
        {unread > 0 && <span className="absolute end-[9px] top-2 size-[7px] rounded-full bg-gold" />}
      </button>
      <button
        type="button"
        className={btn}
        onClick={() => { logout(); navigate("/login"); }}
        aria-label={t.signout}
        title={t.signout}
      >
        <Icon><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" /></Icon>
      </button>

      <div className="ms-1.5 flex items-center gap-2.5">
        <div className="grid size-10 place-items-center rounded-[999px_999px_12px_12px] bg-[linear-gradient(180deg,#0f7f89,#0a4a5a)] text-[.8rem] font-extrabold text-gold">
          {initials}
        </div>
        <div className="hidden split:block">
          <b className="block text-[.9rem] leading-snug">{student.name[lang]}</b>
          <small className="text-[.76rem] text-mute">
            {department.name[lang]} · {t.lv}{student.level}
          </small>
        </div>
      </div>
    </div>
  );
}
