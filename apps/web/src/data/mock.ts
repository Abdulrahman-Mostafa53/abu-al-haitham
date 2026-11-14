/** FAKE DATA. Replace each export with a Supabase query later (see features/student/StudentProvider.tsx). */
import type { AcademicAlert, Course, Department, Enrollment, ScheduleSlot, Student, Term } from "../features/student/types";

export const REQUIRED_HOURS = 160;
export const CURRENT_TERM = "26F";
export const PERIODS: [string, string][] = [["09:00", "10:30"], ["10:45", "12:15"], ["12:30", "14:00"], ["14:15", "15:45"], ["16:00", "17:30"]];

export const departments: Department[] = [
  { id: 1, code: "MEC", name: { en: "Mechanical Engineering", ar: "الهندسة الميكانيكية" } },
  { id: 2, code: "BSC", name: { en: "Basic Sciences", ar: "العلوم الأساسية" } },
  { id: 3, code: "ELE", name: { en: "Electrical & Computer Eng.", ar: "الهندسة الكهربية والحاسبات" } },
  { id: 4, code: "HUM", name: { en: "Humanities", ar: "العلوم الإنسانية" } },
];

export const student: Student = {
  id: 1,
  university_id: 20250137,
  created_at: "2025-09-14",
  name: { en: "Omar Ahmed", ar: "عمر أحمد" },
  email: "omar.ahmed@alexu.edu.eg",
  gender: "male",
  nationality: "egyptian",
  date_of_birth: "2005-03-18",
  phone_number: "+20 100 123 0137",
  national_id: "30503180214573",
  department: 1,
  level: 2,
};

type CourseRow = [number, string, number, number, number[], string, string];
const courseRows: CourseRow[] = [
  [1, "MTH101", 2, 3, [], "Calculus I", "تفاضل وتكامل (1)"],
  [2, "PHY101", 2, 3, [], "Physics I", "فيزياء (1)"],
  [3, "CHM101", 2, 2, [], "Engineering Chemistry", "كيمياء هندسية"],
  [4, "MEC101", 1, 3, [], "Engineering Drawing", "رسم هندسي"],
  [5, "CSE101", 3, 3, [], "Introduction to Programming", "مقدمة في البرمجة"],
  [6, "HUM101", 4, 2, [], "Technical English", "لغة إنجليزية فنية"],
  [7, "MTH102", 2, 3, [1], "Calculus II", "تفاضل وتكامل (2)"],
  [8, "PHY102", 2, 3, [2], "Physics II", "فيزياء (2)"],
  [9, "MEC102", 1, 3, [2], "Engineering Mechanics (Statics)", "ميكانيكا هندسية (استاتيكا)"],
  [10, "MEC103", 1, 2, [], "Workshop Technology", "تكنولوجيا الورش"],
  [11, "ELE101", 3, 3, [2], "Electrical Circuits I", "دوائر كهربية (1)"],
  [12, "HUM102", 4, 2, [], "Ethics & Human Rights", "أخلاقيات المهنة وحقوق الإنسان"],
  [13, "MTH201", 2, 3, [7], "Differential Equations", "المعادلات التفاضلية"],
  [14, "ELE201", 3, 3, [11], "Electrical Circuits II", "دوائر كهربية (2)"],
  [15, "MEC201", 1, 3, [8], "Thermodynamics I", "ديناميكا حرارية (1)"],
  [16, "MEC202", 1, 3, [9], "Dynamics", "ديناميكا"],
  [17, "MEC203", 1, 3, [9], "Strength of Materials", "مقاومة المواد"],
  [18, "ELE202", 3, 1, [11], "Circuits Laboratory", "معمل الدوائر"],
];
export const courses: Course[] = courseRows.map(([id, code, department, credits, prerequisites, en, ar]) => ({
  id, code, department, credits, prerequisites, name: { en, ar },
}));

type EnrollRow = [number, string | null, string];
const enrollRows: EnrollRow[] = [
  [1, "A-", "25F"], [2, "B+", "25F"], [3, "B", "25F"], [4, "A", "25F"], [5, "A", "25F"], [6, "A-", "25F"],
  [7, "B+", "26S"], [8, "B", "26S"], [9, "A-", "26S"], [10, "A", "26S"], [11, "B+", "26S"], [12, "A", "26S"],
  [13, null, "26F"], [14, null, "26F"], [15, null, "26F"], [16, null, "26F"], [17, null, "26F"], [18, null, "26F"],
];
export const enrollments: Enrollment[] = enrollRows.map(([course_id, grade, term]) => ({ student_id: 1, course_id, grade, term }));

export const terms: Term[] = [
  { id: "25F", name: { en: "Fall 2025", ar: "الفصل الدراسي الأول 2025/2026" } },
  { id: "26S", name: { en: "Spring 2026", ar: "الفصل الدراسي الثاني 2025/2026" } },
  { id: "26F", name: { en: "Fall 2026", ar: "الفصل الدراسي الأول 2026/2027" } },
];

/** day: 0 = Saturday … 5 = Thursday (Egyptian week) */
export const schedule: ScheduleSlot[] = [
  { day: 0, period: 0, course_id: 14, type: "lec", room: { kind: "H", label: "A3" } },
  { day: 0, period: 1, course_id: 13, type: "lec", room: { kind: "H", label: "B1" } },
  { day: 0, period: 3, course_id: 17, type: "tut", room: { kind: "R", label: "204" } },
  { day: 1, period: 0, course_id: 15, type: "lec", room: { kind: "H", label: "A2" } },
  { day: 1, period: 1, course_id: 16, type: "lec", room: { kind: "H", label: "A2" } },
  { day: 1, period: 3, course_id: 18, type: "lab", room: { kind: "L", label: "C2" } },
  { day: 2, period: 0, course_id: 17, type: "lec", room: { kind: "H", label: "B2" } },
  { day: 2, period: 2, course_id: 13, type: "tut", room: { kind: "R", label: "108" } },
  { day: 2, period: 3, course_id: 16, type: "tut", room: { kind: "R", label: "204" } },
  { day: 3, period: 0, course_id: 14, type: "tut", room: { kind: "R", label: "210" } },
  { day: 3, period: 1, course_id: 15, type: "tut", room: { kind: "R", label: "204" } },
  { day: 4, period: 0, course_id: 13, type: "lec", room: { kind: "H", label: "B1" } },
  { day: 4, period: 2, course_id: 15, type: "lec", room: { kind: "H", label: "A2" } },
  { day: 5, period: 1, course_id: 16, type: "lec", room: { kind: "H", label: "A2" } },
  { day: 5, period: 2, course_id: 14, type: "lec", room: { kind: "H", label: "A3" } },
];

export const alerts: AcademicAlert[] = [
  { id: 1, kind: "warn", daysFromNow: -1, read: false,
    title: { en: "Attendance warning — Strength of Materials", ar: "إنذار غياب — مقاومة المواد" },
    body: { en: "You have missed 3 of 14 sessions (21%). Reaching 25% means exclusion from the final exam.", ar: "تغيبت عن 3 من 14 محاضرة (21%). عند بلوغ نسبة الغياب 25% يُحرم الطالب من دخول الامتحان النهائي." } },
  { id: 2, kind: "due", daysFromNow: 1, read: false,
    title: { en: "Circuits Laboratory — report due", ar: "تسليم تقرير معمل الدوائر" },
    body: { en: "Experiment 4 report must be submitted to the lab engineer before 14:00.", ar: "يجب تسليم تقرير التجربة الرابعة للمهندس المسؤول عن المعمل قبل الساعة 14:00." } },
  { id: 3, kind: "due", daysFromNow: 3, read: false,
    title: { en: "Add / drop period ends", ar: "انتهاء فترة الحذف والإضافة" },
    body: { en: "Last day to change your registered courses without a late fee.", ar: "آخر يوم لتعديل المقررات المسجلة دون غرامة تأخير." } },
  { id: 4, kind: "due", daysFromNow: 6, read: false,
    title: { en: "Midterm exam — Differential Equations", ar: "امتحان منتصف الفصل — المعادلات التفاضلية" },
    body: { en: "Hall B1 · 12:30 – 14:00. Bring your university ID card.", ar: "مدرج B1 · من 12:30 إلى 14:00. يرجى إحضار بطاقة الرقم الجامعي." } },
  { id: 5, kind: "due", daysFromNow: 9, read: true,
    title: { en: "Tuition fees — second instalment", ar: "استحقاق القسط الثاني من المصروفات" },
    body: { en: "Pay at the faculty cashier or through the online payment service.", ar: "السداد من خلال خزينة الكلية أو خدمة الدفع الإلكتروني." } },
  { id: 6, kind: "info", daysFromNow: -2, read: true,
    title: { en: "Transcript request is ready", ar: "طلب كشف الدرجات جاهز" },
    body: { en: "Collect your official transcript from the Student Affairs office.", ar: "يمكنك استلام كشف الدرجات الرسمي من مكتب شئون الطلاب." } },
];
