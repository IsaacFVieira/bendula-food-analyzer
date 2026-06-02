'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AnalysisResult, FoodAnalysis, ManualFoodEntry, User } from '@/types';

interface AnalysisContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  currentAnalysis: AnalysisResult | null;
  setCurrentAnalysis: (analysis: AnalysisResult | null) => void;
  manualEntry: ManualFoodEntry | null;
  setManualEntry: (entry: ManualFoodEntry | null) => void;
  isLoggedIn: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);
  const [manualEntry, setManualEntry] = useState<ManualFoodEntry | null>(null);

  // Clear analysis on mount to prevent cross-session contamination
  useEffect(() => {
    setCurrentAnalysis(null);
    setManualEntry(null);
  }, []);

  const isLoggedIn = !!user;

  const login = (email: string, password: string): boolean => {
    // Simple mock login - in production, this would call an API
    if (email && password) {
      setUser({ email, name: email.split('@')[0] });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCurrentAnalysis(null);
    setManualEntry(null);
  };

  return (
    <AnalysisContext.Provider
      value={{
        user,
        setUser,
        currentAnalysis,
        setCurrentAnalysis,
        manualEntry,
        setManualEntry,
        isLoggedIn,
        login,
        logout,
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within an AnalysisProvider');
  }
  return context;
}
