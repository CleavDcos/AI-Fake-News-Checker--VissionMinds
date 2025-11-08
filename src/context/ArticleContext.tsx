import React, { createContext, useState, ReactNode } from 'react';
import { VerifyResponse } from '../services/verifyService';

export interface ArticleContextType {
  currentVerification: VerifyResponse | null;
  setCurrentVerification: (verification: VerifyResponse | null) => void;
  clearVerification: () => void;
}

export const ArticleContext = createContext<ArticleContextType | undefined>(undefined);

interface ArticleProviderProps {
  children: ReactNode;
}

export const ArticleProvider: React.FC<ArticleProviderProps> = ({ children }) => {
  const [currentVerification, setCurrentVerification] = useState<VerifyResponse | null>(null);

  const clearVerification = () => {
    setCurrentVerification(null);
  };

  const value: ArticleContextType = {
    currentVerification,
    setCurrentVerification,
    clearVerification,
  };

  return <ArticleContext.Provider value={value}>{children}</ArticleContext.Provider>;
};
