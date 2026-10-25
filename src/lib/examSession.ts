// Exam session state — stored in sessionStorage during an active exam

export interface ExamSession {
  examId: string;
  startedAt: number; // timestamp ms
  finishedAt?: number; // timestamp ms — set when exam is submitted
  durationMs: number;
  answers: Record<string, string>; // questionId → answerId
  flagged: string[]; // questionId[]
  submitted: boolean;
  score?: number;
}

const SESSION_KEY = "toefl_exam_session";

export function startExamSession(examId: string, durationMinutes: number): ExamSession {
  const session: ExamSession = {
    examId,
    startedAt: Date.now(),
    durationMs: durationMinutes * 60 * 1000,
    answers: {},
    flagged: [],
    submitted: false,
  };
  saveExamSession(session);
  return session;
}

export function saveExamSession(session: ExamSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadExamSession(): ExamSession | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ExamSession;
  } catch {
    return null;
  }
}

export function clearExamSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function getRemainingMs(session: ExamSession): number {
  const elapsed = Date.now() - session.startedAt;
  return Math.max(0, session.durationMs - elapsed);
}
