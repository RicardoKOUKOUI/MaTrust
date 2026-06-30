import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import type { User, Session } from '@/types';

/**
 * Subscribes to Supabase auth state changes and keeps the Zustand store in sync.
 * Mount this once at the root layout level.
 */
export function useAuth() {
  const { setSession, signOut } = useAuthStore();

  useEffect(() => {
    // Hydrate store from the persisted session on first mount
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setSession(buildSession(data.session));
      }
    });

    // Listen for future sign-in / sign-out events
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, supabaseSession) => {
        setSession(supabaseSession ? buildSession(supabaseSession) : null);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [setSession]);

  return useAuthStore();
}

// ─── Internal helper ──────────────────────────────────────────────────────────

function buildSession(raw: {
  access_token: string;
  user: {
    id: string;
    email?: string;
    user_metadata?: Record<string, unknown>;
  };
}): Session {
  const appUser: User = {
    id: raw.user.id,
    email: raw.user.email ?? '',
    name: (raw.user.user_metadata?.name as string) ?? '',
    phone: (raw.user.user_metadata?.phone as string) ?? '',
    lnbits_wallet_id:
      (raw.user.user_metadata?.lnbits_wallet_id as string) ?? '',
    lnurl_address: (raw.user.user_metadata?.lnurl_address as string) ?? '',
  };
  return { access_token: raw.access_token, user: appUser };
}
