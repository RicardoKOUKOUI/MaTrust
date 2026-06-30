# ₿ SatVault

![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?style=flat-square&logo=react)
![Expo](https://img.shields.io/badge/Expo-SDK_52-000020?style=flat-square&logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript)
![Lightning Network](https://img.shields.io/badge/Lightning_Network-enabled-F7931A?style=flat-square)
![Supabase](https://img.shields.io/badge/Supabase-Edge_Functions-3ECF8E?style=flat-square&logo=supabase)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)
![Infra Cost](https://img.shields.io/badge/Infra_Cost-0%E2%82%AC-brightgreen?style=flat-square)

> **Wallet Bitcoin / Lightning Network conçu pour l'Afrique de l'Ouest.** Épargne programmée, transferts instantanés, réception hors-ligne — tout ça dans votre poche, sans banque.

<!-- screenshot -->

---

## ✨ Fonctionnalités clés

- ⚡ **Wallet Lightning principal** — Envoyer et recevoir des sats instantanément via bolt11 / LNURL
- 🏦 **Épargne programmée** — Chaque objectif d'épargne est un wallet LNbits isolé, verrouillé dans le temps
- 📵 **Réception hors-ligne** — Générez des vouchers Cashu (eCash) pour recevoir des paiements sans connexion
- 🔐 **Sécurité renforcée** — Clés API chiffrées AES-256 via Supabase Vault, zéro clé côté client
- 🌍 **Pensé pour l'Afrique de l'Ouest** — UX simple, faible consommation de données, support Flash Sandbox

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Native App                  │
│              (Expo SDK 52 + TypeScript)              │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Wallet  │  │ Épargne  │  │  Cashu (eCash)   │  │
│  │Lightning │  │Programmée│  │  Hors-ligne      │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
└───────┼─────────────┼─────────────────┼─────────────┘
        │             │                 │
        ▼             ▼                 ▼
┌─────────────────────────────────────────────────────┐
│              Supabase Edge Functions                │
│         (Auth · PostgreSQL · Realtime · Vault)      │
└──────────────┬──────────────────────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌─────────────┐
│   LNbits    │  │    Flash    │
│ legend.lnbits│  │  Sandbox   │
│    .com     │  │    API     │
└─────────────┘  └─────────────┘
```

---

## 🛠️ Stack technique

| Catégorie            | Technologie                         | Rôle                                      |
|----------------------|--------------------------------------|-------------------------------------------|
| **Framework**        | React Native + Expo SDK 52           | Application mobile cross-platform         |
| **Langage**          | TypeScript 5.x                       | Typage statique                           |
| **Navigation**       | Expo Router v4                       | File-based routing                        |
| **UI**               | NativeWind v4 + React Native Paper v5| Styles Tailwind + composants Material     |
| **État global**      | Zustand                              | State management léger                    |
| **Requêtes**         | TanStack Query v5                    | Cache & synchronisation serveur           |
| **Backend**          | Supabase (Edge Functions + Auth)     | API serverless, authentification          |
| **Base de données**  | Supabase PostgreSQL                  | Stockage utilisateurs, objectifs          |
| **Temps réel**       | Supabase Realtime                    | Notifications de paiement live            |
| **Secrets**          | Supabase Vault (AES-256)             | Chiffrement des clés API LNbits           |
| **Lightning**        | LNbits (legend.lnbits.com)           | Wallets Lightning isolés par objectif     |
| **Sandbox**          | Flash Sandbox                        | Tests de paiements Lightning              |
| **eCash**            | Cashu                                | Vouchers pour réception hors-ligne        |

---

## 📋 Prérequis

- Node.js ≥ 20
- npm ≥ 10
- Expo CLI (`npm install -g expo-cli`)
- Un compte [Supabase](https://supabase.com) (gratuit)
- Un compte [LNbits](https://legend.lnbits.com) (gratuit)
- Expo Go sur votre téléphone **ou** un émulateur Android/iOS

---

## 🚀 Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-org/satvault.git
cd satvault

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# → Éditer .env avec vos clés (voir section ci-dessous)

# 4. Lancer l'application
npx expo start
```

Scannez le QR code avec **Expo Go** (Android/iOS) ou appuyez sur `a` pour l'émulateur Android, `i` pour iOS.

---

## 🔑 Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# LNbits
EXPO_PUBLIC_LNBITS_URL=https://legend.lnbits.com

# Flash Sandbox
EXPO_PUBLIC_FLASH_API_URL=https://api.flashapp.me/sandbox
EXPO_PUBLIC_FLASH_API_KEY=votre_cle_flash

# Cashu Mint (optionnel, par défaut : mint public)
EXPO_PUBLIC_CASHU_MINT_URL=https://mint.minibits.cash/Bitcoin
```

> ⚠️ Ne commitez jamais ce fichier. Les clés secrètes LNbits (admin key, invoice key) sont stockées **uniquement** dans Supabase Vault, jamais dans le client.

---

## 📁 Structure du projet

```
satvault/
├── app/                        # Expo Router — routes de l'app
│   ├── (auth)/
│   │   ├── login.tsx           # Connexion (Magic Link Supabase)
│   │   └── register.tsx        # Inscription
│   ├── (tabs)/
│   │   ├── index.tsx           # Dashboard principal (solde Lightning)
│   │   ├── send.tsx            # Envoyer des sats (bolt11 / LNURL)
│   │   ├── receive.tsx         # Recevoir (QR code + voucher Cashu)
│   │   ├── savings.tsx         # Liste des objectifs d'épargne
│   │   └── settings.tsx        # Paramètres utilisateur
│   ├── savings/
│   │   ├── new.tsx             # Créer un objectif d'épargne
│   │   └── [id].tsx            # Détail d'un objectif
│   └── _layout.tsx             # Layout racine
├── components/                 # Composants réutilisables
├── hooks/                      # Hooks personnalisés
├── stores/                     # Zustand stores
├── services/                   # Appels Supabase / LNbits / Cashu
├── supabase/
│   └── functions/              # Edge Functions Supabase (Deno)
├── assets/                     # Images, fonts
├── .env.example
└── app.json
```

---

## 👥 Équipe & Hackathon

Projet développé pour le **Bitcoin Hackathon 2026** 🏆

| Rôle              | Contributeur        |
|-------------------|---------------------|
| Lead Dev          | AHIFFON Jephte      |

---

## 📄 License

MIT © 2026 SatVault — Distribué librement, construisez dessus.
