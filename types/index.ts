// ─── Enums ────────────────────────────────────────────────────────────────────

export enum TransactionType {
  SEND = 'SEND',
  RECEIVE = 'RECEIVE',
  DEPOSIT_SAVING = 'DEPOSIT_SAVING',
  CASHU_OUT = 'CASHU_OUT',
  CASHU_IN = 'CASHU_IN',
}

export enum TransactionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum SavingsStatus {
  ACTIVE = 'ACTIVE',
  UNLOCKED = 'UNLOCKED',
  COMPLETED = 'COMPLETED',
}

// ─── Core models ──────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  lnbits_wallet_id: string;
  lnurl_address: string;
}

export interface Session {
  access_token: string;
  user: User;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: TransactionType;
  amount_sats: number;
  memo?: string;
  bolt11?: string;
  status: TransactionStatus;
  created_at: string;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  target_amount_sats: number;
  current_amount_sats: number;
  locked_until: string; // ISO date string
  status: SavingsStatus;
}

export interface Invoice {
  payment_hash: string;
  payment_request: string;
  checking_id: string;
  lnurl_response?: string;
}
