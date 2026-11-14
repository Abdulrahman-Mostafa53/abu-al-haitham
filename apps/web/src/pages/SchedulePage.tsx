import PageHeader from "../components/ui/PageHeader";
import { useStudent } from "../features/student/context";
import ScheduleGrid, { ClassTag } from "../features/student/components/ScheduleGrid";
import { usePageTitle } from "../hooks/usePageTitle";
import { useLanguage } from "../i18n/context";

export default function SchedulePage() {
  const { t, lang } = useLanguage();
  const { currentTerm } = useStudent();
  usePageTitle(t.n_sc);

  return (
    <>
      <PageHeader title={t.s_t} subtitle={t.s_sub.replace("{t}", currentTerm.name[lang])} />
      <ScheduleGrid />
      <div className="-mt-[18px] mb-[34px] flex flex-wrap gap-2.5">
        <ClassTag type="lec" />
        <ClassTag type="tut" />
        <ClassTag type="lab" />
      </div>
    </>
  );
}
