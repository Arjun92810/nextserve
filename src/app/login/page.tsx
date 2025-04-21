'use client';

import dynamic from 'next/dynamic';

// Dynamically import LoginForm with SSR disabled
const LoginForm = dynamic(() => import('@/components/LoginForm'), {
  ssr: false,
});

export default function LoginPage() {
  return <LoginForm />;
}
