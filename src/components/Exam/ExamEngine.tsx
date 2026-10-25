"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Exam, Question, Passage } from "@/lib/examData";
import {
  type ExamSession,
  saveExamSession,
  clearExamSession,
  getRemainingMs,
} from "@/lib/examSession";
import ExamTimer from "./ExamTimer";
import styles from "./ExamEngine.module.css";

interface Props {
  exam: Exam;
  session: ExamSession;
}

function getPassageForQuestion(exam: Exam, question: Question): Passage | undefined {
  return exam.passages.find((p) => p.questionIds.includes(question.id));
}

export default function ExamEngine({ exam, session: initialSession }: Props) {
  const router = useRouter();
  const [session, setSession] = useState<ExamSession>(initialSession);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showNavPanel, setShowNavPanel] = useState(true);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const passageRef = useRef<HTMLDivElement>(null);

  const questions = exam.questions;
  const currentQ = questions[currentQIndex];
  const currentPassage = currentQ ? getPassageForQuestion(exam, currentQ) : undefined;

  // ── Persist session on every change ──────────────
  const updateSession = useCallback((updates: Partial<ExamSession>) => {
    setSession((prev) => {
      const next = { ...prev, ...updates };
      saveExamSession(next);
      return next;
    });
  }, []);

  // ── Answer a question ─────────────────────────────
  const handleAnswer = useCallback(
    (answerId: string) => {
      updateSession({
        answers: { ...session.answers, [currentQ.id]: answerId },
      });
    },
    [currentQ?.id, session.answers, updateSession]
  );

  // ── Flag / unflag ─────────────────────────────────
  const toggleFlag = useCallback(() => {
    const flagged = session.flagged.includes(currentQ.id)
      ? session.flagged.filter((id) => id !== currentQ.id)
      : [...session.flagged, currentQ.id];
    updateSession({ flagged });
  }, [currentQ?.id, session.flagged, updateSession]);

  // ── Submit ────────────────────────────────────────
  const submitExam = useCallback(
    (timedOut = false) => {
      const correct = questions.filter(
        (q) => session.answers[q.id] === q.correctAnswerId
      ).length;

      // Scale to max score (e.g. 30 for reading)
      const rawScore = Math.round((correct / questions.length) * exam.maxScore);

      const finalSession: ExamSession = {
        ...session,
        submitted: true,
        finishedAt: Date.now(),
        score: rawScore,
      };
      saveExamSession(finalSession);

      router.push(`/exam/${exam.id}/result`);
    },
    [exam.id, exam.maxScore, questions, session, router]
  );

  // ── Auto-submit on timer expiry ───────────────────
  const handleTimeUp = useCallback(() => {
    submitExam(true);
  }, [submitExam]);

  // ── Scroll passage top when question changes ──────
  useEffect(() => {
    passageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentQIndex]);

  const answeredCount = questions.filter((q) => session.answers[q.id]).length;
  const flaggedCount = session.flagged.length;
  const unansweredCount = questions.length - answeredCount;
  const isFlagged = session.flagged.includes(currentQ?.id ?? "");
  const currentAnswer = session.answers[currentQ?.id ?? ""];

  // Group questions by passage for nav panel
  const passageGroups = exam.passages.map((p) => ({
    passage: p,
    questions: questions.filter((q) => p.questionIds.includes(q.id)),
  }));

  return (
    <div className={styles.shell}>
      {/* ── Top Header ── */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logoIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            </svg>
          </div>
          <span className={styles.examTitle}>{exam.title}</span>
          <span className="badge badge-brand hide-mobile">Reading Section</span>
        </div>

        <div className={styles.headerCenter}>
          <ExamTimer
            initialMs={getRemainingMs(session)}
            onTimeUp={handleTimeUp}
          />
        </div>

        <div className={styles.headerRight}>
          <div className={styles.progressPill}>
            <span>{answeredCount}/{questions.length}</span>
            <span className={styles.progressPillLabel}>answered</span>
          </div>
          <button
            className={`btn btn-secondary btn-sm ${styles.navToggle}`}
            onClick={() => setShowNavPanel((v) => !v)}
            aria-label="Toggle navigation panel"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="hide-mobile">Navigator</span>
          </button>
          <button
            id="submit-exam-btn"
            className="btn btn-primary btn-sm"
            onClick={() => setShowSubmitModal(true)}
          >
            Submit Exam
          </button>
        </div>
      </header>

      {/* ── Body ── */}
      <div className={styles.body}>
        {/* ── Left: Passage ── */}
        <div className={styles.passagePanel} ref={passageRef}>
          {currentPassage ? (
            <>
              <div className={styles.passageHeader}>
                <div className={styles.passageMeta}>
                  <span className="badge badge-neutral">
                    Passage {exam.passages.indexOf(currentPassage) + 1} of {exam.passages.length}
                  </span>
                </div>
                <h2 className={styles.passageTitle}>{currentPassage.title}</h2>
              </div>
              <div className={styles.passageBody}>
                {currentPassage.body.split("\n\n").map((para, i) => (
                  <p key={i} className={styles.passagePara}>{para}</p>
                ))}
              </div>
            </>
          ) : (
            <p className={styles.noPassage}>No passage for this question.</p>
          )}
        </div>

        {/* ── Right: Question + Nav ── */}
        <div className={styles.rightPanel}>
          {/* Question panel */}
          <div className={styles.questionPanel}>
            {/* Question header */}
            <div className={styles.questionHeader}>
              <div className={styles.questionMeta}>
                <span className={styles.questionNum}>
                  Question {currentQ.number} <span className={styles.ofTotal}>of {questions.length}</span>
                </span>
                <button
                  className={`${styles.flagBtn} ${isFlagged ? styles.flagged : ""}`}
                  onClick={toggleFlag}
                  aria-label={isFlagged ? "Unflag question" : "Flag for review"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill={isFlagged ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                    <line x1="4" y1="22" x2="4" y2="15" />
                  </svg>
                  {isFlagged ? "Flagged" : "Flag"}
                </button>
              </div>
              <p className={styles.questionText}>{currentQ.text}</p>
            </div>

            {/* Answer options */}
            <div className={styles.answers}>
              {currentQ.answers.map((ans) => {
                const isSelected = currentAnswer === ans.id;
                return (
                  <button
                    key={ans.id}
                    id={`answer-${ans.id}`}
                    className={`${styles.answerOption} ${isSelected ? styles.selected : ""}`}
                    onClick={() => handleAnswer(ans.id)}
                  >
                    <span className={`${styles.answerLetter} ${isSelected ? styles.letterSelected : ""}`}>
                      {ans.id.toUpperCase()}
                    </span>
                    <span className={styles.answerText}>{ans.text}</span>
                    {isSelected && (
                      <span className={styles.checkIcon}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next */}
            <div className={styles.navButtons}>
              <button
                className="btn btn-secondary"
                onClick={() => setCurrentQIndex((i) => Math.max(0, i - 1))}
                disabled={currentQIndex === 0}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                Previous
              </button>
              <button
                className="btn btn-primary"
                onClick={() => setCurrentQIndex((i) => Math.min(questions.length - 1, i + 1))}
                disabled={currentQIndex === questions.length - 1}
              >
                Next
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigator panel */}
          {showNavPanel && (
            <div className={styles.navPanel}>
              <div className={styles.navLegend}>
                <span className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotAnswered}`} />Answered
                </span>
                <span className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotFlagged}`} />Flagged
                </span>
                <span className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotCurrent}`} />Current
                </span>
                <span className={styles.legendItem}>
                  <span className={`${styles.legendDot} ${styles.dotUnanswered}`} />Unanswered
                </span>
              </div>

              {passageGroups.map((group, gi) => (
                <div key={group.passage.id} className={styles.navGroup}>
                  <p className={styles.navGroupLabel}>
                    Passage {gi + 1}: {group.passage.title}
                  </p>
                  <div className={styles.navGrid}>
                    {group.questions.map((q) => {
                      const qIdx = questions.indexOf(q);
                      const isAns = !!session.answers[q.id];
                      const isFlag = session.flagged.includes(q.id);
                      const isCur = qIdx === currentQIndex;

                      return (
                        <button
                          key={q.id}
                          className={`${styles.navCell} ${isCur ? styles.navCurrent : isFlag ? styles.navFlagged : isAns ? styles.navAnswered : styles.navUnanswered}`}
                          onClick={() => setCurrentQIndex(qIdx)}
                          title={`Question ${q.number}${isFlag ? " (flagged)" : ""}${isAns ? " (answered)" : ""}`}
                        >
                          {q.number}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className={styles.navSummary}>
                <span>✅ {answeredCount} answered</span>
                <span>🚩 {flaggedCount} flagged</span>
                <span>○ {unansweredCount} remaining</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Submit Confirmation Modal ── */}
      {showSubmitModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSubmitModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalIcon}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h3 className={styles.modalTitle}>Submit Exam?</h3>
            <div className={styles.modalStats}>
              <div className={styles.modalStat}>
                <span className={styles.modalStatVal}>{answeredCount}</span>
                <span className={styles.modalStatLabel}>Answered</span>
              </div>
              <div className={styles.modalStat}>
                <span className={`${styles.modalStatVal} ${unansweredCount > 0 ? styles.warn : ""}`}>
                  {unansweredCount}
                </span>
                <span className={styles.modalStatLabel}>Unanswered</span>
              </div>
              <div className={styles.modalStat}>
                <span className={styles.modalStatVal}>{flaggedCount}</span>
                <span className={styles.modalStatLabel}>Flagged</span>
              </div>
            </div>
            {unansweredCount > 0 && (
              <p className={styles.modalWarning}>
                You have {unansweredCount} unanswered question{unansweredCount !== 1 ? "s" : ""}. Unanswered questions will count as incorrect.
              </p>
            )}
            <div className={styles.modalActions}>
              <button className="btn btn-secondary" onClick={() => setShowSubmitModal(false)}>
                Continue Exam
              </button>
              <button className="btn btn-primary" onClick={() => submitExam(false)}>
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
