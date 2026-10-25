import AppShell from "@/components/AppShell/AppShell";
import AdminExamsContent from "./AdminExamsContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Manage Exams" };

export default function AdminExamsPage() {
  return (
    <AppShell title="Manage Exams" subtitle="Create, edit, and manage all TOEFL examinations." requiredRole="admin">
      <AdminExamsContent />
    </AppShell>
  );
}
