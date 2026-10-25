import AppShell from "@/components/AppShell/AppShell";
import ProfileContent from "./ProfileContent";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

export default function ProfilePage() {
  return (
    <AppShell
      title="My Profile"
      subtitle="Your account information and performance overview."
      requiredRole="user"
    >
      <ProfileContent />
    </AppShell>
  );
}
