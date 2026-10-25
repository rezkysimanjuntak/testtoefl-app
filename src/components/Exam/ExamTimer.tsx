"use client";

import { useEffect, useState, useRef } from "react";
import styles from "./ExamTimer.module.css";

interface ExamTimerProps {
  initialMs: number;
  onTimeUp: () => void;
}

function formatTime(ms: number) {
  const totalSecs = Math.floor(ms / 1000);
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ExamTimer({ initialMs, onTimeUp }: ExamTimerProps) {
  const [remaining, setRemaining] = useState(Math.max(0, initialMs));
  const calledRef = useRef(false);

  useEffect(() => {
    if (remaining <= 0) {
      if (!calledRef.current) {
        calledRef.current = true;
        onTimeUp();
      }
      return;
    }

    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = Math.max(0, prev - 1000);
        if (next === 0 && !calledRef.current) {
          calledRef.current = true;
          onTimeUp();
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [remaining, onTimeUp]);

  const isWarning = remaining <= 5 * 60 * 1000; // ≤ 5 min
  const isDanger = remaining <= 60 * 1000; // ≤ 1 min

  return (
    <div
      className={`${styles.timer} ${isWarning ? styles.warning : ""} ${isDanger ? styles.danger : ""}`}
      role="timer"
      aria-live="off"
      aria-label={`Time remaining: ${formatTime(remaining)}`}
    >
      <svg
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={isDanger ? styles.pulseSvg : ""}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className={styles.time}>{formatTime(remaining)}</span>
      {isWarning && !isDanger && (
        <span className={styles.warningLabel}>Low time</span>
      )}
      {isDanger && <span className={styles.warningLabel}>⚠ Hurry!</span>}
    </div>
  );
}
