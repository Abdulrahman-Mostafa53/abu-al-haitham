/** Shapes mirror the Supabase tables (departments, students, courses, enrollments).
 *  Fields marked (*) do not exist in the database yet. */
export type Localized = { en: string; ar: string };

export interface Department { id: number; code: string; name: Localized } // name_ar needed in DB
export interface Student {
  id: number;
  university_id: number;
  created_at: string;
  name: Localized;
  email: string;
  gender: "male" | "female";
  nationality: "egyptian";
  date_of_birth: string;
  phone_number: string;
  national_id: string;
  department: number;
  level: number; // (*)
}
export interface Course { id: number; code: string; department: number; credits: number; prerequisites: number[]; name: Localized }
export interface Enrollment { student_id: number; course_id: number; grade: string | null; term: string } // term (*)
export interface Term { id: string; name: Localized }

export type ClassType = "lec" | "tut" | "lab";
export interface ScheduleSlot { day: number; period: number; course_id: number; type: ClassType; room: { kind: "H" | "R" | "L"; label: string } } // (*)

export type AlertKind = "warn" | "due" | "info";
export interface AcademicAlert { id: number; kind: AlertKind; daysFromNow: number; read: boolean; title: Localized; body: Localized } // (*)
