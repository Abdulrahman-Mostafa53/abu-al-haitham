import { useMemo, useState, type ReactNode } from "react";
import { AuthContext } from "./context";
import { ROLES, type Role } from "./types";

const KEY = "ah-role";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role | null>(null);

  const value = useMemo(
    () => ({
      role,
      login: (r: Role, id = null ,email = null , password) => {

      },
      logout: () => {
        setRole(null);
        try { localStorage.removeItem(KEY); } catch { }
      },
    }),
    [role],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
