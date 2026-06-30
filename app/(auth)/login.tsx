import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signIn, isLoading } = useAuthStore();

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
      return;
    }
    try {
      await signIn(email.trim().toLowerCase(), password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erreur de connexion.';
      Alert.alert('Connexion échouée', message);
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0a0a0a]">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow justify-center px-6 py-12"
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / titre */}
          <View className="items-center mb-12">
            <Text className="text-5xl mb-2">⚡</Text>
            <Text className="text-4xl font-bold text-[#f7931a]">SatVault</Text>
            <Text className="text-[#888888] mt-2 text-base">
              Votre wallet Bitcoin Lightning
            </Text>
          </View>

          {/* Formulaire */}
          <View className="gap-4">
            <View>
              <Text className="text-[#888888] mb-2 text-sm font-medium">
                Email
              </Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-base"
                placeholder="vous@exemple.com"
                placeholderTextColor="#555555"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View>
              <Text className="text-[#888888] mb-2 text-sm font-medium">
                Mot de passe
              </Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-base"
                placeholder="••••••••"
                placeholderTextColor="#555555"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              className="bg-[#f7931a] rounded-xl py-4 items-center mt-2 active:opacity-80"
              onPress={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text className="text-black font-bold text-base">
                  Se connecter
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Lien inscription */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-[#888888]">Pas encore de compte ? </Text>
            <Link href="/(auth)/register">
              <Text className="text-[#f7931a] font-semibold">
                Créer un compte
              </Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
