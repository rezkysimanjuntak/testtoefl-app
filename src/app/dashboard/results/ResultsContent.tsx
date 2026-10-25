"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getResultsByUser, getUserStats } from "@/lib/adminData";
import { getExamById } from "@/lib/examData";
import styles from "./results.module.css";

function gradeOf(pct: number) {
  if (pct >= 90) return { label: "Excellent", color: "#22c55e" };
  if (pct >= 75) return { label: "Good", color: "#10b981" };
  if (pct >= 60) return { label: "Fair", color: "#f59e0b" };
  return { label: "Needs Improvement", color: "#ef4444" };
}

function ScoreRing({ pct, color, score, max }: { pct: number; color: string; score: number; max: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  return (
    <div className={styles.ringWrap}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border-default)" strokeWidth="6" />
        <circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${circ}`}
          strokeDashoffset={`${circ * (1 - pct / 100)}`}
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className={styles.ringInner}>
        <span className={styles.ringScore}>{score}</span>
        <span className={styles.ringMax}>/{max}</span>
      </div>
    </div>
  );
}

function ProgressChart({ points }: { points: { label: string; pct: number }[] }) {
  const W = 600, H = 160, P = 24;
  const x = (i: number) => (points.length === 1 ? W / 2 : P + (i * (W - 2 * P)) / (points.length - 1));
  const y = (pct: number) => H - P - (pct / 100) * (H - 2 * P);
  const line = points.map((p, i) => `${x(i)},${y(p.pct)}`).join(" ");
  return (
    <svg id="progress-chart" viewBox={`0 0 ${W} ${H}`} className={styles.chart} role="img" aria-label="Score progress over time">
      {[0, 50, 100].map((g) => (
        <line key={g} x1={P} x2={W - P} y1={y(g)} y2={y(g)} stroke="var(--border-default)" strokeDasharray="4 4" />
      ))}
      {points.length > 1 && <polyline points={line} fill="none" stroke="var(--brand-primary, #6366f1)" strokeWidth="3" strokeLinejoin="round" />}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(p.pct)} r="5" fill="var(--brand-primary, #6366f1)" />
          <text x={x(i)} y={y(p.pct) - 10} textAnchor="middle" fontSize="11" fill="var(--text-secondary)">{p.pct}%</text>
          <text x={x(i)} y={H - 4} textAnchor="middle" fontSize="10" fill="var(--text-muted)">{p.label}</text>
        </g>
      ))}
    </svg>
  );
}

const SECTIONS = ["Reading", "Listening", "Speaking", "Writing"];

export default function ResultsContent() {
  const { user } = useAuth();
  const results = user ? getResultsByUser(user.id) : [];
  const stats = user ? getUserStats(user.id) : null;

  return (
    <div className={styles.container}>
      {/* Summary stats */}
      {stats && (
        <div className={`${styles.statsRow} animate-fadeInUp`}>
          {[
            { label: "Exams Taken", value: String(stats.total), icon: "📝" },
            { label: "Passed", value: `${stats.passed}/${stats.total}`, icon: "✅" },
            { label: "Avg Score", value: `${stats.avgPct}%`, icon: "📊" },
            { label: "Best Exam", value: stats.best.examTitle.replace("TOEFL iBT ", ""), icon: "🏆" },
          ].map((s, i) => (
            <div key={s.label} className={`card ${styles.statCard} animate-fadeInUp`} style={{ animationDelay: `${i * 0.07}s` }}>
              <span className={styles.statIcon}>{s.icon}</span>
              <div className={styles.statBody}>
                <p className={styles.statValue}>{s.value}</p>
                <p className={styles.statLabel}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress over time + section breakdown */}
      {results.length > 0 && (
        <div className={`${styles.insightRow} animate-fadeInUp delay-100`}>
          <div className={`card ${styles.insightCard}`}>
            <h2 className={styles.listTitle}>Score Progress</h2>
            <ProgressChart
              points={[...results]
                .sort((a, b) => Date.parse(a.submittedAt) - Date.parse(b.submittedAt))
                .map((r) => ({ label: r.submittedAt.replace(/, \d{4}$/, ""), pct: Math.round((r.score / r.maxScore) * 100) }))}
            />
          </div>
          <div className={`card ${styles.insightCard}`}>
            <h2 className={styles.listTitle}>By Section</h2>
            {SECTIONS.map((s) => {
              const avg = s === "Reading" ? stats?.avgPct : undefined; // only Reading is simulated so far
              return (
                <div key={s} className={styles.passageBarRow}>
                  <span className={styles.sectionLabel}>{s}</span>
                  <div className={styles.passageTrack}>
                    <div className={styles.passageFill} style={{ width: `${avg ?? 0}%`, background: "var(--brand-primary, #6366f1)" }} />
                  </div>
                  <span className={styles.passageBarPct}>{avg !== undefined ? `${avg}%` : "—"}</span>
                </div>
              );
            })}
            <p className={styles.metaText}>Listening, Speaking and Writing are not available yet.</p>
          </div>
        </div>
      )}

      {/* Results list */}
      <div className={`${styles.listHeader} animate-fadeInUp delay-100`}>
        <h2 className={styles.listTitle}>Exam History</h2>
        <span className={styles.listCount}>{results.length} attempt{results.length !== 1 ? "s" : ""}</span>
      </div>

      {results.length === 0 ? (
        <div className={`card ${styles.emptyState} animate-fadeInUp delay-100`}>
          <div className={styles.emptyIcon}>📋</div>
          <p className={styles.emptyTitle}>No results yet</p>
          <p className={styles.emptySub}>Complete an exam to see your score report here.</p>
          <Link href="/dashboard/exams" className="btn btn-primary" style={{ marginTop: "16px" }}>
            Browse Exams
          </Link>
        </div>
      ) : (
        <div className={styles.resultsList}>
          {results.map((result, i) => {
            const pct = Math.round((result.score / result.maxScore) * 100);
            const grade = gradeOf(pct);
            const exam = getExamById(result.examId);

            return (
              <div
                key={result.id}
                className={`card ${styles.resultCard} animate-fadeInUp`}
                style={{ animationDelay: `${0.1 + i * 0.07}s` }}
              >
                {/* Score ring */}
                <ScoreRing pct={pct} color={grade.color} score={result.score} max={result.maxScore} />

                {/* Info */}
                <div className={styles.resultInfo}>
                  <div className={styles.resultTitleRow}>
                    <h3 className={styles.resultTitle}>{result.examTitle}</h3>
                    <span
                      className={styles.gradePill}
                      style={{ color: grade.color, background: `${grade.color}1a`, borderColor: `${grade.color}40` }}
                    >
                      {grade.label}
                    </span>
                  </div>
                  <div className={styles.resultMeta}>
                    <span className="badge badge-neutral">Reading</span>
                    <span className={styles.metaDot}>·</span>
                    <span className={styles.metaText}>{result.submittedAt}</span>
                    <span className={styles.metaDot}>·</span>
                    <span className={styles.metaText}>{result.timeTakenMins} min</span>
                  </div>
                  <div className={styles.statPills}>
                    <span className={styles.pill}>
                      <span className={styles.pillDot} style={{ background: "#22c55e" }} />
                      {result.correctAnswers} correct
                    </span>
                    <span className={styles.pill}>
                      <span className={styles.pillDot} style={{ background: "#ef4444" }} />
                      {result.totalQuestions - result.correctAnswers} incorrect
                    </span>
                    <span className={styles.pill}>
                      <span className={styles.pillDot} style={{ background: grade.color }} />
                      {pct}%
                    </span>
                  </div>

                  {/* Per-passage mini bars */}
                  {exam && (
                    <div className={styles.passageBars}>
                      {exam.passages.map((p, pi) => {
                        const pQs = exam.questions.filter((q) => p.questionIds.includes(q.id));
                        // We can't know actual answers from dummy data — show proportional share of score
                        const share = Math.round((pQs.length / exam.questions.length) * result.correctAnswers);
                        const pPct = pQs.length ? Math.round((share / pQs.length) * 100) : 0;
                        const pColor = pPct >= 80 ? "#22c55e" : pPct >= 60 ? "#f59e0b" : "#ef4444";
                        return (
                          <div key={p.id} className={styles.passageBarRow}>
                            <span className={styles.passageBarLabel}>P{pi + 1}</span>
                            <div className={styles.passageTrack}>
                              <div className={styles.passageFill} style={{ width: `${pPct}%`, background: pColor }} />
                            </div>
                            <span className={styles.passageBarPct} style={{ color: pColor }}>{pPct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className={styles.resultActions}>
                  <span className={`badge ${result.status === "passed" ? "badge-success" : "badge-danger"}`}>
                    {result.status === "passed" ? "Passed" : "Failed"}
                  </span>
                  <Link href={`/dashboard/results/${result.id}`} className="btn btn-secondary btn-sm">
                    Score Report
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
