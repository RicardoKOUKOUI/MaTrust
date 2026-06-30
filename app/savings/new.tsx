import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const EMOJI_OPTIONS = ['✈️', '📱', '🏠', '🚗', '🎓', '💍', '🌴', '🎮', '💻', '🎸'];

export default function NewSavingsGoalScreen() {
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('✈️');
  const [targetSats, setTargetSats] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  async function handleCreate() {
    if (!name.trim()) {
      Alert.alert('Nom manquant', 'Donnez un nom à votre objectif.');
      return;
    }
    const sats = parseInt(targetSats, 10);
    if (!targetSats || isNaN(sats) || sats <= 0) {
      Alert.alert('Montant invalide', 'Entrez un montant cible en sats.');
      return;
    }
    if (!unlockDate.trim()) {
      Alert.alert('Date manquante', 'Choisissez une date de déblocage (AAAA-MM-JJ).');
      return;
    }
    const date = new Date(unlockDate);
    if (isNaN(date.getTime()) || date <= new Date()) {
      Alert.alert('Date invalide', 'La date de déblocage doit être dans le futur.');
      return;
    }

    setIsCreating(true);
    // TODO: persister dans Supabase
    await new Promise((r) => setTimeout(r, 600));
    setIsCreating(false);

    Alert.alert(
      'Objectif créé ! 🎯',
      `${emoji} ${name.trim()} — ${sats.toLocaleString()} sats`,
      [{ text: 'OK', onPress: () => router.back() }],
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        {/* En-tête */}
        <View className="flex-row items-center px-6 pt-4 pb-2 gap-3">
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#2a2a2a] items-center justify-center"
            onPress={() => router.back()}
          >
            <Text className="text-white text-lg">←</Text>
          </TouchableOpacity>
          <Text className="text-white text-xl font-bold">Nouvel objectif</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-4" keyboardShouldPersistTaps="handled">
          {/* Emoji picker */}
          <View className="mb-5">
            <Text className="text-[#888888] text-sm mb-3 font-medium">Emoji</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-2">
                {EMOJI_OPTIONS.map((e) => (
                  <TouchableOpacity
                    key={e}
                    className={`w-12 h-12 rounded-xl items-center justify-center border ${
                      emoji === e
                        ? 'border-[#f7931a] bg-[#f7931a]/10'
                        : 'border-[#2a2a2a] bg-[#1a1a1a]'
                    }`}
                    onPress={() => setEmoji(e)}
                  >
                    <Text className="text-2xl">{e}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Preview */}
          <View className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 items-center mb-6">
            <Text className="text-5xl mb-2">{emoji}</Text>
            <Text className="text-white text-xl font-bold">
              {name || 'Mon objectif'}
            </Text>
          </View>

          {/* Champs */}
          <View className="gap-4 mb-8">
            <View>
              <Text className="text-[#888888] text-sm mb-2 font-medium">
                Nom de l'objectif
              </Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-base"
                placeholder="Ex: Voyage à Paris"
                placeholderTextColor="#555555"
                value={name}
                onChangeText={setName}
                autoCapitalize="sentences"
              />
            </View>

            <View>
              <Text className="text-[#888888] text-sm mb-2 font-medium">
                Montant cible (sats)
              </Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-base"
                placeholder="500000"
                placeholderTextColor="#555555"
                value={targetSats}
                onChangeText={setTargetSats}
                keyboardType="numeric"
              />
              {targetSats && !isNaN(parseInt(targetSats, 10)) && (
                <Text className="text-[#555555] text-xs mt-1 ml-1">
                  ≈ {Math.round(parseInt(targetSats, 10) * 0.33).toLocaleString('fr-FR')} XOF
                </Text>
              )}
            </View>

            <View>
              <Text className="text-[#888888] text-sm mb-2 font-medium">
                Date de déblocage
              </Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-base"
                placeholder="AAAA-MM-JJ"
                placeholderTextColor="#555555"
                value={unlockDate}
                onChangeText={setUnlockDate}
                keyboardType="numbers-and-punctuation"
              />
              <Text className="text-[#555555] text-xs mt-1 ml-1">
                Les sats seront verrouillés jusqu'à cette date
              </Text>
            </View>

            <TouchableOpacity
              className="bg-[#f7931a] rounded-xl py-4 items-center mt-2 active:opacity-80"
              onPress={handleCreate}
              disabled={isCreating}
            >
              {isCreating ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-bold text-base">
                  Créer l'objectif 🎯
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
