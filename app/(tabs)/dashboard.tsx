import { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useWalletStore } from '@/store/walletStore';
import { useAuthStore } from '@/store/authStore';
import { TransactionStatus, TransactionType } from '@/types';

// ─── Stub transactions shown before real data loads ───────────────────────────
const STUB_TRANSACTIONS = [
  {
    id: '1',
    type: TransactionType.RECEIVE,
    amount_sats: 5_000,
    memo: 'Paiement reçu',
    status: TransactionStatus.COMPLETED,
    created_at: new Date(Date.now() - 3_600_000).toISOString(),
  },
  {
    id: '2',
    type: TransactionType.SEND,
    amount_sats: 1_200,
    memo: 'Café ☕',
    status: TransactionStatus.COMPLETED,
    created_at: new Date(Date.now() - 86_400_000).toISOString(),
  },
  {
    id: '3',
    type: TransactionType.DEPOSIT_SAVING,
    amount_sats: 10_000,
    memo: 'Objectif Voyage ✈️',
    status: TransactionStatus.COMPLETED,
    created_at: new Date(Date.now() - 172_800_000).toISOString(),
  },
];

function formatSats(sats: number) {
  return sats.toLocaleString('fr-FR') + ' sats';
}

function formatXof(xof: number) {
  return xof.toLocaleString('fr-FR') + ' XOF';
}

function txIcon(type: TransactionType) {
  switch (type) {
    case TransactionType.RECEIVE:
    case TransactionType.CASHU_IN:
      return '⬇️';
    case TransactionType.SEND:
    case TransactionType.CASHU_OUT:
      return '⬆️';
    case TransactionType.DEPOSIT_SAVING:
      return '🎯';
  }
}

function relativeDate(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diff / 3_600_000);
  if (hours < 1) return 'À l\'instant';
  if (hours < 24) return `Il y a ${hours}h`;
  const days = Math.floor(hours / 24);
  return `Il y a ${days}j`;
}

export default function DashboardScreen() {
  const { balanceSats, balanceXof, transactions, isLoading, fetchBalance, fetchTransactions } =
    useWalletStore();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const displayedTxs = transactions.length > 0 ? transactions.slice(0, 5) : STUB_TRANSACTIONS;

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <ScrollView
        className="flex-1"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={() => { fetchBalance(); fetchTransactions(); }}
            tintColor="#f7931a"
          />
        }
      >
        {/* En-tête */}
        <View className="px-6 pt-6 pb-2 flex-row justify-between items-center">
          <View>
            <Text className="text-[#888888] text-sm">Bonjour 👋</Text>
            <Text className="text-white text-lg font-semibold">
              {user?.name || 'Utilisateur'}
            </Text>
          </View>
          <TouchableOpacity
            className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-4 py-2"
            onPress={() => useAuthStore.getState().signOut()}
          >
            <Text className="text-[#888888] text-sm">Déconnexion</Text>
          </TouchableOpacity>
        </View>

        {/* Carte solde */}
        <View className="mx-6 mt-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6">
          <Text className="text-[#888888] text-sm mb-1">Solde total</Text>
          <Text className="text-white text-4xl font-bold mb-1">
            {formatSats(balanceSats)}
          </Text>
          <Text className="text-[#f7931a] text-lg font-medium">
            ≈ {formatXof(balanceXof)}
          </Text>

          {/* Actions rapides */}
          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              className="flex-1 bg-[#f7931a] rounded-xl py-3 items-center"
              onPress={() => router.push('/(tabs)/transfer')}
            >
              <Text className="text-black font-bold">⬆ Envoyer</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#2a2a2a] rounded-xl py-3 items-center"
              onPress={() => router.push('/(tabs)/transfer')}
            >
              <Text className="text-white font-bold">⬇ Recevoir</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Raccourcis */}
        <View className="flex-row mx-6 mt-4 gap-3">
          <TouchableOpacity
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl py-4 items-center"
            onPress={() => router.push('/(tabs)/savings')}
          >
            <Text className="text-2xl">🎯</Text>
            <Text className="text-white text-xs mt-1 font-medium">Épargne</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl py-4 items-center"
            onPress={() => router.push('/(tabs)/cashu')}
          >
            <Text className="text-2xl">📦</Text>
            <Text className="text-white text-xs mt-1 font-medium">Cashu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl py-4 items-center"
            onPress={() => router.push('/(tabs)/transfer')}
          >
            <Text className="text-2xl">⚡</Text>
            <Text className="text-white text-xs mt-1 font-medium">LN</Text>
          </TouchableOpacity>
        </View>

        {/* Historique */}
        <View className="mx-6 mt-6 mb-8">
          <Text className="text-white text-lg font-bold mb-4">
            Dernières transactions
          </Text>
          <View className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl overflow-hidden">
            {displayedTxs.map((tx, idx) => (
              <View
                key={tx.id}
                className={`flex-row items-center px-4 py-4 ${
                  idx < displayedTxs.length - 1 ? 'border-b border-[#2a2a2a]' : ''
                }`}
              >
                <View className="w-10 h-10 rounded-full bg-[#2a2a2a] items-center justify-center mr-3">
                  <Text className="text-lg">{txIcon(tx.type)}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium" numberOfLines={1}>
                    {tx.memo || 'Transaction'}
                  </Text>
                  <Text className="text-[#555555] text-xs mt-0.5">
                    {relativeDate(tx.created_at)}
                  </Text>
                </View>
                <Text
                  className={`font-bold text-sm ${
                    tx.type === TransactionType.RECEIVE ||
                    tx.type === TransactionType.CASHU_IN
                      ? 'text-[#22c55e]'
                      : 'text-[#ef4444]'
                  }`}
                >
                  {tx.type === TransactionType.RECEIVE ||
                  tx.type === TransactionType.CASHU_IN
                    ? '+'
                    : '-'}
                  {tx.amount_sats.toLocaleString()} sats
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
