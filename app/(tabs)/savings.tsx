import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SavingsStatus, type SavingsGoal } from '@/types';

// ─── Stub data ─────────────────────────────────────────────────────────────────
const STUB_GOALS: SavingsGoal[] = [
  {
    id: '1',
    user_id: 'stub',
    name: 'Voyage',
    emoji: '✈️',
    target_amount_sats: 500_000,
    current_amount_sats: 175_000,
    locked_until: new Date(Date.now() + 90 * 86_400_000).toISOString(),
    status: SavingsStatus.ACTIVE,
  },
  {
    id: '2',
    user_id: 'stub',
    name: 'Téléphone',
    emoji: '📱',
    target_amount_sats: 200_000,
    current_amount_sats: 80_000,
    locked_until: new Date(Date.now() + 30 * 86_400_000).toISOString(),
    status: SavingsStatus.ACTIVE,
  },
];

function progressPercent(current: number, target: number) {
  return Math.min(100, Math.round((current / target) * 100));
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

interface GoalCardProps {
  goal: SavingsGoal;
}

function GoalCard({ goal }: GoalCardProps) {
  const pct = progressPercent(goal.current_amount_sats, goal.target_amount_sats);
  const days = daysUntil(goal.locked_until);

  return (
    <TouchableOpacity
      className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 mb-4"
      onPress={() => router.push(`/savings/${goal.id}`)}
      activeOpacity={0.75}
    >
      {/* Titre */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text className="text-3xl">{goal.emoji}</Text>
          <View>
            <Text className="text-white font-bold text-lg">{goal.name}</Text>
            <Text className="text-[#888888] text-xs">
              Déblocage dans {days} jour{days !== 1 ? 's' : ''}
            </Text>
          </View>
        </View>
        <Text className="text-[#f7931a] font-bold text-lg">{pct}%</Text>
      </View>

      {/* Barre de progression */}
      <View className="bg-[#2a2a2a] rounded-full h-2 mb-3 overflow-hidden">
        <View
          className="bg-[#f7931a] h-2 rounded-full"
          style={{ width: `${pct}%` }}
        />
      </View>

      {/* Montants */}
      <View className="flex-row justify-between">
        <Text className="text-[#888888] text-sm">
          {goal.current_amount_sats.toLocaleString('fr-FR')} sats
        </Text>
        <Text className="text-[#555555] text-sm">
          / {goal.target_amount_sats.toLocaleString('fr-FR')} sats
        </Text>
      </View>
    </TouchableOpacity>
  );
}

export default function SavingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      {/* En-tête */}
      <View className="flex-row items-center justify-between px-6 pt-6 pb-4">
        <View>
          <Text className="text-white text-2xl font-bold">Épargne 🎯</Text>
          <Text className="text-[#888888] text-sm mt-1">
            {STUB_GOALS.length} objectif{STUB_GOALS.length !== 1 ? 's' : ''} actif{STUB_GOALS.length !== 1 ? 's' : ''}
          </Text>
        </View>
        <TouchableOpacity
          className="bg-[#f7931a] w-11 h-11 rounded-full items-center justify-center"
          onPress={() => router.push('/savings/new')}
        >
          <Text className="text-black text-2xl font-bold leading-none">+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-6">
        {STUB_GOALS.map((goal) => (
          <GoalCard key={goal.id} goal={goal} />
        ))}

        {/* CTA création */}
        <TouchableOpacity
          className="border border-dashed border-[#2a2a2a] rounded-2xl py-6 items-center gap-2 mb-8"
          onPress={() => router.push('/savings/new')}
        >
          <Text className="text-3xl">➕</Text>
          <Text className="text-[#888888] text-sm">Créer un nouvel objectif</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
