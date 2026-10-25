import AppShell from "@/components/AppShell/AppShell";
import ExamsListContent from "./ExamsListContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Exams" };

export default function ExamsPage() {
  return (
    <AppShell title="My Exams" subtitle="View available exams and track your progress." requiredRole="user">
      <ExamsListContent />
    </AppShell>
  );
}
