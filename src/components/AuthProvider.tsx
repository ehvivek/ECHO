'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useGameStore, Profile } from '@/store/useGameStore';
import { sounds } from '@/lib/sounds';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const setAuth = useGameStore((state) => state.setAuth);
  const [isLoading, setIsLoading] = useState(true);

  // Global click sound
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('a')) {
        sounds.playClick();
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const fetchProfile = async (user: any, session: any) => {
      if (!user) {
        setAuth(null, null, null, false);
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error || !data) {
        // No profile found, user needs onboarding
        setAuth(user, session, null, true);
      } else {
        setAuth(user, session, data as Profile, false);
      }
      setIsLoading(false);
    };

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session?.user ?? null, session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session?.user ?? null, session);
    });

    return () => subscription.unsubscribe();
  }, [setAuth]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-transparent">
        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return <>{children}</>;
}
