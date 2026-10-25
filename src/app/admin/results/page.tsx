import AppShell from "@/components/AppShell/AppShell";
import AdminResultsContent from "./AdminResultsContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Results & Analytics" };

export default function AdminResultsPage() {
  return (
    <AppShell title="Results & Analytics" subtitle="Exam performance metrics and examinee score analytics." requiredRole="admin">
      <AdminResultsContent />
    </AppShell>
  );
}
