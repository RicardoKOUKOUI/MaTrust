import { create } from 'zustand';
import { getWalletBalance, getTransactions } from '@/lib/lnbits';
import { useAuthStore } from '@/store/authStore';
import type { Transaction } from '@/types';
import { SATS_TO_XOF_RATE } from '@/constants';

interface WalletState {
  balanceSats: number;
  balanceXof: number;
  transactions: Transaction[];
  isLoading: boolean;
  fetchBalance: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
}

export const useWalletStore = create<WalletState>((set) => ({
  balanceSats: 0,
  balanceXof: 0,
  transactions: [],
  isLoading: false,

  fetchBalance: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.lnbits_wallet_id) return;

    set({ isLoading: true });
    try {
      const sats = await getWalletBalance(user.lnbits_wallet_id);
      set({
        balanceSats: sats,
        balanceXof: Math.round(sats * SATS_TO_XOF_RATE),
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTransactions: async () => {
    const { user } = useAuthStore.getState();
    if (!user?.lnbits_wallet_id) return;

    set({ isLoading: true });
    try {
      const txs = await getTransactions(user.lnbits_wallet_id);
      set({ transactions: txs });
    } finally {
      set({ isLoading: false });
    }
  },
}));
