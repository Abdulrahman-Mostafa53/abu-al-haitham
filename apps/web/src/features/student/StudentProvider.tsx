import { useMemo, useState, type ReactNode } from "react";
import * as mock from "../../data/mock";
import { StudentContext, type StudentValue } from "./context";
import { summarize } from "./lib";

/** Single place that loads the student's data.
 *  Today: fake data. Later: fetch from Supabase / your backend here (React Query, useEffect, etc.). */
export function StudentProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState(mock.alerts);

  const value = useMemo<StudentValue>(() => {
    const courseById = (id: number) => mock.courses.find((c) => c.id === id)!;
    const departmentById = (id: number) => mock.departments.find((d) => d.id === id)!;
    return {
      student: mock.student,
      department: departmentById(mock.student.department),
      courses: mock.courses,
      enrollments: mock.enrollments,
      terms: mock.terms,
      currentTerm: mock.terms.find((t) => t.id === mock.CURRENT_TERM)!,
      schedule: mock.schedule,
      alerts,
      unread: alerts.filter((a) => !a.read).length,
      summary: summarize(mock.enrollments, courseById),
      courseById,
      departmentById,
      markRead: (id) => setAlerts((list) => list.map((a) => (a.id === id ? { ...a, read: true } : a))),
      markAllRead: () => setAlerts((list) => list.map((a) => ({ ...a, read: true }))),
    };
  }, [alerts]);

  return <StudentContext.Provider value={value}>{children}</StudentContext.Provider>;
}
