"use client";

import { useState } from "react";
import { ADMIN_USERS, EXAM_RESULTS, type AdminUser } from "@/lib/adminData";
import styles from "./adminUsers.module.css";

const STATUS_CFG = {
  active: { label: "Active", cls: "badge-success" },
  inactive: { label: "Inactive", cls: "badge-neutral" },
  suspended: { label: "Suspended", cls: "badge-danger" },
};

function UserDetailModal({ user, onClose }: { user: AdminUser; onClose: () => void }) {
  const userResults = EXAM_RESULTS.filter((r) => r.userId === user.id);
  const avgScore = userResults.length
    ? Math.round(userResults.reduce((s, r) => s + (r.score / r.maxScore) * 100, 0) / userResults.length)
    : null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>User Profile</h3>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* User info */}
          <div className={styles.userProfile}>
            <div className={styles.userAvatar} data-role={user.role}>{user.avatar}</div>
            <div className={styles.userProfileInfo}>
              <h4 className={styles.userName}>{user.name}</h4>
              <p className={styles.userEmail}>{user.email}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                <span className={`badge ${STATUS_CFG[user.status].cls}`}>{STATUS_CFG[user.status].label}</span>
                <span className={`badge ${user.role === "admin" ? "badge-brand" : "badge-neutral"}`}>
                  {user.role === "admin" ? "Administrator" : "Examinee"}
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className={styles.profileStats}>
            {[
              { label: "Registered", value: user.registeredAt },
              { label: "Last Active", value: user.lastActive },
              { label: "Exams Taken", value: String(user.examsAttempted) },
              { label: "Avg Score", value: avgScore !== null ? `${avgScore}%` : "—" },
            ].map((s) => (
              <div key={s.label} className={styles.profileStat}>
                <span className={styles.profileStatVal}>{s.value}</span>
                <span className={styles.profileStatLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Exam history */}
          {userResults.length > 0 && (
            <div className={styles.historySection}>
              <h5 className={styles.historyTitle}>Exam History</h5>
              <div className={styles.historyList}>
                {userResults.map((r) => (
                  <div key={r.id} className={styles.historyItem}>
                    <div>
                      <p className={styles.historyExam}>{r.examTitle}</p>
                      <p className={styles.historyDate}>{r.submittedAt} · {r.timeTakenMins} min</p>
                    </div>
                    <div className={styles.historyScore}>
                      <span className={styles.historyScoreVal}>{r.score}/{r.maxScore}</span>
                      <span className={`badge ${r.status === "passed" ? "badge-success" : "badge-danger"}`}>
                        {r.status === "passed" ? "Passed" : "Failed"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalFooter}>
          {user.status === "active" ? (
            <button className="btn btn-sm" style={{ color: "var(--warning-500)", border: "1px solid rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.07)" }}>
              Suspend User
            </button>
          ) : user.status === "suspended" ? (
            <button className="btn btn-sm" style={{ color: "#22c55e", border: "1px solid rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.07)" }}>
              Reactivate User
            </button>
          ) : null}
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

const FIELD: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6, fontSize: "0.8rem", fontWeight: 600, color: "var(--text-secondary)" };

function initialsOf(name: string) {
  return name.trim().split(/\s+/).map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

// `user` null = create mode
function UserFormModal({
  user,
  existingEmails,
  onSave,
  onClose,
}: {
  user: AdminUser | null;
  existingEmails: string[];
  onSave: (u: AdminUser) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [role, setRole] = useState<AdminUser["role"]>(user?.role ?? "user");
  const [status, setStatus] = useState<AdminUser["status"]>(user?.status ?? "active");
  const [error, setError] = useState("");

  function submit() {
    const n = name.trim();
    const e = email.trim().toLowerCase();
    if (!n) return setError("Name is required.");
    if (!/^\S+@\S+\.\S+$/.test(e)) return setError("Enter a valid email address.");
    if (existingEmails.includes(e) && e !== user?.email.toLowerCase()) return setError("That email is already in use.");
    onSave({
      id: user?.id ?? `${role}-${Date.now()}`,
      name: n,
      email: e,
      role,
      status,
      avatar: initialsOf(n),
      registeredAt: user?.registeredAt ?? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      examsAttempted: user?.examsAttempted ?? 0,
      lastActive: user?.lastActive ?? "Never",
    });
  }

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(ev) => ev.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{user ? "Edit User" : "Add User"}</h3>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.modalBody} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={FIELD}>Full name
            <input className="form-input" value={name} onChange={(ev) => setName(ev.target.value)} placeholder="e.g. Jane Doe" />
          </label>
          <label style={FIELD}>Email
            <input className="form-input" type="email" value={email} onChange={(ev) => setEmail(ev.target.value)} placeholder="jane@student.edu" />
          </label>
          <div style={{ display: "flex", gap: 12 }}>
            <label style={{ ...FIELD, flex: 1 }}>Role
              <select className="form-input" value={role} onChange={(ev) => setRole(ev.target.value as AdminUser["role"])}>
                <option value="user">Examinee</option>
                <option value="admin">Administrator</option>
              </select>
            </label>
            <label style={{ ...FIELD, flex: 1 }}>Status
              <select className="form-input" value={status} onChange={(ev) => setStatus(ev.target.value as AdminUser["status"])}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </label>
          </div>
          {error && <p style={{ color: "var(--danger-500)", fontSize: "0.8rem", margin: 0 }}>{error}</p>}
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>Demo mode — changes last until you reload the page.</p>
        </div>
        <div className={styles.modalFooter}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={submit}>{user ? "Save Changes" : "Create User"}</button>
        </div>
      </div>
    </div>
  );
}

function DeleteModal({ user, onConfirm, onClose }: { user: AdminUser; onConfirm: () => void; onClose: () => void }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(ev) => ev.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>Delete User</h3>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className={styles.modalBody}>
          <p style={{ margin: 0, color: "var(--text-secondary)" }}>
            Delete <strong>{user.name}</strong> ({user.email})? This cannot be undone.
          </p>
        </div>
        <div className={styles.modalFooter}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-sm" style={{ color: "#fff", background: "var(--danger-500)" }} onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

export default function AdminUsersContent() {
  const [users, setUsers] = useState<AdminUser[]>(ADMIN_USERS);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<"all" | "admin" | "user">("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive" | "suspended">("all");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [formUser, setFormUser] = useState<AdminUser | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);

  function saveUser(u: AdminUser) {
    setUsers((prev) => (prev.some((p) => p.id === u.id) ? prev.map((p) => (p.id === u.id ? u : p)) : [...prev, u]));
    setFormOpen(false);
  }

  const filtered = users.filter((u) => {
    const matchRole = filterRole === "all" || u.role === filterRole;
    const matchStatus = filterStatus === "all" || u.status === filterStatus;
    const matchSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const totalActive = users.filter((u) => u.status === "active").length;
  const totalExaminees = users.filter((u) => u.role === "user").length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={`${styles.header} animate-fadeInUp`}>
        <div>
          <h2 className={styles.pageTitle}>User Management</h2>
          <p className={styles.pageSubtitle}>{users.length} registered users · {totalActive} active</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setFormUser(null); setFormOpen(true); }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add User
        </button>
      </div>

      {/* Quick stats */}
      <div className={`${styles.quickStats} animate-fadeInUp delay-100`}>
        {[
          { icon: "👥", label: "Total Users", value: users.length, color: "brand" },
          { icon: "🟢", label: "Active", value: totalActive, color: "success" },
          { icon: "🎓", label: "Examinees", value: totalExaminees, color: "accent" },
          { icon: "🛡️", label: "Admins", value: users.filter((u) => u.role === "admin").length, color: "warning" },
        ].map((s) => (
          <div key={s.label} className={`card ${styles.quickStat}`}>
            <span className={styles.quickStatIcon}>{s.icon}</span>
            <div>
              <p className={styles.quickStatVal}>{s.value}</p>
              <p className={styles.quickStatLabel}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className={`${styles.toolbar} animate-fadeInUp delay-100`}>
        <div className="input-wrapper" style={{ maxWidth: 280 }}>
          <span className="input-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="form-input input-has-icon"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className={`form-input ${styles.select}`} value={filterRole} onChange={(e) => setFilterRole(e.target.value as typeof filterRole)}>
          <option value="all">All Roles</option>
          <option value="admin">Admins</option>
          <option value="user">Examinees</option>
        </select>
        <select className={`form-input ${styles.select}`} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}>
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Table */}
      <div className={`card ${styles.tableCard} animate-fadeInUp delay-200`}>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Registered</th>
                <th>Exams Taken</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className={styles.row}>
                  <td>
                    <div className={styles.userCell}>
                      <div className={styles.userCellAvatar} data-role={user.role}>{user.avatar}</div>
                      <div>
                        <p className={styles.userCellName}>{user.name}</p>
                        <p className={styles.userCellEmail}>{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${user.role === "admin" ? "badge-brand" : "badge-neutral"}`}>
                      {user.role === "admin" ? "Admin" : "Examinee"}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${STATUS_CFG[user.status].cls}`}>
                      {STATUS_CFG[user.status].label}
                    </span>
                  </td>
                  <td className={styles.tdMeta}>{user.registeredAt}</td>
                  <td className={styles.tdMeta}>{user.examsAttempted}</td>
                  <td className={styles.tdMeta}>{user.lastActive}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedUser(user)}>View</button>
                      <button className="btn btn-secondary btn-sm" onClick={() => { setFormUser(user); setFormOpen(true); }}>Edit</button>
                      <button className="btn btn-sm" style={{ color: "var(--danger-500)", border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.07)" }} onClick={() => setDeleteTarget(user)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className={styles.emptyRow}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <UserDetailModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}
      {formOpen && (
        <UserFormModal
          user={formUser}
          existingEmails={users.map((u) => u.email.toLowerCase())}
          onSave={saveUser}
          onClose={() => setFormOpen(false)}
        />
      )}
      {deleteTarget && (
        <DeleteModal
          user={deleteTarget}
          onConfirm={() => { setUsers((p) => p.filter((u) => u.id !== deleteTarget.id)); setDeleteTarget(null); }}
          onClose={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
