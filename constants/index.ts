export const COLORS = {
  background: '#0a0a0a',
  surface: '#111111',
  card: '#1a1a1a',
  primary: '#f7931a', // Bitcoin orange
  text: '#ffffff',
  textSecondary: '#888888',
  success: '#22c55e',
  error: '#ef4444',
  border: '#2a2a2a',
};

export const LNBITS_URL =
  process.env.EXPO_PUBLIC_LNBITS_URL || 'https://legend.lnbits.com';
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const APP_NAME = 'SatVault';

/** Rough XOF/BTC rate used for display only (replace with live feed). */
export const SATS_TO_XOF_RATE = 0.33; // 1 sat ≈ 0.33 XOF (example)
