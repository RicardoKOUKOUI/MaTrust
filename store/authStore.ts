import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    name: string,
    phone: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  setSession: (session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  isLoading: false,

  setSession: (session) =>
    set({ session, user: session?.user ?? null }),

  signIn: async (email, password) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      // Map Supabase user → our User shape
      const appUser: User = {
        id: data.user.id,
        email: data.user.email ?? '',
        name: (data.user.user_metadata?.name as string) ?? '',
        phone: (data.user.user_metadata?.phone as string) ?? '',
        lnbits_wallet_id:
          (data.user.user_metadata?.lnbits_wallet_id as string) ?? '',
        lnurl_address:
          (data.user.user_metadata?.lnurl_address as string) ?? '',
      };
      const appSession: Session = {
        access_token: data.session?.access_token ?? '',
        user: appUser,
      };
      set({ user: appUser, session: appSession });
    } finally {
      set({ isLoading: false });
    }
  },

  signUp: async (email, password, name, phone) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, phone } },
      });
      if (error) throw error;

      // After sign-up the session may be null until email is confirmed;
      // only populate store if a session was returned immediately.
      if (data.session && data.user) {
        const appUser: User = {
          id: data.user.id,
          email: data.user.email ?? '',
          name,
          phone,
          lnbits_wallet_id: '',
          lnurl_address: '',
        };
        set({
          user: appUser,
          session: {
            access_token: data.session.access_token,
            user: appUser,
          },
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    set({ isLoading: true });
    try {
      await supabase.auth.signOut();
      set({ user: null, session: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
