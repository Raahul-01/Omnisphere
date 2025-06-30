"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check with mock data
    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Mock sign in
    setUser({
      uid: 'mock-user-id',
      email: email,
      displayName: 'Mock User'
    });
  };

  const signUp = async (email: string, password: string) => {
    // Mock sign up
    setUser({
      uid: 'mock-user-id',
      email: email,
      displayName: 'Mock User'
    });
  };

  const logout = async () => {
    // Mock logout
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}