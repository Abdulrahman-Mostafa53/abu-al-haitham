import type { Course, Enrollment } from "./types";

/** Letter grade -> grade points (fake scale, replace with your faculty's) */
export const GRADE_POINTS: Record<string, number> = {
  "A+": 4, A: 4, "A-": 3.7, "B+": 3.3, B: 3, "B-": 2.7, "C+": 2.3, C: 2, "C-": 1.7, "D+": 1.3, D: 1, F: 0,
};

export interface Summary { gpa: number; attempted: number; earned: number; registered: number }

export function summarize(list: Enrollment[], courseById: (id: number) => Course): Summary {
  let pts = 0, attempted = 0, earned = 0, registered = 0;
  for (const e of list) {
    const c = courseById(e.course_id);
    registered += c.credits;
    if (e.grade) {
      const p = GRADE_POINTS[e.grade];
      attempted += c.credits;
      pts += p * c.credits;
      if (p > 0) earned += c.credits;
    }
  }
  return { gpa: attempted ? pts / attempted : 0, attempted, earned, registered };
}

export const matches = (query: string, ...parts: string[]) =>
  !query.trim() || parts.join(" ").toLowerCase().includes(query.trim().toLowerCase());

export function addDays(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
