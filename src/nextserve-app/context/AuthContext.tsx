'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

// 1. Define the shape of the user profile
type Profile = {
  full_name?: string;
  personality?: string;
  // Add more fields as needed
};

// 2. Define the shape of the context
interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
}

// 3. Create the context (this is your question 👇)
const AuthContext = createContext<AuthContextType | null>(null);

// 4. Create the provider wrapper
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user ?? null;
      setUser(user);

      if (user) {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileData) {
          setProfile(profileData);
        } else {
          // Create blank profile if none exists
          await supabase.from('profiles').insert({ id: user.id });
          setProfile({ full_name: '' });
        }
      }

      setLoading(false);
    };

    init();

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// 5. Export a type-safe hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
