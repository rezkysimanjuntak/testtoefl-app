"use client";

import { useState } from "react";
import { EXAMS, type Exam } from "@/lib/examData";
import { EXAM_RESULTS } from "@/lib/adminData";
import styles from "./adminExams.module.css";

const STATUS_CFG = {
  upcoming: { label: "Upcoming", cls: "badge-warning" },
  completed: { label: "Completed", cls: "badge-success" },
  active: { label: "Active", cls: "badge-brand" },
};

function ExamModal({
  exam,
  onClose,
}: {
  exam: Exam | null;
  onClose: () => void;
}) {
  const isNew = !exam;
  const [title, setTitle] = useState(exam?.title ?? "");
  const [desc, setDesc] = useState(exam?.description ?? "");
  const [duration, setDuration] = useState(String(exam?.durationMinutes ?? 54));
  const [status, setStatus] = useState<"upcoming" | "active" | "completed">(
    exam?.status ?? "upcoming"
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Dummy save — just show feedback
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 1000);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{isNew ? "Create New Exam" : "Edit Exam"}</h3>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className="form-group">
            <label className="form-label">Exam Title</label>
            <input className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. TOEFL iBT Practice Test #3" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className={`form-input ${styles.textarea}`} value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Brief description of this exam..." rows={3} />
          </div>
          <div className={styles.modalRow}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Duration (minutes)</label>
              <input className="form-input" type="number" min={1} max={300} value={duration} onChange={(e) => setDuration(e.target.value)} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Status</label>
              <select className="form-input" value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
                <option value="upcoming">Upcoming</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {!isNew && (
            <div className={styles.examInfo}>
              <div className={styles.examInfoItem}>
                <span className={styles.examInfoLabel}>Section</span>
                <span className={styles.examInfoValue}>Reading</span>
              </div>
              <div className={styles.examInfoItem}>
                <span className={styles.examInfoLabel}>Questions</span>
                <span className={styles.examInfoValue}>{exam?.questions.length}</span>
              </div>
              <div className={styles.examInfoItem}>
                <span className={styles.examInfoLabel}>Passages</span>
                <span className={styles.examInfoValue}>{exam?.passages.length}</span>
              </div>
              <div className={styles.examInfoItem}>
                <span className={styles.examInfoLabel}>Max Score</span>
                <span className={styles.examInfoValue}>{exam?.maxScore}</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>
            Demo mode — changes are not persisted.
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave}>
              {saved ? "✓ Saved!" : isNew ? "Create Exam" : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminExamsContent() {
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "active">("all");
  const [search, setSearch] = useState("");
  const [editExam, setEditExam] = useState<Exam | null | undefined>(undefined); // undefined=closed, null=new
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = EXAMS.filter((e) => {
    const matchStatus = filter === "all" || e.status === filter;
    const matchSearch =
      search === "" ||
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.description.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const resultCountFor = (examId: string) =>
    EXAM_RESULTS.filter((r) => r.examId === examId).length;

  const avgScoreFor = (examId: string) => {
    const results = EXAM_RESULTS.filter((r) => r.examId === examId);
    if (!results.length) return null;
    return Math.round(results.reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / results.length);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={`${styles.header} animate-fadeInUp`}>
        <div>
          <h2 className={styles.pageTitle}>Exam Management</h2>
          <p className={styles.pageSubtitle}>{EXAMS.length} exams total</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditExam(null)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Exam
        </button>
      </div>

      {/* Toolbar */}
      <div className={`${styles.toolbar} animate-fadeInUp delay-100`}>
        <div className="input-wrapper" style={{ maxWidth: 320 }}>
          <span className="input-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="form-input input-has-icon"
            placeholder="Search exams…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterTabs}>
          {(["all", "upcoming", "completed", "active"] as const).map((f) => (
            <button
              key={f}
              className={`${styles.filterTab} ${filter === f ? styles.activeFilter : ""}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className={`card ${styles.tableCard} animate-fadeInUp delay-200`}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Exam</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Questions</th>
                <th>Attempts</th>
                <th>Avg Score</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((exam) => {
                const statusCfg = STATUS_CFG[exam.status];
                const attempts = resultCountFor(exam.id);
                const avg = avgScoreFor(exam.id);

                return (
                  <tr key={exam.id} className={styles.row}>
                    <td>
                      <div className={styles.examCell}>
                        <div className={styles.examCellIcon}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                        </div>
                        <div>
                          <p className={styles.examCellTitle}>{exam.title}</p>
                          <p className={styles.examCellSection}>Reading · {exam.passages.length} passages</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`badge ${statusCfg.cls}`}>{statusCfg.label}</span></td>
                    <td className={styles.tdMono}>{exam.durationMinutes} min</td>
                    <td className={styles.tdMono}>{exam.questions.length}</td>
                    <td className={styles.tdMono}>{attempts}</td>
                    <td>
                      {avg !== null ? (
                        <span className={`${styles.avgScore} ${avg >= 80 ? styles.avgGood : avg >= 60 ? styles.avgOk : styles.avgBad}`}>
                          {avg}%
                        </span>
                      ) : (
                        <span className={styles.noData}>—</span>
                      )}
                    </td>
                    <td className={styles.tdMono}>{exam.scheduledDate}</td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => setEditExam(exam)}
                          title="Edit exam"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                          Edit
                        </button>
                        <button
                          className="btn btn-sm"
                          style={{ color: "var(--danger-400)", border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.06)" }}
                          onClick={() => setDeleteId(exam.id)}
                          title="Delete exam"
                        >
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6M14 11v6" />
                            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.emptyRow}>No exams found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      {editExam !== undefined && (
        <ExamModal exam={editExam} onClose={() => setEditExam(undefined)} />
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className={styles.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={styles.modal} style={{ maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <div className={styles.deleteIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              </svg>
            </div>
            <h3 className={styles.modalTitle} style={{ textAlign: "center" }}>Delete Exam?</h3>
            <p className={styles.deleteWarning}>This action cannot be undone. All associated results will be lost.</p>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => setDeleteId(null)}>Delete Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
