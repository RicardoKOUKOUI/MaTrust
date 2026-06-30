import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { useAuthStore } from '@/store/authStore';
import { createInvoice, payInvoice } from '@/lib/lnbits';

type Tab = 'send' | 'receive';

export default function TransferScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('send');

  // ── Send state ────────────────────────────────────────────────────────────
  const [bolt11, setBolt11] = useState('');
  const [isSending, setIsSending] = useState(false);

  // ── Receive state ─────────────────────────────────────────────────────────
  const [amountSats, setAmountSats] = useState('');
  const [memo, setMemo] = useState('');
  const [invoice, setInvoice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const user = useAuthStore((s) => s.user);

  async function handleSend() {
    if (!bolt11.trim()) {
      Alert.alert('Champ manquant', 'Collez une invoice bolt11.');
      return;
    }
    if (!user?.lnbits_wallet_id) {
      Alert.alert('Erreur', 'Wallet non configuré.');
      return;
    }
    setIsSending(true);
    try {
      await payInvoice(user.lnbits_wallet_id, bolt11.trim());
      Alert.alert('Succès ⚡', 'Paiement envoyé !');
      setBolt11('');
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Paiement échoué.');
    } finally {
      setIsSending(false);
    }
  }

  async function handleGenerate() {
    const sats = parseInt(amountSats, 10);
    if (!amountSats || isNaN(sats) || sats <= 0) {
      Alert.alert('Montant invalide', 'Entrez un montant en sats.');
      return;
    }
    if (!user?.lnbits_wallet_id) {
      Alert.alert('Erreur', 'Wallet non configuré.');
      return;
    }
    setIsGenerating(true);
    try {
      const result = await createInvoice(
        user.lnbits_wallet_id,
        sats,
        memo || `SatVault — ${sats} sats`,
      );
      setInvoice(result.payment_request);
    } catch (err: unknown) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Génération échouée.');
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      {/* Tabs internes */}
      <View className="flex-row mx-6 mt-6 bg-[#1a1a1a] rounded-xl p-1">
        {(['send', 'receive'] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            className={`flex-1 py-3 rounded-lg items-center ${
              activeTab === tab ? 'bg-[#f7931a]' : ''
            }`}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              className={`font-semibold text-sm ${
                activeTab === tab ? 'text-black' : 'text-[#888888]'
              }`}
            >
              {tab === 'send' ? '⬆ Envoyer' : '⬇ Recevoir'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView className="flex-1 px-6 pt-6">
        {activeTab === 'send' ? (
          /* ── Envoyer ─────────────────────────────────────────────────────── */
          <View className="gap-4">
            <Text className="text-white text-xl font-bold">Payer une invoice</Text>

            <View>
              <Text className="text-[#888888] text-sm mb-2">Invoice bolt11</Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-xs font-mono"
                placeholder="lnbc..."
                placeholderTextColor="#555555"
                value={bolt11}
                onChangeText={setBolt11}
                multiline
                numberOfLines={4}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl py-4 items-center flex-row justify-center gap-2"
              onPress={() => Alert.alert('QR Scanner', 'Intégration caméra à venir.')}
            >
              <Text className="text-xl">📷</Text>
              <Text className="text-white font-medium">Scanner un QR code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#f7931a] rounded-xl py-4 items-center mt-2 active:opacity-80"
              onPress={handleSend}
              disabled={isSending}
            >
              {isSending ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-bold text-base">Envoyer ⚡</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          /* ── Recevoir ────────────────────────────────────────────────────── */
          <View className="gap-4">
            <Text className="text-white text-xl font-bold">Créer une invoice</Text>

            <View>
              <Text className="text-[#888888] text-sm mb-2">Montant (sats)</Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-base"
                placeholder="1000"
                placeholderTextColor="#555555"
                value={amountSats}
                onChangeText={setAmountSats}
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text className="text-[#888888] text-sm mb-2">Mémo (optionnel)</Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-base"
                placeholder="Pour..."
                placeholderTextColor="#555555"
                value={memo}
                onChangeText={setMemo}
              />
            </View>

            <TouchableOpacity
              className="bg-[#f7931a] rounded-xl py-4 items-center active:opacity-80"
              onPress={handleGenerate}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-bold text-base">
                  Générer l'invoice
                </Text>
              )}
            </TouchableOpacity>

            {/* QR Code de l'invoice */}
            {invoice ? (
              <View className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-6 items-center gap-4 mt-2">
                <View className="bg-white p-3 rounded-xl">
                  <QRCode value={invoice} size={200} />
                </View>
                <Text className="text-[#888888] text-xs text-center font-mono" numberOfLines={3}>
                  {invoice.slice(0, 60)}…
                </Text>
                <Text className="text-[#22c55e] text-sm font-medium">
                  En attente de paiement…
                </Text>
              </View>
            ) : null}
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
