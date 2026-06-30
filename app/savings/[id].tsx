import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { SavingsStatus, type SavingsGoal } from '@/types';

// ─── Stub — remplacer par un fetch Supabase réel ──────────────────────────────
const STUB_GOALS: Record<string, SavingsGoal> = {
  '1': {
    id: '1',
    user_id: 'stub',
    name: 'Voyage',
    emoji: '✈️',
    target_amount_sats: 500_000,
    current_amount_sats: 175_000,
    locked_until: new Date(Date.now() + 90 * 86_400_000).toISOString(),
    status: SavingsStatus.ACTIVE,
  },
  '2': {
    id: '2',
    user_id: 'stub',
    name: 'Téléphone',
    emoji: '📱',
    target_amount_sats: 200_000,
    current_amount_sats: 80_000,
    locked_until: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    status: SavingsStatus.ACTIVE,
  },
};

function progressPercent(current: number, target: number) {
  return Math.min(100, Math.round((current / target) * 100));
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function SavingsGoalDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const goal = STUB_GOALS[id ?? ''];

  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  if (!goal) {
    return (
      <SafeAreaView className="flex-1 bg-[#0a0a0a] items-center justify-center px-6">
        <Text className="text-white text-xl font-bold mb-2">Objectif introuvable</Text>
        <Text className="text-[#888888] text-sm mb-6">
          Cet objectif n'existe pas ou a été supprimé.
        </Text>
        <TouchableOpacity
          className="bg-[#f7931a] rounded-xl px-6 py-3"
          onPress={() => router.back()}
        >
          <Text className="text-black font-bold">Retour</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const pct = progressPercent(goal.current_amount_sats, goal.target_amount_sats);
  const days = daysUntil(goal.locked_until);
  const isUnlocked = days === 0 || goal.status === SavingsStatus.UNLOCKED;
  const isCompleted = goal.status === SavingsStatus.COMPLETED;

  async function handleDeposit() {
    const sats = parseInt(depositAmount, 10);
    if (!depositAmount || isNaN(sats) || sats <= 0) {
      Alert.alert('Montant invalide', 'Entrez un montant en sats.');
      return;
    }
    setIsDepositing(true);
    // TODO: créer une invoice LNbits et marquer le dépôt dans Supabase
    await new Promise((r) => setTimeout(r, 700));
    Alert.alert('Dépôt initié ⚡', `Générez une invoice de ${sats} sats.`);
    setDepositAmount('');
    setIsDepositing(false);
  }

  function handleWithdraw() {
    if (!isUnlocked) {
      Alert.alert(
        'Épargne verrouillée 🔒',
        `Cet objectif sera débloqué dans ${days} jour${days !== 1 ? 's' : ''}, le ${formatDate(goal.locked_until)}.`,
      );
      return;
    }
    Alert.alert(
      'Retirer les sats',
      `Voulez-vous retirer ${goal.current_amount_sats.toLocaleString()} sats ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Retirer',
          style: 'destructive',
          onPress: () => {
            // TODO: appel Supabase + LNbits
            Alert.alert('Retrait initié', 'Vos sats arrivent sur votre wallet.');
          },
        },
      ],
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      {/* En-tête */}
      <View className="flex-row items-center px-6 pt-4 pb-2 gap-3">
        <TouchableOpacity
          className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] items-center justify-center"
          onPress={() => router.back()}
        >
          <Text className="text-white text-lg">←</Text>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold">Détail de l'objectif</Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4">
        {/* Carte principale */}
        <View className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 mb-5">
          {/* Emoji + nom */}
          <View className="items-center mb-5">
            <Text className="text-6xl mb-3">{goal.emoji}</Text>
            <Text className="text-white text-2xl font-bold">{goal.name}</Text>
            {isCompleted && (
              <View className="bg-[#22c55e]/20 border border-[#22c55e]/30 rounded-full px-3 py-1 mt-2">
                <Text className="text-[#22c55e] text-xs font-semibold">✅ Complété</Text>
              </View>
            )}
            {isUnlocked && !isCompleted && (
              <View className="bg-[#f7931a]/20 border border-[#f7931a]/30 rounded-full px-3 py-1 mt-2">
                <Text className="text-[#f7931a] text-xs font-semibold">🔓 Débloqué</Text>
              </View>
            )}
          </View>

          {/* Progression */}
          <View className="mb-4">
            <View className="flex-row justify-between mb-2">
              <Text className="text-[#888888] text-sm">Progression</Text>
              <Text className="text-[#f7931a] font-bold">{pct}%</Text>
            </View>
            <View className="bg-[#2a2a2a] rounded-full h-3 overflow-hidden">
              <View
                className="bg-[#f7931a] h-3 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </View>
          </View>

          {/* Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-[#0a0a0a] rounded-xl p-3 items-center">
              <Text className="text-[#888888] text-xs mb-1">Économisé</Text>
              <Text className="text-white font-bold text-sm">
                {goal.current_amount_sats.toLocaleString()} sats
              </Text>
            </View>
            <View className="flex-1 bg-[#0a0a0a] rounded-xl p-3 items-center">
              <Text className="text-[#888888] text-xs mb-1">Objectif</Text>
              <Text className="text-white font-bold text-sm">
                {goal.target_amount_sats.toLocaleString()} sats
              </Text>
            </View>
            <View className="flex-1 bg-[#0a0a0a] rounded-xl p-3 items-center">
              <Text className="text-[#888888] text-xs mb-1">Reste</Text>
              <Text className="text-white font-bold text-sm">
                {Math.max(0, goal.target_amount_sats - goal.current_amount_sats).toLocaleString()} sats
              </Text>
            </View>
          </View>
        </View>

        {/* Date de déblocage */}
        <View className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 mb-5 flex-row items-center gap-3">
          <Text className="text-2xl">{isUnlocked ? '🔓' : '🔒'}</Text>
          <View>
            <Text className="text-[#888888] text-xs">Date de déblocage</Text>
            <Text className="text-white font-medium">{formatDate(goal.locked_until)}</Text>
            {!isUnlocked && (
              <Text className="text-[#555555] text-xs">
                Dans {days} jour{days !== 1 ? 's' : ''}
              </Text>
            )}
          </View>
        </View>

        {/* Déposer des sats */}
        <View className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 mb-5">
          <Text className="text-white font-bold mb-3">⚡ Déposer des sats</Text>
          <View className="flex-row gap-3">
            <TextInput
              className="flex-1 bg-[#0a0a0a] text-white rounded-xl px-4 py-3 border border-[#2a2a2a] text-base"
              placeholder="Montant en sats"
              placeholderTextColor="#555555"
              value={depositAmount}
              onChangeText={setDepositAmount}
              keyboardType="numeric"
            />
            <TouchableOpacity
              className="bg-[#f7931a] rounded-xl px-5 items-center justify-center active:opacity-80"
              onPress={handleDeposit}
              disabled={isDepositing}
            >
              {isDepositing ? (
                <ActivityIndicator color="#000" size="small" />
              ) : (
                <Text className="text-black font-bold">OK</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Retirer */}
        <TouchableOpacity
          className={`rounded-2xl py-4 items-center mb-10 border ${
            isUnlocked
              ? 'bg-[#ef4444]/10 border-[#ef4444]/30'
              : 'bg-[#1a1a1a] border-[#2a2a2a]'
          }`}
          onPress={handleWithdraw}
        >
          <Text
            className={`font-bold ${isUnlocked ? 'text-[#ef4444]' : 'text-[#555555]'}`}
          >
            {isUnlocked ? '🏦 Retirer les sats' : `🔒 Verrouillé — encore ${days}j`}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
