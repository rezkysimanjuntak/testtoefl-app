"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import {
  authenticate,
  saveSession,
  getSession,
  clearSession,
  type AuthUser,
  type UserRole,
} from "@/lib/auth";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    role: UserRole
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getSession();
    setUser(session);
    setLoading(false);
  }, []);

  const login = useCallback(
    async (
      email: string,
      password: string,
      role: UserRole
    ): Promise<{ success: boolean; error?: string }> => {
      const authUser = authenticate(email, password, role);
      if (!authUser) {
        return { success: false, error: "Invalid credentials. Please try again." };
      }
      saveSession(authUser);
      setUser(authUser);
      if (authUser.role === "admin") {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
      return { success: true };
    },
    [router]
  );

  const logout = useCallback(() => {
    clearSession();
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
