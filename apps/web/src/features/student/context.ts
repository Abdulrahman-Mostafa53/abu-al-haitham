import { createContext, useContext } from "react";
import type { AcademicAlert, Course, Department, Enrollment, ScheduleSlot, Student, Term } from "./types";
import type { Summary } from "./lib";

export interface StudentValue {
  student: Student;
  department: Department;
  courses: Course[];
  enrollments: Enrollment[];
  terms: Term[];
  currentTerm: Term;
  schedule: ScheduleSlot[];
  alerts: AcademicAlert[];
  unread: number;
  summary: Summary; // all graded terms
  courseById: (id: number) => Course;
  departmentById: (id: number) => Department;
  markRead: (id: number) => void;
  markAllRead: () => void;
}

export const StudentContext = createContext<StudentValue | null>(null);

export function useStudent(): StudentValue {
  const ctx = useContext(StudentContext);
  if (!ctx) throw new Error("useStudent must be used inside <StudentProvider>");
  return ctx;
}
