import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser } from '../types/user';

interface AuthContextValue {
  user: AuthUser;
  login: (username: string) => void;
  logout: () => void;
}

const GUEST: AuthUser = { username: '', isLoggedIn: false };

const AuthContext = createContext<AuthContextValue | null>(null);

// Login is a local simulation (no real API): we only remember the username in React state.
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser>(GUEST);

  const login = useCallback((username: string) => setUser({ username, isLoggedIn: true }), []);
  const logout = useCallback(() => setUser(GUEST), []);

  const value = useMemo(() => ({ user, login, logout }), [user, login, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
