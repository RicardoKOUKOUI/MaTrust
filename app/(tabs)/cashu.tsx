import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';

export default function CashuScreen() {
  // ── Génération ────────────────────────────────────────────────────────────
  const [genAmount, setGenAmount] = useState('');
  const [voucherToken, setVoucherToken] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // ── Rachat ────────────────────────────────────────────────────────────────
  const [redeemToken, setRedeemToken] = useState('');
  const [isRedeeming, setIsRedeeming] = useState(false);

  async function handleGenerate() {
    const sats = parseInt(genAmount, 10);
    if (!genAmount || isNaN(sats) || sats <= 0) {
      Alert.alert('Montant invalide', 'Entrez un montant en sats.');
      return;
    }
    setIsGenerating(true);
    // TODO: appel réel au SDK Cashu (@cashu/cashu-ts)
    await new Promise((r) => setTimeout(r, 800));
    setVoucherToken(`cashuA${btoa(`satvault:${sats}sats:${Date.now()}`).slice(0, 64)}`);
    setIsGenerating(false);
  }

  async function handleRedeem() {
    if (!redeemToken.trim()) {
      Alert.alert('Token manquant', 'Collez un token Cashu.');
      return;
    }
    setIsRedeeming(true);
    // TODO: appel réel au SDK Cashu
    await new Promise((r) => setTimeout(r, 800));
    Alert.alert('Succès 📦', 'Voucher racheté ! Sats crédités sur votre wallet.');
    setRedeemToken('');
    setIsRedeeming(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <ScrollView className="flex-1">
        {/* En-tête */}
        <View className="px-6 pt-6 pb-2">
          <Text className="text-white text-2xl font-bold">Cashu 📦</Text>
          <Text className="text-[#888888] text-sm mt-1">
            Vouchers Bitcoin hors-ligne
          </Text>
        </View>

        {/* Explication */}
        <View className="mx-6 mt-4 bg-[#1a1a1a] border border-[#f7931a]/20 rounded-2xl p-4">
          <Text className="text-[#f7931a] font-semibold mb-2">
            ℹ️ Qu'est-ce qu'un voucher Cashu ?
          </Text>
          <Text className="text-[#888888] text-sm leading-6">
            Un voucher Cashu est un jeton numérique représentant des sats Bitcoin.
            Il fonctionne{'\u00a0'}hors-ligne — vous pouvez l'envoyer par SMS, WhatsApp ou
            QR code, sans connexion internet. Le destinataire le rachète quand il
            est en ligne pour recevoir les sats sur son wallet.
          </Text>
        </View>

        {/* ── Section Générer ────────────────────────────────────────────── */}
        <View className="mx-6 mt-6">
          <Text className="text-white text-lg font-bold mb-4">
            Générer un voucher
          </Text>
          <View className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 gap-4">
            <View>
              <Text className="text-[#888888] text-sm mb-2">Montant (sats)</Text>
              <TextInput
                className="bg-[#0a0a0a] text-white rounded-xl px-4 py-3 border border-[#2a2a2a] text-base"
                placeholder="500"
                placeholderTextColor="#555555"
                value={genAmount}
                onChangeText={setGenAmount}
                keyboardType="numeric"
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
                <Text className="text-black font-bold">Créer le voucher</Text>
              )}
            </TouchableOpacity>

            {/* Token généré + QR */}
            {voucherToken ? (
              <View className="items-center gap-3 pt-2">
                <View className="bg-white p-3 rounded-xl">
                  <QRCode value={voucherToken} size={180} />
                </View>
                <View className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-xl px-4 py-3 w-full">
                  <Text
                    className="text-[#888888] text-xs font-mono text-center"
                    numberOfLines={2}
                    selectable
                  >
                    {voucherToken}
                  </Text>
                </View>
                <Text className="text-[#22c55e] text-xs text-center">
                  Partagez ce QR code ou copiez le token
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ── Section Racheter ───────────────────────────────────────────── */}
        <View className="mx-6 mt-6 mb-10">
          <Text className="text-white text-lg font-bold mb-4">
            Racheter un voucher
          </Text>
          <View className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-5 gap-4">
            <View>
              <Text className="text-[#888888] text-sm mb-2">Token Cashu</Text>
              <TextInput
                className="bg-[#0a0a0a] text-white rounded-xl px-4 py-3 border border-[#2a2a2a] text-xs font-mono"
                placeholder="cashuA..."
                placeholderTextColor="#555555"
                value={redeemToken}
                onChangeText={setRedeemToken}
                multiline
                numberOfLines={3}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <TouchableOpacity
              className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl py-3 items-center flex-row justify-center gap-2"
              onPress={() => Alert.alert('Scanner', 'Intégration caméra à venir.')}
            >
              <Text className="text-lg">📷</Text>
              <Text className="text-white font-medium text-sm">Scanner un QR code</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="bg-[#22c55e] rounded-xl py-4 items-center active:opacity-80"
              onPress={handleRedeem}
              disabled={isRedeeming}
            >
              {isRedeeming ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text className="text-black font-bold">Racheter les sats</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
