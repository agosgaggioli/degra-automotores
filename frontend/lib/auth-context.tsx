'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdmin, fetchMe } from './api';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const TOKEN_KEY = 'dr_admin_token';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem(TOKEN_KEY) : null;

    if (!token) {
      setLoading(false);
      return;
    }

    fetchMe()
      .then(({ user: me }) => setUser(me))
      .catch(() => {
        window.localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function login(email: string, password: string) {
    const { token, user: loggedUser } = await loginAdmin(email, password);
    window.localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedUser);
  }

  function logout() {
    window.localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push('/admin/login');
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return ctx;
}
