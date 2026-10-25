"use client";

import Link from "next/link";
import { EXAMS } from "@/lib/examData";
import { useAuth } from "@/context/AuthContext";
import { getResultByUserExam } from "@/lib/adminData";
import styles from "./exams.module.css";

const STATUS_MAP = {
  completed: { label: "Completed", badge: "badge-success" },
  upcoming: { label: "Upcoming", badge: "badge-warning" },
  active: { label: "Active", badge: "badge-brand" },
};

// Dummy past scores for completed exams
const DUMMY_SCORES: Record<string, number> = {
  "exam-001": 22,
  "exam-002": 26,
};

export default function ExamsListContent() {
  const { user } = useAuth();
  return (
    <div className={styles.container}>
      {/* Header bar */}
      <div className={`${styles.headerBar} animate-fadeInUp`}>
        <div>
          <h2 className={styles.pageTitle}>Available Exams</h2>
          <p className={styles.pageSubtitle}>
            {EXAMS.length} exams available — {EXAMS.filter((e) => e.status === "upcoming").length} upcoming
          </p>
        </div>
      </div>

      {/* Exam cards */}
      <div className={styles.examGrid}>
        {EXAMS.map((exam, i) => {
          const statusCfg = STATUS_MAP[exam.status];
          const score = DUMMY_SCORES[exam.id];
          const scorePct = score ? Math.round((score / exam.maxScore) * 100) : null;

          return (
            <div
              key={exam.id}
              className={`card ${styles.examCard} animate-fadeInUp`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {/* Card header */}
              <div className={styles.cardHeader}>
                <div className={styles.sectionIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className={styles.headerMeta}>
                  <span className={`badge ${statusCfg.badge}`}>{statusCfg.label}</span>
                  <span className={styles.sectionTag}>Reading</span>
                </div>
              </div>

              {/* Title & desc */}
              <div className={styles.cardBody}>
                <h3 className={styles.examTitle}>{exam.title}</h3>
                <p className={styles.examDesc}>{exam.description}</p>
              </div>

              {/* Meta row */}
              <div className={styles.metaRow}>
                <div className={styles.metaItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  {exam.durationMinutes} min
                </div>
                <div className={styles.metaItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 8v4l3 3" />
                  </svg>
                  {exam.questions.length} Questions
                </div>
                <div className={styles.metaItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {exam.scheduledDate}
                </div>
                <div className={styles.metaItem}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                  {exam.passages.length} Passages
                </div>
              </div>

              {/* Score bar (if completed) */}
              {exam.status === "completed" && score !== undefined && (
                <div className={styles.scoreSection}>
                  <div className={styles.scoreLine}>
                    <span className={styles.scoreLabel}>Your Score</span>
                    <span className={styles.scoreValue}>
                      {score}/{exam.maxScore}
                      <span className={styles.scorePct}> ({scorePct}%)</span>
                    </span>
                  </div>
                  <div className={styles.scoreTrack}>
                    <div
                      className={styles.scoreFill}
                      style={{
                        width: `${scorePct}%`,
                        background:
                          scorePct! >= 80
                            ? "linear-gradient(90deg,#22c55e,#4ade80)"
                            : scorePct! >= 60
                            ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                            : "linear-gradient(90deg,#ef4444,#f87171)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Action */}
              <div className={styles.cardFooter}>
                {exam.status === "completed" ? (
                  <Link href={`/dashboard/results/${(user && getResultByUserExam(user.id, exam.id)?.id) ?? ""}`} className="btn btn-secondary btn-sm">
                    View Result
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                ) : exam.status === "upcoming" ? (
                  <Link href={`/exam/${exam.id}`} className="btn btn-primary btn-sm">
                    Start Exam
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </Link>
                ) : (
                  <Link href={`/exam/${exam.id}`} className="btn btn-primary btn-sm">
                    Continue
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
