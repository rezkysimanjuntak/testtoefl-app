"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getExamById } from "@/lib/examData";
import {
  startExamSession,
  loadExamSession,
  type ExamSession,
} from "@/lib/examSession";
import ExamStartScreen from "@/components/Exam/ExamStartScreen";
import ExamEngine from "@/components/Exam/ExamEngine";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const examId = params.id as string;

  const [phase, setPhase] = useState<"loading" | "start" | "exam">("loading");
  const [session, setSession] = useState<ExamSession | null>(null);

  const exam = getExamById(examId);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/"); return; }
    if (user.role !== "user") { router.push("/admin"); return; }
    if (!exam) { router.push("/dashboard/exams"); return; }

    // Check if there's an existing in-progress session for this exam
    const existing = loadExamSession();
    if (existing && existing.examId === examId && !existing.submitted) {
      setSession(existing);
      setPhase("exam");
    } else {
      setPhase("start");
    }
  }, [loading, user, exam, examId, router]);

  const handleStart = () => {
    if (!exam) return;
    const newSession = startExamSession(exam.id, exam.durationMinutes);
    setSession(newSession);
    setPhase("exam");
  };

  if (phase === "loading" || !exam) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-base)",
        flexDirection: "column",
        gap: "16px",
      }}>
        <div style={{
          width: "44px", height: "44px",
          border: "3px solid var(--border-default)",
          borderTopColor: "var(--brand-500)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }} />
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading exam…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (phase === "start") {
    return <ExamStartScreen exam={exam} onStart={handleStart} />;
  }

  if (phase === "exam" && session) {
    return <ExamEngine exam={exam} session={session} />;
  }

  return null;
}
