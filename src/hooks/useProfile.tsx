import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<{ full_name?: string; avatar_url?: string } | null>(null);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', userId)
      .single()
      .then(({ data }) => setProfile(data));
  }, [userId]);

  return profile;
}