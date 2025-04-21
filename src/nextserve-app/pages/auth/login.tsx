import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error('Login failed: ' + error.message);
    } else {
      toast.success('Logged in successfully!');
      router.push('/profile');
    }

    setLoading(false);
  };

  const handleOAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/profile' },
    });
    if (error) toast.error('Google login failed');
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Log in to NextServe</h1>

        {/* Email */}
        <label className="block text-gray-700 mb-1" htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        {/* Password */}
        <label className="block text-gray-700 mb-1" htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />

        {/* Email login button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login with Email'}
        </button>

        {/* Divider */}
        <div className="my-6 text-center text-gray-400">or</div>

        {/* Google login */}
        <button
          onClick={handleOAuth}
          className="w-full border border-gray-300 py-2 rounded-md bg-white text-black hover:bg-gray-100 transition"
        >
          Continue with Google
        </button>

        {/* Sign-up link */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="/auth/signup" className="text-blue-600 hover:underline">Sign up</a>
        </p>
      </div>
    </main>
  );
}
