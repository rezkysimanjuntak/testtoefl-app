"use client";

import { useState } from "react";
import { ALL_QUESTIONS, EXAMS, type Question } from "@/lib/examData";
import styles from "./adminQuestions.module.css";

const PASSAGE_TITLES: Record<string, string> = {
  p1: "The Origins of Agriculture",
  p2: "Deep-Sea Exploration",
  p3: "The Psychology of Decision-Making",
};

function QuestionModal({ q, onClose }: { q: Question | null; onClose: () => void }) {
  const isNew = !q;
  const [qText, setQText] = useState(q?.text ?? "");
  const [explanation, setExplanation] = useState(q?.explanation ?? "");
  const [correctId, setCorrectId] = useState(q?.correctAnswerId ?? "a");
  const [answers, setAnswers] = useState(
    q?.answers ?? [
      { id: "a", text: "" },
      { id: "b", text: "" },
      { id: "c", text: "" },
      { id: "d", text: "" },
    ]
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 900);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>{isNew ? "Add New Question" : `Edit Question #${q?.number}`}</h3>
          <button className={styles.modalClose} onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className="form-group">
            <label className="form-label">Question Text</label>
            <textarea
              className={`form-input ${styles.textarea}`}
              rows={3}
              value={qText}
              onChange={(e) => setQText(e.target.value)}
              placeholder="Enter the question…"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Answer Options</label>
            <div className={styles.answerList}>
              {answers.map((ans) => (
                <div key={ans.id} className={`${styles.answerRow} ${correctId === ans.id ? styles.correctRow : ""}`}>
                  <input
                    type="radio"
                    name="correct"
                    checked={correctId === ans.id}
                    onChange={() => setCorrectId(ans.id)}
                    className={styles.radio}
                    title="Mark as correct"
                  />
                  <span className={styles.answerLetter}>{ans.id.toUpperCase()}</span>
                  <input
                    className={`form-input ${styles.answerInput}`}
                    value={ans.text}
                    onChange={(e) => setAnswers((prev) => prev.map((a) => a.id === ans.id ? { ...a, text: e.target.value } : a))}
                    placeholder={`Option ${ans.id.toUpperCase()}…`}
                  />
                  {correctId === ans.id && (
                    <span className={styles.correctBadge}>✓ Correct</span>
                  )}
                </div>
              ))}
            </div>
            <p className={styles.radioHint}>Click the radio button to mark the correct answer.</p>
          </div>

          <div className="form-group">
            <label className="form-label">Explanation (optional)</label>
            <textarea
              className={`form-input ${styles.textarea}`}
              rows={2}
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Explain why the correct answer is correct…"
            />
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? "✓ Saved!" : isNew ? "Add Question" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminQuestionsContent() {
  const [search, setSearch] = useState("");
  const [filterPassage, setFilterPassage] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editQ, setEditQ] = useState<Question | null | undefined>(undefined);

  const filtered = ALL_QUESTIONS.filter((q) => {
    const matchPassage = filterPassage === "all" || q.passage === filterPassage;
    const matchSearch =
      search === "" || q.text.toLowerCase().includes(search.toLowerCase());
    return matchPassage && matchSearch;
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={`${styles.header} animate-fadeInUp`}>
        <div>
          <h2 className={styles.pageTitle}>Question Bank</h2>
          <p className={styles.pageSubtitle}>{ALL_QUESTIONS.length} questions across {Object.keys(PASSAGE_TITLES).length} passages</p>
        </div>
        <button className="btn btn-primary" onClick={() => setEditQ(null)}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Question
        </button>
      </div>

      {/* Toolbar */}
      <div className={`${styles.toolbar} animate-fadeInUp delay-100`}>
        <div className="input-wrapper" style={{ maxWidth: 300 }}>
          <span className="input-icon">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            className="form-input input-has-icon"
            placeholder="Search questions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className={`form-input ${styles.passageSelect}`}
          value={filterPassage}
          onChange={(e) => setFilterPassage(e.target.value)}
        >
          <option value="all">All Passages</option>
          {Object.entries(PASSAGE_TITLES).map(([id, title]) => (
            <option key={id} value={id}>{title}</option>
          ))}
        </select>
      </div>

      {/* Stats pills */}
      <div className={`${styles.statsPills} animate-fadeInUp delay-100`}>
        {Object.entries(PASSAGE_TITLES).map(([id, title]) => (
          <div key={id} className={styles.statPill}>
            <span className={styles.statPillCount}>
              {ALL_QUESTIONS.filter((q) => q.passage === id).length}
            </span>
            <span className={styles.statPillLabel}>{title}</span>
          </div>
        ))}
      </div>

      {/* Questions list */}
      <div className={`${styles.questionsList} animate-fadeInUp delay-200`}>
        {filtered.map((q) => {
          const isExpanded = expandedId === q.id;
          const passageTitle = q.passage ? PASSAGE_TITLES[q.passage] : "";

          return (
            <div key={q.id} className={`card ${styles.qCard}`}>
              {/* Question header row */}
              <div
                className={styles.qHeader}
                onClick={() => setExpandedId(isExpanded ? null : q.id)}
                role="button"
                aria-expanded={isExpanded}
              >
                <div className={styles.qLeft}>
                  <span className={styles.qNum}>Q{q.number}</span>
                  <div>
                    <p className={styles.qText}>{q.text}</p>
                    {passageTitle && (
                      <p className={styles.qPassage}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                        </svg>
                        {passageTitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className={styles.qRight}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => { e.stopPropagation(); setEditQ(q); }}
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                    Edit
                  </button>
                  <button className={`${styles.expandBtn} ${isExpanded ? styles.expanded : ""}`} aria-hidden>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Expanded answers */}
              {isExpanded && (
                <div className={styles.qBody}>
                  <div className={styles.answerGrid}>
                    {q.answers.map((ans) => {
                      const isCorrect = ans.id === q.correctAnswerId;
                      return (
                        <div key={ans.id} className={`${styles.answerChip} ${isCorrect ? styles.correctChip : ""}`}>
                          <span className={`${styles.chipLetter} ${isCorrect ? styles.chipLetterCorrect : ""}`}>
                            {ans.id.toUpperCase()}
                          </span>
                          <span className={styles.chipText}>{ans.text}</span>
                          {isCorrect && <span className={styles.correctLabel}>✓</span>}
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
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className={styles.empty}>No questions found matching your search.</div>
        )}
      </div>

      {editQ !== undefined && (
        <QuestionModal q={editQ} onClose={() => setEditQ(undefined)} />
      )}
    </div>
  );
}
