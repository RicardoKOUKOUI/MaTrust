import axios from 'axios';
import { LNBITS_URL } from '@/constants';
import type { Invoice, Transaction } from '@/types';

const api = axios.create({
  baseURL: LNBITS_URL,
  headers: { 'Content-Type': 'application/json' },
});

/** Build per-request headers using the wallet API key. */
const authHeaders = (apiKey: string) => ({ 'X-Api-Key': apiKey });

// ─── Wallet ───────────────────────────────────────────────────────────────────

export async function getWalletBalance(apiKey: string): Promise<number> {
  const { data } = await api.get('/api/v1/wallet', {
    headers: authHeaders(apiKey),
  });
  // LNbits returns balance in millisats
  return Math.floor(data.balance / 1000);
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export async function createInvoice(
  apiKey: string,
  amount: number,
  memo: string,
): Promise<Invoice> {
  const { data } = await api.post(
    '/api/v1/payments',
    { out: false, amount, memo },
    { headers: authHeaders(apiKey) },
  );
  return {
    payment_hash: data.payment_hash,
    payment_request: data.payment_request,
    checking_id: data.checking_id ?? data.payment_hash,
  };
}

export async function payInvoice(
  apiKey: string,
  bolt11: string,
): Promise<{ payment_hash: string }> {
  const { data } = await api.post(
    '/api/v1/payments',
    { out: true, bolt11 },
    { headers: authHeaders(apiKey) },
  );
  return { payment_hash: data.payment_hash };
}

// ─── Transactions ─────────────────────────────────────────────────────────────

export async function getTransactions(
  apiKey: string,
): Promise<Transaction[]> {
  const { data } = await api.get<LNbitsPayment[]>('/api/v1/payments', {
    headers: authHeaders(apiKey),
  });
  return data.map(mapPayment);
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

interface LNbitsPayment {
  checking_id: string;
  amount: number; // millisats, negative = outgoing
  memo: string;
  bolt11: string;
  status: string;
  time: number;
}

import { TransactionType, TransactionStatus } from '@/types';

function mapPayment(p: LNbitsPayment): Transaction {
  const isOutgoing = p.amount < 0;
  return {
    id: p.checking_id,
    user_id: '',
    type: isOutgoing ? TransactionType.SEND : TransactionType.RECEIVE,
    amount_sats: Math.abs(Math.floor(p.amount / 1000)),
    memo: p.memo,
    bolt11: p.bolt11,
    status:
      p.status === 'complete'
        ? TransactionStatus.COMPLETED
        : p.status === 'pending'
          ? TransactionStatus.PENDING
          : TransactionStatus.FAILED,
    created_at: new Date(p.time * 1000).toISOString(),
  };
}
