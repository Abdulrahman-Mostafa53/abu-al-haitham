import { usePortalContext } from "../components/layout/portalContext";
import PageHeader from "../components/ui/PageHeader";
import { Code, Table, Td, Th } from "../components/ui/Table";
import { useStudent } from "../features/student/context";
import { matches } from "../features/student/lib";
import { usePageTitle } from "../hooks/usePageTitle";
import { useLanguage } from "../i18n/context";

export default function CoursesPage() {
  const { t, lang } = useLanguage();
  const { query } = usePortalContext();
  const { enrollments, currentTerm, courseById, departmentById } = useStudent();
  usePageTitle(t.n_co);

  const current = enrollments.filter((e) => e.term === currentTerm.id).map((e) => courseById(e.course_id));
  const total = current.reduce((sum, c) => sum + c.credits, 0);
  const sep = lang === "ar" ? "، " : ", ";

  const rows = current.filter((c) => matches(query, c.code, c.name.en, c.name.ar));

  return (
    <>
      <PageHeader
        title={t.c_t}
        subtitle={t.c_sub.replace("{t}", currentTerm.name[lang]).replace("{n}", String(current.length))}
      />

      <Table
        head={
          <>
            <Th>{t.th_code}</Th>
            <Th>{t.th_course}</Th>
            <Th>{t.th_dept}</Th>
            <Th center>{t.th_cr}</Th>
            <Th>{t.th_pre}</Th>
          </>
        }
        foot={
          <tfoot>
            <tr className="bg-teal/7 font-extrabold">
              <Td colSpan={3}>{t.c_tot}</Td>
              <Td center>{total}</Td>
              <Td />
            </tr>
          </tfoot>
        }
      >
        {rows.map((c) => (
          <tr key={c.id}>
            <Td><Code>{c.code}</Code></Td>
            <Td><b>{c.name[lang]}</b></Td>
            <Td>{departmentById(c.department).name[lang]}</Td>
            <Td center>{c.credits}</Td>
            <Td>{c.prerequisites.length ? c.prerequisites.map((p) => courseById(p).code).join(sep) : "—"}</Td>
          </tr>
        ))}
      </Table>

      <p className="text-[.8rem] text-mute">{t.c_note}</p>
    </>
  );
}
