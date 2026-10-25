import AppShell from "@/components/AppShell/AppShell";
import AdminDashboardContent from "./AdminDashboardContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <AppShell
      title="Admin Dashboard"
      subtitle="Platform overview and management hub."
      requiredRole="admin"
    >
      <AdminDashboardContent />
    </AppShell>
  );
}
