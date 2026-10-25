import AppShell from "@/components/AppShell/AppShell";
import AdminQuestionsContent from "./AdminQuestionsContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Question Bank" };

export default function AdminQuestionsPage() {
  return (
    <AppShell title="Question Bank" subtitle="Browse, add, and manage all exam questions." requiredRole="admin">
      <AdminQuestionsContent />
    </AppShell>
  );
}
