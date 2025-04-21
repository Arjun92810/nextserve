'use client';

import NoSSR from '@/components/NoSSR';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
  return (
    <NoSSR>
      <LoginForm />
    </NoSSR>
  );
} 