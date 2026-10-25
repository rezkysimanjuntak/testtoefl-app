"use client";

import { useState } from "react";
import { EXAM_RESULTS, ADMIN_USERS, getAnalytics, getScoreDistribution } from "@/lib/adminData";
import { EXAMS } from "@/lib/examData";
import styles from "./adminResults.module.css";

export default function AdminResultsContent() {
  const [filterExam, setFilterExam] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "passed" | "failed">("all");
  const [search, setSearch] = useState("");

  const analytics = getAnalytics(filterExam);
  const distribution = getScoreDistribution(filterExam);
  const scopeLabel = filterExam === "all" ? "across all exams" : "for this exam";
  const maxDistCount = Math.max(...distribution.map((d) => d.count), 1);

  const filtered = EXAM_RESULTS.filter((r) => {
    const matchExam = filterExam === "all" || r.examId === filterExam;
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchSearch =
      search === "" ||
      r.userName.toLowerCase().includes(search.toLowerCase()) ||
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.examTitle.toLowerCase().includes(search.toLowerCase());
    return matchExam && matchStatus && matchSearch;
  });

  // Per-exam stats
  const examStats = EXAMS.filter((e) => filterExam === "all" || e.id === filterExam).map((exam) => {
    const results = EXAM_RESULTS.filter((r) => r.examId === exam.id);
    const avgPct = results.length
      ? Math.round(results.reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / results.length)
      : null;
    const passed = results.filter((r) => r.status === "passed").length;
    return { exam, results, avgPct, passed };
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={`${styles.header} animate-fadeInUp`}>
        <div>
          <h2 className={styles.pageTitle}>Results & Analytics</h2>
          <p className={styles.pageSubtitle}>{analytics.totalResults} submission{analytics.totalResults !== 1 ? "s" : ""} {scopeLabel}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label htmlFor="report-scope" style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" }}>Report scope</label>
          <select
            id="report-scope"
            className={`form-input ${styles.select}`}
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
          >
            <option value="all">All Exams (combined)</option>
            {EXAMS.map((e) => (
              <option key={e.id} value={e.id}>{e.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI cards */}
      <div className={`${styles.kpiGrid} animate-fadeInUp delay-100`}>
        {[
          {
            icon: "📋",
            label: "Total Submissions",
            value: analytics.totalResults,
            sub: scopeLabel,
            color: "brand",
          },
          {
            icon: "✅",
            label: "Pass Rate",
            value: `${analytics.passRate}%`,
            sub: `${analytics.passCount} passed`,
            color: "success",
          },
          {
            icon: "📊",
            label: "Avg Score",
            value: `${analytics.avgScore}%`,
            sub: "across submissions",
            color: "accent",
          },
          {
            icon: "👥",
            label: filterExam === "all" ? "Active Examinees" : "Examinees",
            value: analytics.activeUsers,
            sub: filterExam === "all" ? `of ${analytics.totalUsers} total` : "took this exam",
            color: "warning",
          },
        ].map((kpi) => (
          <div key={kpi.label} className={`card ${styles.kpiCard}`}>
            <div className={styles.kpiTop}>
              <span className={styles.kpiIcon}>{kpi.icon}</span>
              <span className={`${styles.kpiColor} ${styles[`kpi_${kpi.color}`]}`} />
            </div>
            <div className={styles.kpiValue}>{kpi.value}</div>
            <div className={styles.kpiLabel}>{kpi.label}</div>
            <div className={styles.kpiSub}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className={`${styles.chartsRow} animate-fadeInUp delay-100`}>
        {/* Score distribution */}
        <div className={`card ${styles.chartCard}`}>
          <h3 className={styles.chartTitle}>Score Distribution</h3>
          <div className={styles.barChart}>
            {distribution.map((bucket) => (
              <div key={bucket.label} className={styles.barItem}>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{
                      height: `${(bucket.count / maxDistCount) * 100}%`,
                      background: bucket.color,
                    }}
                  />
                </div>
                <span className={styles.barCount}>{bucket.count}</span>
                <span className={styles.barLabel}>{bucket.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Per-exam breakdown */}
        <div className={`card ${styles.chartCard}`}>
          <h3 className={styles.chartTitle}>Per-Exam Performance</h3>
          <div className={styles.examBreakdown}>
            {examStats.map(({ exam, results, avgPct, passed }) => (
              <div key={exam.id} className={styles.examBreakdownItem}>
                <div className={styles.breakdownHeader}>
                  <div className={styles.breakdownName}>
                    <p className={styles.breakdownTitle}>{exam.title}</p>
                    <p className={styles.breakdownMeta}>
                      {results.length} submissions · {passed} passed
                    </p>
                  </div>
                  <span
                    className={styles.breakdownScore}
                    style={{
                      color: !avgPct ? "var(--text-muted)" : avgPct >= 80 ? "#22c55e" : avgPct >= 60 ? "#f59e0b" : "#ef4444",
                    }}
                  >
                    {avgPct !== null ? `${avgPct}%` : "—"}
                  </span>
                </div>
                <div className={styles.breakdownBar}>
                  <div
                    className={styles.breakdownFill}
                    style={{
                      width: avgPct !== null ? `${avgPct}%` : "0%",
                      background: !avgPct ? "var(--border-default)" : avgPct >= 80 ? "#22c55e" : avgPct >= 60 ? "#f59e0b" : "#ef4444",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className={`${styles.toolbar} animate-fadeInUp delay-200`}>
        <div className="input-wrapper" style={{ maxWidth: 280 }}>
          <span className="input-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="form-input input-has-icon"
            placeholder="Search by name or exam…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={`form-input ${styles.select}`}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
        >
          <option value="all">All Statuses</option>
          <option value="passed">Passed</option>
          <option value="failed">Failed</option>
        </select>
        <span className={styles.resultCount}>{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Results table */}
      <div className={`card ${styles.tableCard} animate-fadeInUp delay-200`}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Examinee</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Correct</th>
                <th>Time Taken</th>
                <th>Submitted</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((result) => {
                const pct = Math.round((result.score / result.maxScore) * 100);
                return (
                  <tr key={result.id} className={styles.row}>
                    <td>
                      <div className={styles.userCell}>
                        <div className={styles.userAvatar}>
                          {result.userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div>
                          <p className={styles.userName}>{result.userName}</p>
                          <p className={styles.userEmail}>{result.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className={styles.examTitle}>{result.examTitle}</p>
                    </td>
                    <td>
                      <div className={styles.scoreCell}>
                        <span className={styles.scoreVal}>{result.score}/{result.maxScore}</span>
                        <span
                          className={styles.scorePct}
                          style={{ color: pct >= 80 ? "#22c55e" : pct >= 60 ? "#f59e0b" : "#ef4444" }}
                        >
                          {pct}%
                        </span>
                      </div>
                    </td>
                    <td className={styles.tdMeta}>{result.correctAnswers}/{result.totalQuestions}</td>
                    <td className={styles.tdMeta}>{result.timeTakenMins} min</td>
                    <td className={styles.tdMeta}>{result.submittedAt}</td>
                    <td>
                      <span className={`badge ${result.status === "passed" ? "badge-success" : "badge-danger"}`}>
                        {result.status === "passed" ? "Passed" : "Failed"}
                      </span>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>No results found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
