"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/ThemeToggle/ThemeToggle";
import styles from "./page.module.css";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, loading, router]);

  // Always render the page content during SSR
  // The useEffect will handle redirects on the client side
  // This ensures the segment is never dropped from rendering

  return (
    <div className={styles.page}>
      <div className={styles.bg}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
        <div className={styles.grid} />
      </div>

      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c3 3 9 3 12 0v-5" />
            </svg>
          </div>
          <span className={styles.logoText}>TOEFL<span>Exam</span></span>
        </div>
        <ThemeToggle />
      </header>

      <main className={styles.main}>
        {/* Hero */}
        <section className={`${styles.hero} animate-fadeInUp`}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot} />
            Professional TOEFL Testing Platform
          </div>
          <h1 className={styles.heroTitle}>
            Exam Excellence
            <br />
            <span className={styles.heroGradient}>Starts Here</span>
          </h1>
          <p className={styles.heroDesc}>
            A secure, modern TOEFL examination platform for institutions and examinees. 
            Precision-crafted for authentic test experiences.
          </p>
        </section>

        {/* Login cards */}
        <section className={`${styles.cards} animate-fadeInUp delay-200`}>
          {/* Admin Card */}
          <Link href="/login/admin" className={styles.roleCard} id="admin-portal-link">
            <div className={styles.cardGlow} data-variant="admin" />
            <div className={styles.cardIcon} data-variant="admin">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div className={styles.cardContent}>
              <span className={`badge badge-brand ${styles.cardBadge}`}>Administrator</span>
              <h2 className={styles.cardTitle}>Admin Portal</h2>
              <p className={styles.cardDesc}>
                Manage exams, question banks, users, and view comprehensive analytics and results.
              </p>
              <div className={styles.cardFeatures}>
                <span>✦ Exam Management</span>
                <span>✦ User Administration</span>
                <span>✦ Analytics Dashboard</span>
              </div>
            </div>
            <div className={styles.cardArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>

          {/* User Card */}
          <Link href="/login/user" className={styles.roleCard} id="user-portal-link">
            <div className={styles.cardGlow} data-variant="user" />
            <div className={styles.cardIcon} data-variant="user">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className={styles.cardContent}>
              <span className={`badge badge-success ${styles.cardBadge}`}>Examinee</span>
              <h2 className={styles.cardTitle}>Examinee Portal</h2>
              <p className={styles.cardDesc}>
                Take your TOEFL examination, track progress, and access your official score reports.
              </p>
              <div className={styles.cardFeatures}>
                <span>✦ Take Exams</span>
                <span>✦ Track Progress</span>
                <span>✦ View Score Reports</span>
              </div>
            </div>
            <div className={styles.cardArrow}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </Link>
        </section>

        {/* Stats bar */}
        <section className={`${styles.statsBar} animate-fadeInUp delay-300`}>
          {[
            { value: "10,000+", label: "Examinees" },
            { value: "500+", label: "Institutions" },
            { value: "99.9%", label: "Uptime" },
            { value: "ISO 27001", label: "Certified" },
          ].map((stat) => (
            <div key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </section>
      </main>

      <footer className={styles.footer}>
        <p>© 2026 TOEFLExam Platform. All rights reserved.</p>
        <p className={styles.footerNote}>Designed for Safe Exam Browser compatibility</p>
      </footer>
    </div>
  );
}
