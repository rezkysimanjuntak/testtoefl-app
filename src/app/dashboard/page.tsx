import AppShell from "@/components/AppShell/AppShell";
import UserDashboardContent from "./UserDashboardContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <AppShell
      title="My Dashboard"
      subtitle="Welcome back! Here's an overview of your exam activity."
      requiredRole="user"
    >
      <UserDashboardContent />
    </AppShell>
  );
}
