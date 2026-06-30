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

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const { signUp, isLoading } = useAuthStore();

  async function handleSignUp() {
    if (!name || !email || !password || !phone) {
      Alert.alert('Champs manquants', 'Veuillez remplir tous les champs.');
      return;
    }
    try {
      await signUp(email.trim().toLowerCase(), password, name.trim(), phone.trim());
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Erreur lors de la création du compte.';
      Alert.alert('Inscription échouée', message);
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
          {/* Titre */}
          <View className="items-center mb-10">
            <Text className="text-5xl mb-2">⚡</Text>
            <Text className="text-3xl font-bold text-white">Créer un compte</Text>
            <Text className="text-[#888888] mt-2 text-sm text-center">
              Un wallet Bitcoin Lightning sera créé automatiquement
            </Text>
          </View>

          {/* Formulaire */}
          <View className="gap-4">
            <View>
              <Text className="text-[#888888] mb-2 text-sm font-medium">
                Nom complet
              </Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-base"
                placeholder="Jean Dupont"
                placeholderTextColor="#555555"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>

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
                Numéro de téléphone
              </Text>
              <TextInput
                className="bg-[#1a1a1a] text-white rounded-xl px-4 py-4 border border-[#2a2a2a] text-base"
                placeholder="+225 07 00 00 00"
                placeholderTextColor="#555555"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
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

            {/* Encart info wallet */}
            <View className="bg-[#1a1a1a] border border-[#f7931a]/30 rounded-xl px-4 py-3 flex-row items-center gap-3">
              <Text className="text-xl">₿</Text>
              <Text className="text-[#888888] text-sm flex-1">
                Un wallet Bitcoin Lightning sera automatiquement créé et associé à votre compte.
              </Text>
            </View>

            <TouchableOpacity
              className="bg-[#f7931a] rounded-xl py-4 items-center mt-2 active:opacity-80"
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#000000" />
              ) : (
                <Text className="text-black font-bold text-base">
                  Créer mon compte
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Lien connexion */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-[#888888]">Déjà un compte ? </Text>
            <Link href="/(auth)/login">
              <Text className="text-[#f7931a] font-semibold">Se connecter</Text>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
