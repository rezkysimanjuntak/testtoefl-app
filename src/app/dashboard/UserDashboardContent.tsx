"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { getResultByUserExam } from "@/lib/adminData";
import styles from "./dashboard.module.css";

const DUMMY_STATS = [
  { label: "Exams Taken", value: "3", icon: "📝", trend: "+1 this month" },
  { label: "Best Score", value: "112", icon: "🏆", trend: "Reading: 29" },
  { label: "Avg Score", value: "105", icon: "📊", trend: "Last 3 exams" },
  { label: "Next Exam", value: "Oct 18", icon: "📅", trend: "8 days away" },
];

const DUMMY_EXAMS = [
  {
    id: "exam-001",
    title: "TOEFL iBT Practice Test #1",
    status: "completed",
    score: 108,
    maxScore: 120,
    date: "Oct 2, 2026",
    section: "Reading",
  },
  {
    id: "exam-002",
    title: "TOEFL iBT Practice Test #2",
    status: "completed",
    score: 112,
    maxScore: 120,
    date: "Oct 6, 2026",
    section: "Reading",
  },
  {
    id: "exam-003",
    title: "TOEFL iBT Full Simulation",
    status: "upcoming",
    score: null,
    maxScore: 120,
    date: "Oct 18, 2026",
    section: "Reading",
  },
];

function ScoreBadge({ score, max }: { score: number; max: number }) {
  const pct = (score / max) * 100;
  const color = pct >= 80 ? "success" : pct >= 60 ? "warning" : "danger";
  return (
    <div className={`${styles.scoreBadge} ${styles[`score_${color}`]}`}>
      {score}/{max}
    </div>
  );
}

export default function UserDashboardContent() {
  const { user } = useAuth();

  return (
    <div className={styles.content}>
      {/* Welcome banner */}
      <div className={`${styles.welcomeBanner} animate-fadeInUp`}>
        <div className={styles.welcomeText}>
          <h2 className={styles.welcomeTitle}>
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h2>
          <p className={styles.welcomeSub}>
            You have <strong>1 upcoming exam</strong> scheduled for Oct 18. Stay
            prepared!
          </p>
        </div>
        <Link href="/dashboard/exams" className="btn btn-primary">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          View My Exams
        </Link>
      </div>

      {/* Stats grid */}
      <div className={`${styles.statsGrid} animate-fadeInUp delay-100`}>
        {DUMMY_STATS.map((s) => (
          <div key={s.label} className={`card ${styles.statCard}`}>
            <span className={styles.statIcon}>{s.icon}</span>
            <div>
              <p className={styles.statValue}>{s.value}</p>
              <p className={styles.statLabel}>{s.label}</p>
              <p className={styles.statTrend}>{s.trend}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent exams */}
      <div className={`animate-fadeInUp delay-200`}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent & Upcoming Exams</h3>
          <Link href="/dashboard/exams" className="btn btn-secondary btn-sm">
            View All
          </Link>
        </div>

        <div className={styles.examList}>
          {DUMMY_EXAMS.map((exam) => (
            <div key={exam.id} className={`card ${styles.examCard}`}>
              <div className={styles.examLeft}>
                <div className={styles.examIconWrap}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div>
                  <p className={styles.examTitle}>{exam.title}</p>
                  <div className={styles.examMeta}>
                    <span className="badge badge-neutral">{exam.section}</span>
                    <span className={styles.examDate}>{exam.date}</span>
                  </div>
                </div>
              </div>
              <div className={styles.examRight}>
                {exam.status === "completed" && exam.score !== null ? (
                  <>
                    <ScoreBadge score={exam.score} max={exam.maxScore} />
                    <span className="badge badge-success">Completed</span>
                    <Link href={`/dashboard/results/${(user && getResultByUserExam(user.id, exam.id)?.id) ?? ""}`} className="btn btn-secondary btn-sm">
                      View Result
                    </Link>
                  </>
                ) : (
                  <>
                    <span className="badge badge-warning">Upcoming</span>
                    <Link href={`/dashboard/exams/${exam.id}`} className="btn btn-primary btn-sm">
                      Start Exam
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score progress */}
      <div className={`card ${styles.progressCard} animate-fadeInUp delay-300`}>
        <h3 className={styles.sectionTitle}>Score Progression</h3>
        <div className={styles.progressBars}>
          {[
            { label: "Reading", score: 28, max: 30, color: "brand" },
            { label: "Overall (avg)", score: 105, max: 120, color: "accent" },
          ].map((item) => (
            <div key={item.label} className={styles.progressItem}>
              <div className={styles.progressHeader}>
                <span className={styles.progressLabel}>{item.label}</span>
                <span className={styles.progressValue}>
                  {item.score}/{item.max}
                </span>
              </div>
              <div className={styles.progressTrack}>
                <div
                  className={`${styles.progressFill} ${styles[`fill_${item.color}`]}`}
                  style={{ width: `${(item.score / item.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
