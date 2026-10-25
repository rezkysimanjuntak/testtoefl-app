"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "@/components/Sidebar/Sidebar";
import Topbar from "@/components/Topbar/Topbar";
import type { UserRole } from "@/lib/auth";
import styles from "./AppShell.module.css";

interface AppShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  requiredRole?: UserRole;
}

export default function AppShell({
  children,
  title,
  subtitle,
  requiredRole,
}: AppShellProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/");
      return;
    }
    if (requiredRole && user.role !== requiredRole) {
      // Redirect to their own dashboard
      router.push(user.role === "admin" ? "/admin" : "/dashboard");
    }
  }, [user, loading, requiredRole, router]);

  if (loading) {
    return (
      <div className={styles.loadingScreen}>
        <div className={styles.loadingSpinner} />
        <p className={styles.loadingText}>Loading…</p>
      </div>
    );
  }

  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return (
    <div className={`${styles.shell} app-layout`}>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      {/* Sidebar */}
      <div className={`${styles.sidebarWrapper} ${mobileOpen ? styles.mobileVisible : ""}`}>
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
        />
      </div>

      {/* Main content */}
      <div className={`${styles.contentWrapper} main-content`}>
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuToggle={() => setMobileOpen((o) => !o)}
        />
        <main className={styles.pageContent}>{children}</main>
      </div>
    </div>
  );
}
