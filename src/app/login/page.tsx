'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Import LoginForm with no SSR
const LoginForm = dynamic(() => import('@/components/LoginForm'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Loading...
        </h2>
      </div>
    </div>
  ),
});

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Loading...
          </h2>
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
} 