// ─────────────────────────────────────────────
//  Dummy admin data for Phase 3
// ─────────────────────────────────────────────
import { EXAMS, ALL_QUESTIONS, type Exam, type Question } from "./examData";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  avatar: string;
  status: "active" | "inactive" | "suspended";
  registeredAt: string;
  examsAttempted: number;
  lastActive: string;
}

export interface ExamResult {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  examId: string;
  examTitle: string;
  score: number;
  maxScore: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTakenMins: number;
  submittedAt: string;
  status: "passed" | "failed";
}

// ─── Users ───────────────────────────────────
export const ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-001",
    name: "Dr. Sarah Mitchell",
    email: "admin@toeflexam.edu",
    role: "admin",
    avatar: "SM",
    status: "active",
    registeredAt: "Jan 10, 2026",
    examsAttempted: 0,
    lastActive: "Today",
  },
  {
    id: "admin-002",
    name: "Prof. James Harrington",
    email: "jharrington@toeflexam.edu",
    role: "admin",
    avatar: "JH",
    status: "active",
    registeredAt: "Jan 10, 2026",
    examsAttempted: 0,
    lastActive: "Yesterday",
  },
  {
    id: "user-001",
    name: "Alex Johnson",
    email: "alex.johnson@student.edu",
    role: "user",
    avatar: "AJ",
    status: "active",
    registeredAt: "Sep 1, 2026",
    examsAttempted: 3,
    lastActive: "Today",
  },
  {
    id: "user-002",
    name: "Maria Garcia",
    email: "maria.garcia@student.edu",
    role: "user",
    avatar: "MG",
    status: "active",
    registeredAt: "Sep 5, 2026",
    examsAttempted: 2,
    lastActive: "Oct 11, 2026",
  },
  {
    id: "user-003",
    name: "Chen Wei",
    email: "chen.wei@student.edu",
    role: "user",
    avatar: "CW",
    status: "active",
    registeredAt: "Sep 8, 2026",
    examsAttempted: 1,
    lastActive: "Oct 9, 2026",
  },
  {
    id: "user-004",
    name: "Priya Sharma",
    email: "priya.sharma@student.edu",
    role: "user",
    avatar: "PS",
    status: "inactive",
    registeredAt: "Sep 12, 2026",
    examsAttempted: 0,
    lastActive: "Sep 30, 2026",
  },
  {
    id: "user-005",
    name: "Lucas Oliveira",
    email: "lucas.oliveira@student.edu",
    role: "user",
    avatar: "LO",
    status: "active",
    registeredAt: "Sep 15, 2026",
    examsAttempted: 2,
    lastActive: "Oct 12, 2026",
  },
  {
    id: "user-006",
    name: "Yuna Kim",
    email: "yuna.kim@student.edu",
    role: "user",
    avatar: "YK",
    status: "suspended",
    registeredAt: "Sep 20, 2026",
    examsAttempted: 1,
    lastActive: "Oct 1, 2026",
  },
];

// ─── Exam Results ─────────────────────────────
export const EXAM_RESULTS: ExamResult[] = [
  {
    id: "r-001",
    userId: "user-001",
    userName: "Alex Johnson",
    userEmail: "alex.johnson@student.edu",
    examId: "exam-001",
    examTitle: "TOEFL iBT Practice Test #1",
    score: 22,
    maxScore: 30,
    correctAnswers: 8,
    totalQuestions: 10,
    timeTakenMins: 48,
    submittedAt: "Oct 2, 2026",
    status: "passed",
  },
  {
    id: "r-002",
    userId: "user-001",
    userName: "Alex Johnson",
    userEmail: "alex.johnson@student.edu",
    examId: "exam-002",
    examTitle: "TOEFL iBT Practice Test #2",
    score: 26,
    maxScore: 30,
    correctAnswers: 8,
    totalQuestions: 9,
    timeTakenMins: 32,
    submittedAt: "Oct 6, 2026",
    status: "passed",
  },
  {
    id: "r-003",
    userId: "user-002",
    userName: "Maria Garcia",
    userEmail: "maria.garcia@student.edu",
    examId: "exam-001",
    examTitle: "TOEFL iBT Practice Test #1",
    score: 18,
    maxScore: 30,
    correctAnswers: 6,
    totalQuestions: 10,
    timeTakenMins: 52,
    submittedAt: "Oct 3, 2026",
    status: "passed",
  },
  {
    id: "r-004",
    userId: "user-002",
    userName: "Maria Garcia",
    userEmail: "maria.garcia@student.edu",
    examId: "exam-002",
    examTitle: "TOEFL iBT Practice Test #2",
    score: 23,
    maxScore: 30,
    correctAnswers: 7,
    totalQuestions: 9,
    timeTakenMins: 34,
    submittedAt: "Oct 8, 2026",
    status: "passed",
  },
  {
    id: "r-005",
    userId: "user-003",
    userName: "Chen Wei",
    userEmail: "chen.wei@student.edu",
    examId: "exam-001",
    examTitle: "TOEFL iBT Practice Test #1",
    score: 14,
    maxScore: 30,
    correctAnswers: 5,
    totalQuestions: 10,
    timeTakenMins: 54,
    submittedAt: "Oct 5, 2026",
    status: "failed",
  },
  {
    id: "r-006",
    userId: "user-005",
    userName: "Lucas Oliveira",
    userEmail: "lucas.oliveira@student.edu",
    examId: "exam-001",
    examTitle: "TOEFL iBT Practice Test #1",
    score: 25,
    maxScore: 30,
    correctAnswers: 9,
    totalQuestions: 10,
    timeTakenMins: 41,
    submittedAt: "Oct 7, 2026",
    status: "passed",
  },
  {
    id: "r-007",
    userId: "user-005",
    userName: "Lucas Oliveira",
    userEmail: "lucas.oliveira@student.edu",
    examId: "exam-002",
    examTitle: "TOEFL iBT Practice Test #2",
    score: 20,
    maxScore: 30,
    correctAnswers: 6,
    totalQuestions: 9,
    timeTakenMins: 30,
    submittedAt: "Oct 10, 2026",
    status: "passed",
  },
  {
    id: "r-008",
    userId: "user-006",
    userName: "Yuna Kim",
    userEmail: "yuna.kim@student.edu",
    examId: "exam-001",
    examTitle: "TOEFL iBT Practice Test #1",
    score: 11,
    maxScore: 30,
    correctAnswers: 4,
    totalQuestions: 10,
    timeTakenMins: 55,
    submittedAt: "Oct 1, 2026",
    status: "failed",
  },
];

// ─── Derived analytics ────────────────────────
export function getAnalytics(examId: string = "all") {
  const results = examId === "all" ? EXAM_RESULTS : EXAM_RESULTS.filter((r) => r.examId === examId);
  const totalResults = results.length;
  const passCount = results.filter((r) => r.status === "passed").length;
  const passRate = totalResults ? Math.round((passCount / totalResults) * 100) : 0;
  const avgScore = totalResults
    ? Math.round(results.reduce((sum, r) => sum + (r.score / r.maxScore) * 100, 0) / totalResults)
    : 0;
  const totalUsers = ADMIN_USERS.filter((u) => u.role === "user").length;
  const activeUsers =
    examId === "all"
      ? ADMIN_USERS.filter((u) => u.role === "user" && u.status === "active").length
      : new Set(results.map((r) => r.userId)).size;

  return { totalResults, passCount, passRate, avgScore, totalUsers, activeUsers };
}

// Score distribution buckets
export function getScoreDistribution(examId: string = "all") {
  const buckets = [
    { label: "0–49%", count: 0, color: "#ef4444" },
    { label: "50–64%", count: 0, color: "#f97316" },
    { label: "65–79%", count: 0, color: "#f59e0b" },
    { label: "80–89%", count: 0, color: "#22c55e" },
    { label: "90–100%", count: 0, color: "#6366f1" },
  ];
  for (const r of EXAM_RESULTS) {
    if (examId !== "all" && r.examId !== examId) continue;
    const pct = (r.score / r.maxScore) * 100;
    if (pct < 50) buckets[0].count++;
    else if (pct < 65) buckets[1].count++;
    else if (pct < 80) buckets[2].count++;
    else if (pct < 90) buckets[3].count++;
    else buckets[4].count++;
  }
  return buckets;
}

// A user's result for a specific exam
export function getResultByUserExam(userId: string, examId: string): ExamResult | undefined {
  return EXAM_RESULTS.find((r) => r.userId === userId && r.examId === examId);
}

// Results for a specific user
export function getResultsByUser(userId: string): ExamResult[] {
  return EXAM_RESULTS.filter((r) => r.userId === userId);
}

// Single result by result id
export function getResultById(resultId: string): ExamResult | undefined {
  return EXAM_RESULTS.find((r) => r.id === resultId);
}

// Per-user summary stats
export function getUserStats(userId: string) {
  const results = getResultsByUser(userId);
  if (!results.length) return null;
  const avgPct = Math.round(
    results.reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / results.length
  );
  const best = results.reduce((b, r) =>
    (r.score / r.maxScore) > (b.score / b.maxScore) ? r : b
  );
  const passed = results.filter((r) => r.status === "passed").length;
  return { total: results.length, avgPct, best, passed };
}
