"use client";

import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import styles from "./Topbar.module.css";

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuToggle?: () => void;
}

export default function Topbar({ title, subtitle, onMenuToggle }: TopbarProps) {
  const { user } = useAuth();
  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        {/* Mobile menu button */}
        <button
          className={`${styles.menuBtn} hide-desktop`}
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div>
          <h2 className={styles.title}>{title}</h2>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      </div>

      <div className={styles.right}>
        <span className={`${styles.dateText} hide-mobile`}>{dateStr}</span>

        <ThemeToggle />

        {/* Notification bell */}
        <button className={styles.iconBtn} aria-label="Notifications">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className={styles.notifDot} />
        </button>

        {/* Avatar */}
        <div className={styles.avatar} title={user?.name}>
          {user?.avatar ?? user?.name?.slice(0, 2).toUpperCase()}
        </div>
      </div>
    </header>
  );
}
