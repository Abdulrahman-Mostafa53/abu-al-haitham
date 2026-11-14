import { Link } from "react-router-dom";
import KeyValueList from "../components/ui/KeyValueList";
import SectionTitle from "../components/ui/SectionTitle";
import StatStrip from "../components/ui/StatStrip";
import { REQUIRED_HOURS } from "../data/mock";
import DegreePanel from "../features/student/components/DegreePanel";
import ProfileBanner from "../features/student/components/ProfileBanner";
import { useStudent } from "../features/student/context";
import { usePageTitle } from "../hooks/usePageTitle";
import { useLanguage } from "../i18n/context";
import { useFormat } from "../i18n/useFormat";

export default function ProfilePage() {
  const { t, lang } = useLanguage();
  const { date } = useFormat();
  const { student: s, department, summary, enrollments, currentTerm, courseById, unread } = useStudent();
  usePageTitle(t.n_pf);

  const termHours = enrollments
    .filter((e) => e.term === currentTerm.id)
    .reduce((sum, e) => sum + courseById(e.course_id).credits, 0);
  const longDate: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };

  return (
    <>
      <ProfileBanner />

      <StatStrip
        items={[
          { label: t.s_gpa, value: summary.gpa.toFixed(2), note: t.s_gpad },
          { label: t.s_hrs, value: summary.earned, note: t.s_hrsd.replace("{n}", String(REQUIRED_HOURS)), gold: true },
          { label: t.s_trm, value: termHours, note: t.s_trmd },
          { label: t.s_al, value: unread, note: <Link to="/alerts">{t.s_ald}</Link> },
        ]}
      />

      <section className="grid items-start gap-9 wide:grid-cols-[1.55fr_1fr] wide:gap-11">
        <div>
          <SectionTitle className="mb-3.5">{t.t_pers}</SectionTitle>
          <KeyValueList
            items={[
              [t.l_name, s.name[lang]],
              [t.l_uid, s.university_id],
              [t.l_nid, s.national_id],
              [t.l_gen, t[s.gender]],
              [t.l_nat, t[s.nationality]],
              [t.l_dob, date(s.date_of_birth, longDate)],
              [t.l_ph, <span dir="ltr">{s.phone_number}</span>],
              [t.l_mail, <span dir="ltr">{s.email}</span>],
            ]}
          />

          <SectionTitle className="mb-3.5">{t.t_acad}</SectionTitle>
          <KeyValueList
            items={[
              [t.l_dept, department.name[lang]],
              [t.l_fac, t.v_fac],
              [t.l_lvl, `${t.lv}${s.level}`],
              [t.l_prog, t.v_prog],
              [t.l_join, date(s.created_at, longDate)],
              [t.l_stand, t.v_stand],
            ]}
          />
        </div>

        <DegreePanel />
      </section>
    </>
  );
}
