'use client';

import dynamic from 'next/dynamic';

// Import LoginForm with no SSR
const LoginForm = dynamic(() => import('@/components/LoginForm'), {
  ssr: false,
});

export default function LoginPage() {
  return <LoginForm />;
} 