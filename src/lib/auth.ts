// Dummy credential store — replace with real auth in production
export type UserRole = "admin" | "user";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

const DUMMY_USERS: Array<AuthUser & { password: string }> = [
  {
    id: "admin-001",
    name: "Dr. Sarah Mitchell",
    email: "admin@toeflexam.edu",
    password: "Admin@1234",
    role: "admin",
    avatar: "SM",
  },
  {
    id: "admin-002",
    name: "Prof. James Harrington",
    email: "jharrington@toeflexam.edu",
    password: "Admin@5678",
    role: "admin",
    avatar: "JH",
  },
  {
    id: "user-001",
    name: "Alex Johnson",
    email: "alex.johnson@student.edu",
    password: "User@1234",
    role: "user",
    avatar: "AJ",
  },
  {
    id: "user-002",
    name: "Maria Garcia",
    email: "maria.garcia@student.edu",
    password: "User@5678",
    role: "user",
    avatar: "MG",
  },
  {
    id: "user-003",
    name: "Chen Wei",
    email: "chen.wei@student.edu",
    password: "User@9012",
    role: "user",
    avatar: "CW",
  },
];

export const SESSION_KEY = "toefl_session";

export function authenticate(
  email: string,
  password: string,
  role: UserRole
): AuthUser | null {
  const found = DUMMY_USERS.find(
    (u) => u.email === email && u.password === password && u.role === role
  );
  if (!found) return null;
  const { password: _pw, ...user } = found;
  return user;
}

export function saveSession(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function getSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    // Minimal guard: reject anything that isn't a known role.
    // Prevents self-promotion to admin by editing localStorage.
    if (parsed?.role !== "admin" && parsed?.role !== "user") return null;
    return parsed as AuthUser;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}
