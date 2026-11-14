import { usePortalContext } from "../components/layout/portalContext";
import GradePill from "../components/ui/GradePill";
import PageHeader from "../components/ui/PageHeader";
import StatStrip from "../components/ui/StatStrip";
import { Code, Table, Td, Th } from "../components/ui/Table";
import { REQUIRED_HOURS } from "../data/mock";
import { useStudent } from "../features/student/context";
import { GRADE_POINTS, matches, summarize } from "../features/student/lib";
import { usePageTitle } from "../hooks/usePageTitle";
import { useLanguage } from "../i18n/context";

export default function GradesPage() {
  const { t, lang } = useLanguage();
  const { query } = usePortalContext();
  const { terms, currentTerm, enrollments, courseById, summary } = useStudent();
  usePageTitle(t.n_gr);

  return (
    <>
      <PageHeader title={t.g_t} subtitle={t.g_sub} />

      <StatStrip
        items={[
          { label: t.g_cum, value: summary.gpa.toFixed(2), note: t.s_gpad },
          { label: t.g_att, value: summary.attempted, note: t.u, gold: true },
          { label: t.s_hrs, value: summary.earned, note: t.s_hrsd.replace("{n}", String(REQUIRED_HOURS)) },
        ]}
      />

      {[...terms].reverse().map((term) => {
        const list = enrollments.filter((e) => e.term === term.id);
        const sum = summarize(list, courseById);
        const done = term.id !== currentTerm.id;
        const rows = list.filter((e) => {
          const c = courseById(e.course_id);
          return matches(query, c.code, c.name.en, c.name.ar, e.grade ?? "");
        });

        return (
          <section key={term.id}>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="font-display text-[1.45rem] font-bold rtl:text-[1.15rem]">{term.name[lang]}</h3>
              <span className="text-[.86rem] font-semibold text-mute">
                {done && <>{t.g_tg} <b className="text-ink">{sum.gpa.toFixed(2)}</b> · </>}
                {sum.registered} {t.u}
              </span>
            </div>

            <Table
              head={
                <>
                  <Th>{t.th_code}</Th>
                  <Th>{t.th_course}</Th>
                  <Th center>{t.th_cr}</Th>
                  <Th center>{t.th_grade}</Th>
                  <Th center>{t.th_pts}</Th>
                  <Th>{t.th_st}</Th>
                </>
              }
            >
              {rows.map((e) => {
                const c = courseById(e.course_id);
                const pts = e.grade ? GRADE_POINTS[e.grade] : null;
                return (
                  <tr key={e.course_id}>
                    <Td><Code>{c.code}</Code></Td>
                    <Td><b>{c.name[lang]}</b></Td>
                    <Td center>{c.credits}</Td>
                    <Td center><GradePill grade={e.grade} /></Td>
                    <Td center>{pts === null ? "—" : pts.toFixed(1)}</Td>
                    <Td>{pts === null ? t.g_ip : pts > 0 ? t.g_ps : t.g_fl}</Td>
                  </tr>
                );
              })}
            </Table>
          </section>
        );
      })}
    </>
  );
}
