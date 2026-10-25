import AppShell from "@/components/AppShell/AppShell";
import AdminUsersContent from "./AdminUsersContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "User Management" };

export default function AdminUsersPage() {
  return (
    <AppShell title="User Management" subtitle="View and manage all registered users." requiredRole="admin">
      <AdminUsersContent />
    </AppShell>
  );
}
