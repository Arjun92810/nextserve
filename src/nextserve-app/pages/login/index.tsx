'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged in!');
        router.push('/profile');
      }
    } catch (err) {
      toast.error('Unexpected error logging in.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/profile' },
    });
    if (error) {
      toast.error('Google login failed');
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Log In</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email and password or use Google to log in.
        </p>

        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        />

        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
        />

        <button
          onClick={handleEmailLogin}
          disabled={loading || !email || !password}
          className={`w-full px-4 py-2 text-white rounded-md transition ${
            loading || !email || !password
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Logging in...' : 'Login with Email'}
        </button>

        <div className="my-4 text-center text-gray-400">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>

        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
