"use client";

import Link from "next/link";
import type { Exam } from "@/lib/examData";
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import styles from "./ExamStartScreen.module.css";

interface ExamStartScreenProps {
  exam: Exam;
  onStart: () => void;
}

export default function ExamStartScreen({ exam, onStart }: ExamStartScreenProps) {
  const hours = Math.floor(exam.durationMinutes / 60);
  const mins = exam.durationMinutes % 60;
  const timeLabel = hours > 0 ? `${hours}h ${mins > 0 ? `${mins}m` : ""}` : `${mins} minutes`;

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>

      {/* Top bar */}
      <header className={styles.topBar}>
        <Link href="/dashboard/exams" className={styles.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back to Exams
        </Link>
        <div className={styles.logoArea}>
          <div className={styles.logoIcon}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className={styles.logoText}>TOEFL<span>Exam</span></span>
        </div>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        <div className={`${styles.card} card-glass animate-fadeInUp`}>
          {/* Badge */}
          <div className={styles.examBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            TOEFL Reading Section
          </div>

          <h1 className={styles.title}>{exam.title}</h1>
          <p className={styles.desc}>{exam.description}</p>

          {/* Stats grid */}
          <div className={styles.statsGrid}>
            {[
              { icon: "⏱", label: "Time Limit", value: timeLabel },
              { icon: "📝", label: "Questions", value: String(exam.questions.length) },
              { icon: "📖", label: "Passages", value: String(exam.passages.length) },
              { icon: "🏆", label: "Max Score", value: String(exam.maxScore) },
            ].map((s) => (
              <div key={s.label} className={styles.statItem}>
                <span className={styles.statIcon}>{s.icon}</span>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>

          {/* Instructions */}
          <div className={styles.instructions}>
            <h2 className={styles.instructTitle}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Before You Begin
            </h2>
            <ul className={styles.instructList}>
              {[
                "Read each passage carefully before answering related questions.",
                "Each question has only one correct answer.",
                "You can flag questions to review them before submitting.",
                "The timer starts as soon as you click 'Start Exam'.",
                "Your exam will auto-submit when the time expires.",
                "You can navigate freely between questions during the exam.",
                "Do not refresh or close the browser tab during the exam.",
              ].map((inst, i) => (
                <li key={i} className={styles.instructItem}>
                  <span className={styles.instructNum}>{i + 1}</span>
                  {inst}
                </li>
              ))}
            </ul>
          </div>

          {/* Passages preview */}
          <div className={styles.passagesPreview}>
            <h2 className={styles.instructTitle}>Passages in this Exam</h2>
            <div className={styles.passageList}>
              {exam.passages.map((p, i) => (
                <div key={p.id} className={styles.passageItem}>
                  <span className={styles.passageNum}>Passage {i + 1}</span>
                  <span className={styles.passageTitle}>{p.title}</span>
                  <span className={styles.passageQCount}>{p.questionIds.length} questions</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className={styles.cta}>
            <Link href="/dashboard/exams" className="btn btn-secondary btn-lg">
              Cancel
            </Link>
            <button
              id="start-exam-btn"
              className="btn btn-primary btn-lg"
              onClick={onStart}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
              Start Exam Now
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
