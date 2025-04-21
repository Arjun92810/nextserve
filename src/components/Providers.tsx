'use client';

import { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </Suspense>
  );
} 