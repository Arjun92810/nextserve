'use client';

import { lazy } from 'react';

// Disable SSR for this page
export const dynamic = 'force-dynamic';

// Import LoginForm with no SSR
const LoginForm = lazy(() => import('@/components/LoginForm'));

export default function LoginPage() {
  return <LoginForm />;
} 