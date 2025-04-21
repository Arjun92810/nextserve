import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else onClose();
  };

  const handleOAuth = async (provider: 'google' | 'apple') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: process.env.NEXT_PUBLIC_SITE_URL + '/profile',
      },
    });
    if (error) setError(error.message);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="input w-full mb-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="input w-full mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin} className="btn w-full mb-4 bg-blue-600 text-white">
          Login
        </button>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleOAuth('google')}
            className="btn w-full border border-gray-300 text-black bg-white hover:bg-gray-100"
          >
            Continue with Google
          </button>
          <button
            onClick={() => handleOAuth('apple')}
            className="btn w-full border border-gray-800 text-white bg-black hover:bg-gray-900"
          >
            Continue with Apple
          </button>
        </div>

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

        <button onClick={onClose} className="text-sm mt-4 underline text-gray-600">
          Cancel
        </button>
      </div>
    </div>
  );
}
