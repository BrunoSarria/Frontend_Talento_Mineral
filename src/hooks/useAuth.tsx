import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { AuthSession } from "../types/api";
import { authService, type RegisterPayload } from "../services/authService";

interface AuthContextValue {
  session: AuthSession | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(() => authService.getSession());

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      isAuthenticated: Boolean(session),
      login: async (email, password) => {
        const s = await authService.login(email, password);
        setSession(s);
      },
      register: async (payload) => {
        const s = await authService.register(payload);
        setSession(s);
      },
      logout: async () => {
        await authService.logout();
        setSession(null);
      },
      refreshSession: () => {
        setSession(authService.getSession());
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
}
