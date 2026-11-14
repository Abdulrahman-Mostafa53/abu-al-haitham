import { createContext, useContext } from "react";
import type { Role } from "./types";

export interface AuthValue {
  role: Role | null;
  login: (role: Role) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
