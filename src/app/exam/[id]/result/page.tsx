"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getExamById, type Question } from "@/lib/examData";
import { loadExamSession, clearExamSession, type ExamSession } from "@/lib/examSession";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import styles from "./result.module.css";

export default function ExamResultPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const examId = params.id as string;

  const [session, setSession] = useState<ExamSession | null>(null);
  const [activeTab, setActiveTab] = useState<"summary" | "review">("summary");
  const [mounted, setMounted] = useState(false);

  const exam = getExamById(examId);

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/"); return; }

    const s = loadExamSession();
    if (!s || s.examId !== examId || !s.submitted) {
      router.push(`/dashboard/exams`);
      return;
    }
    setSession(s);
    setMounted(true);
  }, [loading, user, examId, router]);

  if (!mounted || !session || !exam) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center",
        justifyContent: "center", background: "var(--bg-base)", flexDirection: "column", gap: "16px",
      }}>
        <div style={{ width: "44px", height: "44px", border: "3px solid var(--border-default)", borderTopColor: "var(--brand-500)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Loading results…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const score = session.score ?? 0;
  const maxScore = exam.maxScore;
  const pct = Math.round((score / maxScore) * 100);
  const correct = exam.questions.filter((q) => session.answers[q.id] === q.correctAnswerId).length;
  const incorrect = exam.questions.filter(
    (q) => session.answers[q.id] && session.answers[q.id] !== q.correctAnswerId
  ).length;
  const unanswered = exam.questions.filter((q) => !session.answers[q.id]).length;

  const grade =
    pct >= 90 ? { label: "Excellent", color: "#22c55e" } :
    pct >= 75 ? { label: "Good", color: "#10b981" } :
    pct >= 60 ? { label: "Fair", color: "#f59e0b" } :
    { label: "Needs Improvement", color: "#ef4444" };

  // Use the stamped finishedAt so time-taken is correct even for
  // auto-submitted exams or sessions viewed after a delay.
  const timeTakenMs = (session.finishedAt ?? Date.now()) - session.startedAt;
  const timeTakenMins = Math.floor(timeTakenMs / 60000);
  const timeTakenSecs = Math.floor((timeTakenMs % 60000) / 1000);

  const handleDone = () => {
    clearExamSession();
    router.push("/dashboard/exams");
  };

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      {/* Top bar */}
      <header className={styles.topBar}>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            </svg>
          </div>
          <span className={styles.logoText}>TOEFL<span>Exam</span></span>
        </div>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        {/* Score hero */}
        <div className={`${styles.heroCard} card-glass animate-fadeInUp`}>
          <div className={styles.scoreCircleWrap}>
            {/* SVG circle */}
            <svg className={styles.scoreCircle} viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-default)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50"
                fill="none"
                stroke={grade.color}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - pct / 100)}`}
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
              />
            </svg>
            <div className={styles.scoreInner}>
              <span className={styles.scoreNum}>{score}</span>
              <span className={styles.scoreMax}>/{maxScore}</span>
            </div>
          </div>

          <div className={styles.scoreDetails}>
            <div className={styles.gradeBadge} style={{ color: grade.color, borderColor: grade.color, background: `${grade.color}18` }}>
              {grade.label}
            </div>
            <h1 className={styles.resultTitle}>Exam Complete</h1>
            <p className={styles.examName}>{exam.title}</p>

            <div className={styles.statsRow}>
              {[
                { label: "Score", value: `${score}/${maxScore}`, sub: `${pct}%` },
                { label: "Correct", value: String(correct), sub: "questions" },
                { label: "Incorrect", value: String(incorrect), sub: "questions" },
                { label: "Unanswered", value: String(unanswered), sub: "questions" },
                { label: "Time Taken", value: `${timeTakenMins}m`, sub: `${timeTakenSecs}s` },
              ].map((s) => (
                <div key={s.label} className={styles.statBox}>
                  <span className={styles.statVal}>{s.value}</span>
                  <span className={styles.statSub}>{s.sub}</span>
                  <span className={styles.statLbl}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className={`${styles.tabsWrap} animate-fadeInUp delay-100`}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "summary" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("summary")}
            >
              Score Summary
            </button>
            <button
              className={`${styles.tab} ${activeTab === "review" ? styles.activeTab : ""}`}
              onClick={() => setActiveTab("review")}
            >
              Answer Review
            </button>
          </div>

          {activeTab === "summary" && (
            <div className={styles.summaryPanel}>
              {exam.passages.map((passage, pi) => {
                const pQuestions = exam.questions.filter((q) => passage.questionIds.includes(q.id));
                const pCorrect = pQuestions.filter((q) => session.answers[q.id] === q.correctAnswerId).length;
                const pPct = Math.round((pCorrect / pQuestions.length) * 100);

                return (
                  <div key={passage.id} className={styles.passageSummary}>
                    <div className={styles.passageSummaryHeader}>
                      <div>
                        <p className={styles.passageSummaryNum}>Passage {pi + 1}</p>
                        <p className={styles.passageSummaryTitle}>{passage.title}</p>
                      </div>
                      <div className={styles.passageSummaryScore}>
                        <span className={styles.passageScoreVal}>{pCorrect}/{pQuestions.length}</span>
                        <span className={styles.passageScorePct}>{pPct}%</span>
                      </div>
                    </div>
                    <div className={styles.passageBar}>
                      <div
                        className={styles.passageBarFill}
                        style={{
                          width: `${pPct}%`,
                          background: pPct >= 80 ? "#22c55e" : pPct >= 60 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === "review" && (
            <div className={styles.reviewPanel}>
              {exam.questions.map((q, qi) => {
                const userAnswer = session.answers[q.id];
                const isCorrect = userAnswer === q.correctAnswerId;
                const isUnanswered = !userAnswer;

                return (
                  <div
                    key={q.id}
                    className={`${styles.reviewItem} ${isCorrect ? styles.reviewCorrect : isUnanswered ? styles.reviewUnanswered : styles.reviewIncorrect}`}
                  >
                    <div className={styles.reviewHeader}>
                      <span className={styles.reviewQNum}>Q{q.number}</span>
                      {isCorrect ? (
                        <span className={styles.reviewStatusCorrect}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                          Correct
                        </span>
                      ) : isUnanswered ? (
                        <span className={styles.reviewStatusSkipped}>Skipped</span>
                      ) : (
                        <span className={styles.reviewStatusIncorrect}>
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                          Incorrect
                        </span>
                      )}
                    </div>
                    <p className={styles.reviewQText}>{q.text}</p>
                    <div className={styles.reviewAnswers}>
                      {q.answers.map((ans) => {
                        const isUserPick = userAnswer === ans.id;
                        const isRight = ans.id === q.correctAnswerId;
                        return (
                          <div
                            key={ans.id}
                            className={`${styles.reviewAns} ${isRight ? styles.rightAns : ""} ${isUserPick && !isRight ? styles.wrongAns : ""}`}
                          >
                            <span className={styles.reviewAnsLetter}>{ans.id.toUpperCase()}</span>
                            <span className={styles.reviewAnsText}>{ans.text}</span>
                            {isRight && <span className={styles.correctMark}>✓ Correct</span>}
                            {isUserPick && !isRight && <span className={styles.wrongMark}>✗ Your answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className={styles.explanation}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={`${styles.actions} animate-fadeInUp delay-200`}>
          <button className="btn btn-secondary btn-lg" onClick={handleDone}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Back to Exams
          </button>
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </main>
    </div>
  );
}
