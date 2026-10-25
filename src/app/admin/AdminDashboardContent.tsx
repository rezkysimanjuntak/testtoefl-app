"use client";

import Link from "next/link";
import styles from "./admin.module.css";

const STATS = [
  { label: "Total Exams", value: "12", icon: "📋", change: "+3", positive: true },
  { label: "Active Users", value: "248", icon: "👥", change: "+18", positive: true },
  { label: "Exams Today", value: "7", icon: "📅", change: "-2", positive: false },
  { label: "Avg Score", value: "98.4", icon: "📊", change: "+1.2", positive: true },
  { label: "Pass Rate", value: "84%", icon: "✅", change: "+3%", positive: true },
  { label: "Questions", value: "1,240", icon: "❓", change: "+42", positive: true },
];

const QUICK_ACTIONS = [
  { label: "Manage Exams", href: "/admin/exams", icon: "➕", color: "brand" },
  { label: "Question Bank", href: "/admin/questions", icon: "✏️", color: "accent" },
  { label: "Manage Users", href: "/admin/users", icon: "👤", color: "warning" },
  { label: "View Analytics", href: "/admin/results", icon: "📈", color: "success" },
];

const RECENT_ACTIVITY = [
  { action: "Alex Johnson completed TOEFL Practice #2", time: "2 hours ago", score: 112, type: "score" },
  { action: "Maria Garcia registered for Full Simulation", time: "4 hours ago", type: "register" },
  { action: "New exam 'Full Simulation Oct' created", time: "Yesterday", type: "create" },
  { action: "Chen Wei completed TOEFL Practice #1", time: "2 days ago", score: 104, type: "score" },
  { action: "Question bank updated: +15 Reading questions", time: "3 days ago", type: "update" },
];

const UPCOMING_EXAMS = [
  { title: "TOEFL Full Simulation", date: "Oct 18, 2026", enrolled: 24, capacity: 50 },
  { title: "Reading Practice #3", date: "Oct 22, 2026", enrolled: 11, capacity: 30 },
  { title: "TOEFL iBT Mock #3", date: "Oct 30, 2026", enrolled: 5, capacity: 50 },
];

export default function AdminDashboardContent() {
  return (
    <div className={styles.content}>
      {/* Stats grid */}
      <div className={`${styles.statsGrid} animate-fadeInUp`}>
        {STATS.map((s) => (
          <div key={s.label} className={`card ${styles.statCard}`}>
            <div className={styles.statTop}>
              <span className={styles.statIcon}>{s.icon}</span>
              <span className={`${styles.statChange} ${s.positive ? styles.positive : styles.negative}`}>
                {s.change}
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  {s.positive
                    ? <polyline points="18 15 12 9 6 15" />
                    : <polyline points="6 9 12 15 18 9" />}
                </svg>
              </span>
            </div>
            <p className={styles.statValue}>{s.value}</p>
            <p className={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      <div className={`${styles.twoCol} animate-fadeInUp delay-100`}>
        {/* Quick Actions */}
        <div className={`card ${styles.panel}`}>
          <h3 className={styles.panelTitle}>Quick Actions</h3>
          <div className={styles.actionGrid}>
            {QUICK_ACTIONS.map((action) => (
              <Link key={action.label} href={action.href} className={`${styles.actionCard} ${styles[`action_${action.color}`]}`}>
                <span className={styles.actionIcon}>{action.icon}</span>
                <span className={styles.actionLabel}>{action.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className={`card ${styles.panel}`}>
          <div className={styles.panelHeader}>
            <h3 className={styles.panelTitle}>Upcoming Exams</h3>
            <Link href="/admin/exams" className="btn btn-secondary btn-sm">View All</Link>
          </div>
          <div className={styles.upcomingList}>
            {UPCOMING_EXAMS.map((exam) => (
              <div key={exam.title} className={styles.upcomingItem}>
                <div>
                  <p className={styles.upcomingTitle}>{exam.title}</p>
                  <p className={styles.upcomingDate}>{exam.date}</p>
                </div>
                <div className={styles.enrollInfo}>
                  <span className={styles.enrollCount}>{exam.enrolled}/{exam.capacity}</span>
                  <div className={styles.enrollBar}>
                    <div
                      className={styles.enrollFill}
                      style={{ width: `${(exam.enrolled / exam.capacity) * 100}%` }}
                    />
                  </div>
                  <span className={styles.enrollLabel}>enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={`card ${styles.panel} animate-fadeInUp delay-200`}>
        <div className={styles.panelHeader}>
          <h3 className={styles.panelTitle}>Recent Activity</h3>
          <Link href="/admin/results" className="btn btn-secondary btn-sm">View Analytics</Link>
        </div>
        <div className={styles.activityList}>
          {RECENT_ACTIVITY.map((item, i) => (
            <div key={i} className={styles.activityItem}>
              <div className={`${styles.activityDot} ${styles[`dot_${item.type}`]}`} />
              <div className={styles.activityBody}>
                <p className={styles.activityText}>{item.action}</p>
                <p className={styles.activityTime}>{item.time}</p>
              </div>
              {item.score !== undefined && (
                <div className={styles.activityScore}>
                  Score: <strong>{item.score}</strong>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
