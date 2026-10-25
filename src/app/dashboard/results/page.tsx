import AppShell from "@/components/AppShell/AppShell";
import ResultsContent from "./ResultsContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Results" };

export default function ResultsPage() {
  return (
    <AppShell
      title="My Results"
      subtitle="Your exam history, score reports, and performance breakdown."
      requiredRole="user"
    >
      <ResultsContent />
    </AppShell>
  );
}
