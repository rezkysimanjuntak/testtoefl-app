"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getResultById } from "@/lib/adminData";
import { getExamById } from "@/lib/examData";
import type { ExamResult } from "@/lib/adminData";
import type { Exam } from "@/lib/examData";
import AppShell from "@/components/AppShell/AppShell";
import styles from "./report.module.css";

function gradeOf(pct: number) {
  if (pct >= 90) return { label: "Excellent", color: "#22c55e" };
  if (pct >= 75) return { label: "Good", color: "#10b981" };
  if (pct >= 60) return { label: "Fair", color: "#f59e0b" };
  return { label: "Needs Improvement", color: "#ef4444" };
}

function ScoreRing({ pct, color, score, max }: { pct: number; color: string; score: number; max: number }) {
  const r = 50;
  const circ = 2 * Math.PI * r;
  return (
    <div className={styles.ringWrap}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--border-default)" strokeWidth="8" />
        <circle
          cx="60" cy="60" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${circ * (1 - pct / 100)}`}
          transform="rotate(-90 60 60)"
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1)" }}
        />
      </svg>
      <div className={styles.ringInner}>
        <span className={styles.ringScore}>{score}</span>
        <span className={styles.ringMax}>/{max}</span>
        <span className={styles.ringPct}>{pct}%</span>
      </div>
    </div>
  );
}

function ReportContent({ result, exam }: { result: ExamResult; exam: Exam }) {
  const [activeTab, setActiveTab] = useState<"breakdown" | "passages">("breakdown");

  const pct = Math.round((result.score / result.maxScore) * 100);
  const grade = gradeOf(pct);
  const incorrect = result.totalQuestions - result.correctAnswers;
  const unanswered = 0; // dummy data doesn't track unanswered separately

  return (
    <div className={styles.page}>
      {/* Hero card */}
      <div className={`card ${styles.heroCard} animate-fadeInUp`}>
        <div className={styles.heroLeft}>
          <ScoreRing pct={pct} color={grade.color} score={result.score} max={result.maxScore} />
        </div>
        <div className={styles.heroRight}>
          <div className={styles.gradeBadge} style={{ color: grade.color, background: `${grade.color}1a`, borderColor: `${grade.color}40` }}>
            {grade.label}
          </div>
          <h1 className={styles.examTitle}>{result.examTitle}</h1>
          <p className={styles.submittedAt}>Submitted {result.submittedAt}</p>

          <div className={styles.statGrid}>
            {[
              { label: "Score", value: `${result.score}/${result.maxScore}`, sub: `${pct}%`, color: grade.color },
              { label: "Correct", value: String(result.correctAnswers), sub: "questions", color: "#22c55e" },
              { label: "Incorrect", value: String(incorrect), sub: "questions", color: "#ef4444" },
              { label: "Time Taken", value: `${result.timeTakenMins}m`, sub: "minutes", color: "var(--text-muted)" },
              { label: "Questions", value: String(result.totalQuestions), sub: "total", color: "var(--text-muted)" },
              { label: "Status", value: result.status === "passed" ? "Passed ✓" : "Failed ✗", sub: "", color: result.status === "passed" ? "#22c55e" : "#ef4444" },
            ].map((s) => (
              <div key={s.label} className={styles.statBox}>
                <span className={styles.statVal} style={{ color: s.color }}>{s.value}</span>
                {s.sub && <span className={styles.statSub}>{s.sub}</span>}
                <span className={styles.statLbl}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={`animate-fadeInUp delay-100`}>
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === "breakdown" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("breakdown")}
          >
            Score Breakdown
          </button>
          <button
            className={`${styles.tab} ${activeTab === "passages" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("passages")}
          >
            Passage Analysis
          </button>
        </div>

        {activeTab === "breakdown" && (
          <div className={`card ${styles.tabPanel}`}>
            <h3 className={styles.panelTitle}>Performance Overview</h3>

            {/* Accuracy bar */}
            <div className={styles.bigBarSection}>
              <div className={styles.bigBarHeader}>
                <span className={styles.bigBarLabel}>Overall Accuracy</span>
                <span className={styles.bigBarValue}>{pct}%</span>
              </div>
              <div className={styles.bigBarTrack}>
                <div
                  className={styles.bigBarFill}
                  style={{
                    width: `${pct}%`,
                    background: `linear-gradient(90deg, ${grade.color}, ${grade.color}cc)`,
                  }}
                />
              </div>
            </div>

            {/* Donut legend */}
            <div className={styles.legend}>
              {[
                { label: "Correct", count: result.correctAnswers, color: "#22c55e" },
                { label: "Incorrect", count: incorrect, color: "#ef4444" },
                { label: "Unanswered", count: unanswered, color: "var(--border-strong)" },
              ].map((item) => (
                <div key={item.label} className={styles.legendItem}>
                  <div className={styles.legendBar} style={{ background: item.color, width: `${(item.count / result.totalQuestions) * 100}%` }} />
                  <div className={styles.legendInfo}>
                    <span className={styles.legendDot} style={{ background: item.color }} />
                    <span className={styles.legendLabel}>{item.label}</span>
                    <span className={styles.legendCount}>{item.count}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Score scale reference */}
            <div className={styles.scaleSection}>
              <p className={styles.scaleTitle}>TOEFL Score Scale Reference</p>
              <div className={styles.scaleTrack}>
                {[
                  { label: "Needs Improvement", range: "< 60%", color: "#ef4444", width: 20 },
                  { label: "Fair", range: "60–74%", color: "#f59e0b", width: 20 },
                  { label: "Good", range: "75–89%", color: "#10b981", width: 20 },
                  { label: "Excellent", range: "≥ 90%", color: "#22c55e", width: 40 },
                ].map((tier) => (
                  <div
                    key={tier.label}
                    className={styles.scaleTier}
                    style={{ background: tier.color, flex: tier.width }}
                    title={`${tier.label}: ${tier.range}`}
                  >
                    <span className={styles.scaleTierLabel}>{tier.label}</span>
                  </div>
                ))}
              </div>
              <div className={styles.scaleMarker} style={{ left: `${Math.min(pct, 99)}%` }}>
                <div className={styles.scaleMarkerLine} />
                <span className={styles.scaleMarkerLabel}>You: {pct}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "passages" && (
          <div className={`card ${styles.tabPanel}`}>
            <h3 className={styles.panelTitle}>Passage-by-Passage Breakdown</h3>
            <div className={styles.passageList}>
              {exam.passages.map((passage, pi) => {
                const pQs = exam.questions.filter((q) => passage.questionIds.includes(q.id));
                // Proportional estimate since dummy results don't store per-passage answers
                const share = Math.round((pQs.length / exam.questions.length) * result.correctAnswers);
                const pPct = pQs.length ? Math.round((share / pQs.length) * 100) : 0;
                const pGrade = gradeOf(pPct);

                return (
                  <div key={passage.id} className={styles.passageItem}>
                    <div className={styles.passageHeader}>
                      <div className={styles.passageMeta}>
                        <span className={styles.passageNum}>Passage {pi + 1}</span>
                        <h4 className={styles.passageName}>{passage.title}</h4>
                        <span className={styles.passageQCount}>{pQs.length} questions</span>
                      </div>
                      <div className={styles.passageScore}>
                        <span className={styles.passageScoreVal} style={{ color: pGrade.color }}>
                          {share}/{pQs.length}
                        </span>
                        <span className={styles.passageScorePct} style={{ color: pGrade.color }}>
                          {pPct}%
                        </span>
                      </div>
                    </div>
                    <div className={styles.passageTrack}>
                      <div
                        className={styles.passageFill}
                        style={{
                          width: `${pPct}%`,
                          background: pPct >= 80 ? "#22c55e" : pPct >= 60 ? "#f59e0b" : "#ef4444",
                        }}
                      />
                    </div>
                    <p className={styles.passageGradeLabel} style={{ color: pGrade.color }}>
                      {pGrade.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className={`${styles.actions} animate-fadeInUp delay-200`}>
        <Link href="/dashboard/results" className="btn btn-secondary btn-lg">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          All Results
        </Link>
        <Link href="/dashboard/exams" className="btn btn-primary btn-lg">
          Browse Exams
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function ScoreReportPage() {
  const { user, loading } = useAuth();
  const params = useParams();
  const router = useRouter();
  const resultId = params.id as string;

  const result = getResultById(resultId);
  const exam = result ? getExamById(result.examId) : undefined;

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/"); return; }
    if (!result || !exam) { router.push("/dashboard/results"); return; }
    // Users can only view their own results
    if (user.role === "user" && result.userId !== user.id) {
      router.push("/dashboard/results");
    }
  }, [loading, user, result, exam, router]);

  if (loading || !result || !exam) return null;

  return (
    <AppShell
      title="Score Report"
      subtitle={result.examTitle}
      requiredRole="user"
    >
      <ReportContent result={result} exam={exam} />
    </AppShell>
  );
}
