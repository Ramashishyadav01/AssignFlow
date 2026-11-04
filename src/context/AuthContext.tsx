import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { User } from '../data/seedData';
import {
  getUsers,
  getCurrentUserId,
  setCurrentUserId,
  clearCurrentUser,
  getUserById,
} from '../utils/storage';

interface AuthContextValue {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const id = getCurrentUserId();
    if (id) {
      return getUserById(id) ?? null;
    }
    return null;
  });

  const login = useCallback((email: string): boolean => {
    const users = getUsers();
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
    if (user) {
      setCurrentUserId(user.id);
      setCurrentUser(user);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    clearCurrentUser();
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
