import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Court } from '@/types/court';

export function useCourts() {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourts();
  }, []);

  const fetchCourts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courts')
        .select('*')
        .order('name');

      if (error) {
        throw error;
      }

      setCourts(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch courts');
      console.error('Error fetching courts:', err);
    } finally {
      setLoading(false);
    }
  };

  const addCourt = async (court: Omit<Court, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('courts')
        .insert([court])
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCourts(prev => [...prev, data]);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add court');
      throw err;
    }
  };

  const updateCourt = async (id: string, updates: Partial<Court>) => {
    try {
      const { data, error } = await supabase
        .from('courts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      setCourts(prev => prev.map(court => court.id === id ? data : court));
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update court');
      throw err;
    }
  };

  const deleteCourt = async (id: string) => {
    try {
      const { error } = await supabase
        .from('courts')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setCourts(prev => prev.filter(court => court.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete court');
      throw err;
    }
  };

  return {
    courts,
    loading,
    error,
    refreshCourts: fetchCourts,
    addCourt,
    updateCourt,
    deleteCourt
  };
} 