"use client";

import { useAuth } from "@/context/AuthContext";
import { getResultsByUser, getUserStats } from "@/lib/adminData";
import { EXAMS } from "@/lib/examData";
import Link from "next/link";
import styles from "./profile.module.css";

function gradeOf(pct: number) {
  if (pct >= 90) return { label: "Excellent", color: "#22c55e" };
  if (pct >= 75) return { label: "Good", color: "#10b981" };
  if (pct >= 60) return { label: "Fair", color: "#f59e0b" };
  return { label: "Needs Improvement", color: "#ef4444" };
}

export default function ProfileContent() {
  const { user, logout } = useAuth();
  if (!user) return null;

  const results = getResultsByUser(user.id);
  const stats = getUserStats(user.id);
  const upcomingExams = EXAMS.filter((e) => e.status === "upcoming");

  return (
    <div className={styles.page}>
      {/* Profile card */}
      <div className={`card ${styles.profileCard} animate-fadeInUp`}>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar}>{user.avatar ?? user.name.slice(0, 2).toUpperCase()}</div>
          <div className={styles.avatarBadge}>
            <span className={`badge ${user.role === "admin" ? "badge-brand" : "badge-success"}`}>
              {user.role === "admin" ? "Administrator" : "Examinee"}
            </span>
          </div>
        </div>
        <div className={styles.profileInfo}>
          <h1 className={styles.profileName}>{user.name}</h1>
          <p className={styles.profileEmail}>{user.email}</p>
          <div className={styles.profileMeta}>
            <span className={styles.metaChip}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              Member since Sep 2026
            </span>
            <span className={styles.metaChip}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              {results.length} exam{results.length !== 1 ? "s" : ""} completed
            </span>
          </div>
        </div>
        <button className={`btn btn-secondary btn-sm ${styles.logoutBtn}`} onClick={logout}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign Out
        </button>
      </div>

      <div className={styles.grid}>
        {/* Stats column */}
        <div className={styles.statsCol}>
          <div className={`card ${styles.statsCard} animate-fadeInUp delay-100`}>
            <h2 className={styles.sectionTitle}>Performance Summary</h2>
            {stats ? (
              <div className={styles.statsList}>
                {[
                  { label: "Exams Taken", value: String(stats.total) },
                  { label: "Exams Passed", value: `${stats.passed} / ${stats.total}` },
                  { label: "Pass Rate", value: `${Math.round((stats.passed / stats.total) * 100)}%` },
                  { label: "Average Score", value: `${stats.avgPct}%` },
                  { label: "Best Result", value: `${Math.round((stats.best.score / stats.best.maxScore) * 100)}% — ${stats.best.examTitle.replace("TOEFL iBT ", "")}` },
                ].map((s) => (
                  <div key={s.label} className={styles.statRow}>
                    <span className={styles.statLabel}>{s.label}</span>
                    <span className={styles.statValue}>{s.value}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className={styles.noData}>No exam attempts yet.</p>
            )}
          </div>

          {/* Score trend */}
          {results.length > 0 && (
            <div className={`card ${styles.trendCard} animate-fadeInUp delay-150`}>
              <h2 className={styles.sectionTitle}>Score History</h2>
              <div className={styles.trendList}>
                {results.map((r) => {
                  const pct = Math.round((r.score / r.maxScore) * 100);
                  const g = gradeOf(pct);
                  return (
                    <div key={r.id} className={styles.trendItem}>
                      <div className={styles.trendLeft}>
                        <p className={styles.trendTitle}>{r.examTitle.replace("TOEFL iBT ", "")}</p>
                        <p className={styles.trendDate}>{r.submittedAt}</p>
                      </div>
                      <div className={styles.trendRight}>
                        <div className={styles.trendBar}>
                          <div className={styles.trendFill} style={{ width: `${pct}%`, background: g.color }} />
                        </div>
                        <span className={styles.trendPct} style={{ color: g.color }}>{pct}%</span>
                      </div>
                      <Link href={`/dashboard/results/${r.id}`} className="btn btn-secondary btn-sm" style={{ marginLeft: 8, flexShrink: 0 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="9 18 15 12 9 6" />
                        </svg>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className={styles.rightCol}>
          {/* Upcoming exams */}
          <div className={`card ${styles.upcomingCard} animate-fadeInUp delay-200`}>
            <div className={styles.cardHeader}>
              <h2 className={styles.sectionTitle}>Upcoming Exams</h2>
              <Link href="/dashboard/exams" className="btn btn-secondary btn-sm">View All</Link>
            </div>
            {upcomingExams.length === 0 ? (
              <p className={styles.noData}>No upcoming exams scheduled.</p>
            ) : (
              <div className={styles.upcomingList}>
                {upcomingExams.map((exam) => (
                  <div key={exam.id} className={styles.upcomingItem}>
                    <div className={styles.upcomingIcon}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                    </div>
                    <div className={styles.upcomingInfo}>
                      <p className={styles.upcomingTitle}>{exam.title}</p>
                      <div className={styles.upcomingMeta}>
                        <span className="badge badge-warning" style={{ fontSize: "0.68rem" }}>Upcoming</span>
                        <span className={styles.upcomingDate}>{exam.scheduledDate} · {exam.durationMinutes} min</span>
                      </div>
                    </div>
                    <Link href={`/exam/${exam.id}`} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
                      Start
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Account info */}
          <div className={`card ${styles.accountCard} animate-fadeInUp delay-250`}>
            <h2 className={styles.sectionTitle}>Account Information</h2>
            <div className={styles.accountList}>
              {[
                { label: "Full Name", value: user.name },
                { label: "Email Address", value: user.email },
                { label: "Account ID", value: user.id },
                { label: "Role", value: user.role === "admin" ? "Administrator" : "Examinee" },
              ].map((item) => (
                <div key={item.label} className={styles.accountRow}>
                  <span className={styles.accountLabel}>{item.label}</span>
                  <span className={styles.accountValue}>{item.value}</span>
                </div>
              ))}
            </div>
            <p className={styles.accountNote}>
              This is a demo account. Profile editing is not available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
