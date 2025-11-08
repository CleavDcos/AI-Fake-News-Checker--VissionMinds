import React from 'react';
import { AppRouter } from './router/AppRouter';
import { AuthProvider } from './context/AuthContext';
import { ArticleProvider } from './context/ArticleContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <ArticleProvider>
        <AppRouter />
        <Toaster position="top-right" richColors />
      </ArticleProvider>
    </AuthProvider>
  );
}
