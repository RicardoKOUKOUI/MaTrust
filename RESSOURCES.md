# SatVault — Ressources, Packages & Architecture Complète

> Document de référence technique exhaustif. À consulter en priorité avant de toucher au code.
> Mis à jour au : **2026-06-30**

---

## Table des matières

1. [Environnement technique](#1-environnement-technique)
2. [Toutes les dépendances](#2-toutes-les-dépendances)
   - 2.1 [Dépendances de production](#21-dépendances-de-production)
   - 2.2 [Dépendances de développement](#22-dépendances-de-développement)
3. [Architecture du projet](#3-architecture-du-projet)
4. [Structure complète des fichiers](#4-structure-complète-des-fichiers)
5. [Fichiers de configuration détaillés](#5-fichiers-de-configuration-détaillés)
6. [Système de routing — Expo Router v4](#6-système-de-routing--expo-router-v4)
7. [Gestion d'état — Zustand](#7-gestion-détat--zustand)
8. [Types TypeScript](#8-types-typescript)
9. [Couche de données — lib/](#9-couche-de-données--lib)
10. [Hooks](#10-hooks)
11. [Constantes & Thème](#11-constantes--thème)
12. [Variables d'environnement](#12-variables-denvironnement)
13. [Scripts npm](#13-scripts-npm)
14. [Services externes](#14-services-externes)
15. [Flux de données complet](#15-flux-de-données-complet)
16. [Conventions & patterns](#16-conventions--patterns)

---

## 1. Environnement technique

| Élément | Valeur |
|---|---|
| **Node.js** | v24.15.0 |
| **npm** | 11.12.1 |
| **Expo SDK** | 56.0.12 |
| **React Native** | 0.85.3 |
| **React** | 19.2.3 |
| **TypeScript** | 6.0.3 |
| **OS de développement** | Windows 10/11 |
| **Shell** | sh (Git Bash) |
| **Cible** | iOS & Android |

> **Note importante :** Le projet utilise `--legacy-peer-deps` pour l'installation des packages à cause d'un conflit entre les dépendances web de `expo-router` (vaul → @radix-ui) et l'absence de `react-dom` dans un contexte React Native. Toujours utiliser `npm install --legacy-peer-deps` pour ajouter de nouveaux packages.

---

## 2. Toutes les dépendances

### 2.1 Dépendances de production

#### Framework principal

| Package | Version | Rôle | Documentation |
|---|---|---|---|
| `expo` | ~56.0.12 | SDK Expo — noyau de l'application, gère le build, les modules natifs, le metro bundler | https://docs.expo.dev/versions/v56.0.0/ |
| `react` | 19.2.3 | Bibliothèque UI — gestion du Virtual DOM, hooks, rendu | https://react.dev |
| `react-native` | 0.85.3 | Runtime React pour iOS/Android — composants natifs (View, Text, etc.) | https://reactnative.dev |
| `react-dom` | 19.2.3 | Support du rendu web (requis par expo-router pour la cible web) | https://react.dev |
| `react-native-web` | ^0.21.2 | Adaptateur React Native → HTML pour la cible web | https://necolas.github.io/react-native-web |

#### Navigation

| Package | Version | Rôle | Documentation |
|---|---|---|---|
| `expo-router` | ~56.2.11 | Routing basé sur les fichiers (file-based routing). Chaque fichier dans `app/` devient une route automatiquement. Basé sur React Navigation en dessous. | https://docs.expo.dev/router/introduction/ |
| `expo-status-bar` | ~56.0.4 | Contrôle de la barre de statut iOS/Android (couleur, visibilité, style) | https://docs.expo.dev/versions/v56.0.0/sdk/status-bar/ |
| `react-native-screens` | 4.25.2 | Optimisation des performances de navigation — utilise les composants de navigation natifs au lieu de composants JS purs | https://github.com/software-mansion/react-native-screens |
| `react-native-safe-area-context` | ~5.7.0 | Fournit les insets de la safe area (encoches, Dynamic Island, barre de navigation) via `SafeAreaView` | https://github.com/th3rdwave/react-native-safe-area-context |
| `react-native-gesture-handler` | ~2.31.1 | Gestion avancée des gestes (swipe, pinch, etc.) requis par React Navigation | https://docs.swmansion.com/react-native-gesture-handler/ |

#### UI & Styles

| Package | Version | Rôle | Documentation |
|---|---|---|---|
| `nativewind` | ^4.2.6 | Intègre Tailwind CSS dans React Native. Permet d'utiliser `className="flex-1 bg-[#0a0a0a]"` sur les composants RN. Compile les classes Tailwind en StyleSheet natif via Babel + Metro. | https://www.nativewind.dev/v4/overview |
| `tailwindcss` | ^3.4.19 | Moteur de génération CSS utilitaire. NativeWind v4 requiert Tailwind v3. | https://tailwindcss.com/docs |
| `react-native-paper` | ^5.15.3 | Bibliothèque de composants Material Design 3 pour React Native (boutons, cartes, dialogs, etc.) | https://callstack.github.io/react-native-paper/ |
| `react-native-reanimated` | 4.3.1 | Animations fluides et performantes qui s'exécutent sur le thread natif (UI thread), pas JS. Requis pour les animations complexes et les gestes animés. | https://docs.swmansion.com/react-native-reanimated/ |
| `react-native-svg` | 15.15.4 | Rendu SVG dans React Native. Dépendance de `react-native-qrcode-svg`. | https://github.com/software-mansion/react-native-svg |
| `react-native-qrcode-svg` | ^6.3.21 | Génération de QR codes en SVG. Utilisé pour afficher les invoices Lightning (bolt11) et les vouchers Cashu. | https://github.com/awesomejerry/react-native-qrcode-svg |

#### Gestion d'état

| Package | Version | Rôle | Documentation |
|---|---|---|---|
| `zustand` | ^5.0.14 | Gestionnaire d'état global minimaliste. Aucun Provider nécessaire. Deux stores : `authStore` (session/user) et `walletStore` (balance/transactions). | https://zustand.docs.pmnd.rs/ |
| `@tanstack/react-query` | ^5.101.2 | Gestion des requêtes API avec cache, refetch automatique, états de chargement/erreur. Wraps les appels Supabase et LNbits. | https://tanstack.com/query/v5 |

#### Réseau & HTTP

| Package | Version | Rôle | Documentation |
|---|---|---|---|
| `axios` | ^1.18.1 | Client HTTP pour les appels à l'API LNbits. Configuré avec une instance `axios.create()` dans `lib/lnbits.ts` avec la baseURL et les headers par défaut. | https://axios-http.com/docs/intro |

#### Stockage

| Package | Version | Rôle | Documentation |
|---|---|---|---|
| `expo-secure-store` | ~56.0.4 | Stockage sécurisé chiffré sur l'appareil (Keychain iOS / Android Keystore). Utilisé pour les tokens JWT et les clés API sensibles. | https://docs.expo.dev/versions/v56.0.0/sdk/securestore/ |
| `@react-native-async-storage/async-storage` | 2.2.0 | Stockage clé-valeur persistant non chiffré. Utilisé comme adapter de session pour le client Supabase. | https://react-native-async-storage.github.io/async-storage/ |

#### Backend — Supabase

| Package | Version | Rôle | Documentation |
|---|---|---|---|
| `@supabase/supabase-js` | ^2.108.2 | Client officiel Supabase. Gère : Auth (signIn/signUp/signOut), PostgreSQL via RLS, Edge Functions, Realtime subscriptions. Configuré dans `lib/supabase.ts`. | https://supabase.com/docs/reference/javascript |

#### Bitcoin / Lightning

| Package | Version | Rôle | Documentation |
|---|---|---|---|
| `@cashu/cashu-ts` | ^4.6.0 | SDK TypeScript pour le protocole Cashu (eCash). Permet de générer et racheter des tokens eCash (vouchers hors-ligne) depuis un wallet LNbits. | https://github.com/cashubtc/cashu-ts |

#### Fonctionnalités natives Expo

| Package | Version | Rôle | Documentation |
|---|---|---|---|
| `expo-camera` | ~56.0.8 | Accès à la caméra de l'appareil. Utilisé pour scanner les QR codes des invoices Lightning et des vouchers Cashu. Nécessite permission `CAMERA`. | https://docs.expo.dev/versions/v56.0.0/sdk/camera/ |
| `expo-local-authentication` | ~56.0.4 | Authentification biométrique (Face ID, Touch ID, empreinte digitale). Utilisé pour confirmer les envois de sats. | https://docs.expo.dev/versions/v56.0.0/sdk/local-authentication/ |
| `expo-notifications` | ~56.0.18 | Notifications push locales et distantes. Utilisé pour notifier l'utilisateur quand un objectif d'épargne est débloqué (via Supabase Realtime). | https://docs.expo.dev/versions/v56.0.0/sdk/notifications/ |
| `expo-haptics` | ~56.0.3 | Retour haptique (vibration de précision). Utilisé pour les confirmations de transaction et les interactions importantes. | https://docs.expo.dev/versions/v56.0.0/sdk/haptics/ |

---

### 2.2 Dépendances de développement

| Package | Version | Rôle |
|---|---|---|
| `typescript` | ~6.0.3 | Compilateur TypeScript — vérification des types à la compilation. |
| `@types/react` | ~19.2.2 | Types TypeScript pour React 19 (JSX, hooks, etc.). |

---

## 3. Architecture du projet

```
┌─────────────────────────────────────────────────────────────────┐
│                    APPLICATION MOBILE                           │
│                  React Native 0.85 + Expo 56                   │
│                                                                 │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Expo Router │  │   NativeWind  │  │  React Native Paper  │  │
│  │  (routing)  │  │  (styles TW) │  │    (composants UI)   │  │
│  └──────┬──────┘  └──────────────┘  └──────────────────────┘  │
│         │                                                        │
│  ┌──────▼──────────────────────────────────────────────────┐   │
│  │                   ÉCRANS (app/)                          │   │
│  │  (auth)/login  (auth)/register                          │   │
│  │  (tabs)/dashboard  transfer  savings  cashu             │   │
│  │  savings/new  savings/[id]                              │   │
│  └──────┬──────────────────────────────────────────────────┘   │
│         │                                                        │
│  ┌──────▼──────────────────────────────────────────────────┐   │
│  │              GESTION D'ÉTAT (Zustand)                   │   │
│  │   authStore (user, session)  walletStore (balance, txs) │   │
│  └──────┬──────────────────────────────────────────────────┘   │
│         │                                                        │
│  ┌──────▼──────────────────────────────────────────────────┐   │
│  │               COUCHE DATA (lib/)                        │   │
│  │   supabase.ts (client Auth/DB)   lnbits.ts (API HTTP)  │   │
│  └──────┬──────────────────────┬───────────────────────────┘   │
└─────────┼──────────────────────┼──────────────────────────────┘
          │ HTTPS                │ HTTPS
┌─────────▼──────────┐  ┌───────▼──────────────────────────────┐
│     SUPABASE        │  │           LNBITS                      │
│  PostgreSQL · Auth  │  │  legend.lnbits.com                   │
│  Edge Functions     │  │  API v1 — wallets, payments, invoices│
│  Realtime           │  └──────────────────────────────────────┘
└─────────────────────┘
          │
┌─────────▼──────────────────────────────┐
│         SERVICES EXTERNES              │
│  Flash Sandbox (taux XOF/BTC)          │
│  @cashu/cashu-ts (eCash hors-ligne)    │
│  LNURL (adresses lisibles)             │
└────────────────────────────────────────┘
```

### Principe clé : pas de backend séparé

Toute la logique métier sensible vit dans les **Supabase Edge Functions** (TypeScript / Deno). L'application mobile ne parle jamais directement à LNbits pour les opérations critiques — elle passe par Supabase qui valide, sécurise, et exécute.

**Exception :** La lecture du solde et des transactions peut appeler LNbits directement depuis `lib/lnbits.ts` car ce sont des opérations de lecture (non critiques).

---

## 4. Structure complète des fichiers

```
projet-forge/
│
├── app/                          ← Tous les écrans (Expo Router file-based routing)
│   ├── _layout.tsx               ← Layout racine : QueryClient + AuthGuard + StatusBar
│   │
│   ├── (auth)/                   ← Groupe de routes d'authentification
│   │   ├── _layout.tsx           ← Layout auth (Stack sans header)
│   │   ├── login.tsx             ← Écran de connexion
│   │   └── register.tsx          ← Écran d'inscription
│   │
│   ├── (tabs)/                   ← Groupe des onglets principaux
│   │   ├── _layout.tsx           ← Tab bar (4 onglets, thème sombre, accent orange)
│   │   ├── dashboard.tsx         ← Tableau de bord (solde, transactions, raccourcis)
│   │   ├── transfer.tsx          ← Envoi/réception via Lightning
│   │   ├── savings.tsx           ← Liste des objectifs d'épargne
│   │   └── cashu.tsx             ← Génération et rachat de vouchers Cashu
│   │
│   └── savings/                  ← Routes imbriquées pour l'épargne
│       ├── new.tsx               ← Formulaire création d'objectif
│       └── [id].tsx              ← Détail d'un objectif (route dynamique)
│
├── store/                        ← Stores Zustand (état global)
│   ├── authStore.ts              ← Session utilisateur, signIn/signUp/signOut
│   └── walletStore.ts            ← Balance sats/XOF, liste des transactions
│
├── lib/                          ← Clients et wrappers de services externes
│   ├── supabase.ts               ← Client Supabase (Auth + DB + Realtime)
│   └── lnbits.ts                 ← Client HTTP LNbits (axios)
│
├── hooks/                        ← Hooks React custom
│   └── useAuth.ts                ← Souscription Supabase onAuthStateChange → store
│
├── types/                        ← Interfaces et enums TypeScript
│   └── index.ts                  ← User, Session, Transaction, SavingsGoal, Invoice + enums
│
├── constants/                    ← Valeurs partagées dans tout le projet
│   └── index.ts                  ← COLORS, LNBITS_URL, SUPABASE_URL, SATS_TO_XOF_RATE
│
├── assets/                       ← Images et icônes (générées par Expo)
│   ├── icon.png                  ← Icône principale de l'app
│   ├── favicon.png               ← Favicon web
│   ├── splash-icon.png           ← Écran de démarrage
│   ├── android-icon-foreground.png
│   ├── android-icon-background.png
│   └── android-icon-monochrome.png
│
├── node_modules/                 ← Dépendances installées (ne pas modifier)
├── .expo/                        ← Cache et types générés par Expo (ne pas modifier)
│
├── ── Fichiers de configuration ──
├── app.json                      ← Config Expo (nom, scheme, plugins, plateformes)
├── babel.config.js               ← Config Babel (preset expo + NativeWind + Reanimated)
├── metro.config.js               ← Config Metro bundler (NativeWind CSS support)
├── tailwind.config.js            ← Config Tailwind CSS (content paths, preset NativeWind)
├── tsconfig.json                 ← Config TypeScript (strict, alias @/*, types)
├── global.css                    ← Directives Tailwind (@tailwind base/components/utilities)
├── nativewind-env.d.ts           ← Déclaration des types NativeWind (className sur composants RN)
├── global.d.ts                   ← Déclaration du module *.css pour TypeScript
├── package.json                  ← Dépendances et scripts npm
├── package-lock.json             ← Lockfile npm (versions exactes résolues)
├── index.ts                      ← Ancien point d'entrée (ignoré, remplacé par expo-router/entry)
├── App.tsx                       ← Ancien composant racine (ignoré, remplacé par app/_layout.tsx)
├── .gitignore                    ← Fichiers ignorés par git
├── .env.example                  ← Template des variables d'environnement
├── LICENSE                       ← Licence MIT
├── AGENTS.md                     ← Instructions pour les agents IA (Zed)
├── CLAUDE.md                     ← Instructions Claude
│
├── ── Documentation ──
├── SATVAULT.md                   ← Cahier des charges technique complet
├── README.md                     ← README GitHub standard
├── README.html                   ← Landing page HTML/CSS/JS du projet
├── PROGRESS.md                   ← Suivi de progression (à mettre à jour)
└── RESSOURCES.md                 ← CE FICHIER — documentation technique exhaustive
```

---

## 5. Fichiers de configuration détaillés

### `app.json` — Configuration Expo

```json
{
  "expo": {
    "name": "SatVault",          // Nom affiché sur l'écran d'accueil iOS/Android
    "slug": "satvault",          // Identifiant unique Expo (URL-safe)
    "version": "1.0.0",          // Version de l'application
    "scheme": "satvault",        // Schéma de deep link (satvault://...) — REQUIS par expo-router
    "orientation": "portrait",   // Bloque la rotation
    "userInterfaceStyle": "dark", // Force le thème sombre système

    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.satvault.app"  // Identifiant App Store
    },

    "android": {
      "package": "com.satvault.app",           // Identifiant Play Store
      "adaptiveIcon": { ... },                 // Icônes adaptatives Android
      "predictiveBackGestureEnabled": false    // Désactive le geste retour prédictif
    },

    "web": {
      "bundler": "metro",        // Metro au lieu de webpack (plus rapide, cohérent avec native)
      "favicon": "./assets/favicon.png"
    },

    "plugins": [
      "expo-router",             // Active le file-based routing
      "expo-secure-store"        // Configure Keychain/Keystore
    ],

    "experiments": {
      "typedRoutes": true        // Active les types TypeScript pour les routes expo-router
    }
  }
}
```

---

### `package.json` — Point d'entrée

```json
{
  "main": "expo-router/entry"    // CRUCIAL : remplace index.ts par le point d'entrée expo-router
}
```

> Sans ce champ, expo-router ne fonctionne pas. Le fichier `index.ts` et `App.tsx` du scaffold sont désormais inactifs.

---

### `babel.config.js` — Transpilation

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
      // jsxImportSource: 'nativewind' active le support className sur TOUS les composants JSX
    ],
    plugins: ['nativewind/babel'],
    // Le plugin nativewind/babel transforme className="" → style={StyleSheet.create(...)}
  };
};
```

> **Important :** `react-native-reanimated/plugin` est normalement requis ici. À ajouter si des animations Reanimated ne fonctionnent pas.

---

### `metro.config.js` — Bundler

```js
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: './global.css' });
// withNativeWind ajoute le support des imports CSS (.css) dans Metro
// et pointe vers global.css comme source Tailwind
```

---

### `tailwind.config.js` — CSS utilitaire

```js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',        // Scanne tous les écrans
    './components/**/*.{js,jsx,ts,tsx}', // (futur) composants partagés
    './hooks/**/*.{js,jsx,ts,tsx}',      // Hooks (au cas où des classes y seraient utilisées)
  ],
  presets: [require('nativewind/preset')],
  // Le preset NativeWind adapte Tailwind pour React Native :
  // - Supprime les propriétés non supportées (border-radius en % → fixe, etc.)
  // - Ajoute des utilitaires RN spécifiques
  theme: {
    extend: {
      colors: {
        bitcoin: '#f7931a',  // Classe tw: text-bitcoin, bg-bitcoin
      },
    },
  },
};
```

---

### `tsconfig.json` — TypeScript

```json
{
  "extends": "expo/tsconfig.base",     // Config de base Expo (jsx: react-native, module: bundler, etc.)
  "compilerOptions": {
    "strict": true,                    // Active toutes les vérifications strictes
    "paths": {
      "@/*": ["./*"]                   // Alias : @/store/authStore → ./store/authStore
    }
  },
  "include": [
    "**/*.ts", "**/*.tsx",             // Tous les fichiers TypeScript
    ".expo/types/**/*.d.ts",           // Types générés par Expo (routes typées, etc.)
    "expo-env.d.ts",                   // Déclarations des variables EXPO_PUBLIC_*
    "nativewind-env.d.ts",             // className sur composants RN
    "global.d.ts",                     // Module CSS
    ".expo/types/**/*.ts"
  ]
}
```

---

### `global.css` — Tailwind directives

```css
@tailwind base;        /* Reset et variables CSS de base */
@tailwind components;  /* Classes de composants (vide par défaut) */
@tailwind utilities;   /* Toutes les classes utilitaires (flex, bg-, text-, etc.) */
```

Ce fichier est importé dans `app/_layout.tsx` comme `import '../global.css'`.

---

### `nativewind-env.d.ts` — Types NativeWind

```ts
/// <reference types="nativewind/types" />
```

Ce fichier dit à TypeScript que la prop `className` est valide sur les composants React Native (View, Text, TouchableOpacity, etc.).

---

### `global.d.ts` — Module CSS

```ts
declare module '*.css' {
  const content: string;
  export default content;
}
```

Permet à TypeScript d'accepter `import '../global.css'` sans erreur.

---

## 6. Système de routing — Expo Router v4

Expo Router utilise une convention **file-based routing** : la structure des dossiers dans `app/` **est** la structure des routes.

### Convention des groupes `(nom)`

Les dossiers entre parenthèses sont des **groupes de layout** — ils n'apparaissent pas dans l'URL.

```
app/(auth)/login.tsx    →  route: /login   (pas /(auth)/login)
app/(tabs)/dashboard.tsx →  route: /dashboard
```

### Convention des routes dynamiques `[param]`

```
app/savings/[id].tsx  →  route: /savings/123  →  params: { id: "123" }
```

### Layouts en cascade

Chaque `_layout.tsx` s'applique à tous les fichiers du même dossier et de ses sous-dossiers.

```
app/_layout.tsx              ← Layout racine (toujours rendu)
  app/(auth)/_layout.tsx     ← Layout des écrans auth
    app/(auth)/login.tsx
    app/(auth)/register.tsx
  app/(tabs)/_layout.tsx     ← Tab bar (rendu pour toutes les tabs)
    app/(tabs)/dashboard.tsx
    app/(tabs)/transfer.tsx
    app/(tabs)/savings.tsx
    app/(tabs)/cashu.tsx
  app/savings/[id].tsx       ← Rendu sur le layout racine directement
```

### AuthGuard — Protection des routes

Le composant `AuthGuard` dans `app/_layout.tsx` surveille l'état de session et redirige :

```
Session null + hors groupe (auth) → router.replace('/(auth)/login')
Session active + dans groupe (auth) → router.replace('/(tabs)/dashboard')
```

### Navigation programmatique

```ts
import { router } from 'expo-router';

router.push('/savings/new');          // Naviguer vers une route
router.replace('/(tabs)/dashboard'); // Remplacer (sans retour arrière)
router.back();                        // Retour

// Routes typées (grâce à typedRoutes: true dans app.json)
router.push('/savings/[id]', { id: '123' });
```

---

## 7. Gestion d'état — Zustand

### `store/authStore.ts`

Gère la session utilisateur et les actions d'authentification.

| État | Type | Description |
|---|---|---|
| `user` | `User \| null` | Profil utilisateur courant |
| `session` | `Session \| null` | Session active avec JWT |
| `isLoading` | `boolean` | Indique qu'une action auth est en cours |

| Action | Description |
|---|---|
| `signIn(email, password)` | Appelle `supabase.auth.signInWithPassword`, mappe le résultat vers nos types, met à jour le store |
| `signUp(email, password, name, phone)` | Appelle `supabase.auth.signUp` avec les métadonnées, crée la session si disponible immédiatement |
| `signOut()` | Appelle `supabase.auth.signOut`, vide le store |
| `setSession(session)` | Setter direct utilisé par `useAuth` hook pour les changements de session Supabase |

**Usage dans un composant :**
```ts
const { signIn, isLoading } = useAuthStore();
const user = useAuthStore((s) => s.user); // Sélecteur (évite les re-renders inutiles)
```

---

### `store/walletStore.ts`

Gère le solde et les transactions du wallet LNbits principal.

| État | Type | Description |
|---|---|---|
| `balanceSats` | `number` | Solde en satoshis |
| `balanceXof` | `number` | Solde converti en XOF (via `SATS_TO_XOF_RATE`) |
| `transactions` | `Transaction[]` | Historique des transactions |
| `isLoading` | `boolean` | Chargement en cours |

| Action | Description |
|---|---|
| `fetchBalance()` | Récupère le solde LNbits via `lib/lnbits.ts → getWalletBalance()` |
| `fetchTransactions()` | Récupère l'historique via `lib/lnbits.ts → getTransactions()` |

**Dépendance inter-stores :** `walletStore` lit `useAuthStore.getState().user` pour obtenir le `lnbits_wallet_id`. Utilise `getState()` (hors hook) pour éviter les dépendances circulaires React.

---

## 8. Types TypeScript

Tous dans `types/index.ts`.

### Enums

```ts
enum TransactionType {
  SEND            // Envoi de sats vers une invoice externe
  RECEIVE         // Réception de sats via invoice générée
  DEPOSIT_SAVING  // Dépôt vers un objectif d'épargne
  CASHU_OUT       // Génération d'un voucher Cashu (débit wallet)
  CASHU_IN        // Rachat d'un voucher Cashu (crédit wallet)
}

enum TransactionStatus {
  PENDING    // En attente de confirmation
  COMPLETED  // Confirmée sur le réseau
  FAILED     // Échouée ou expirée
}

enum SavingsStatus {
  ACTIVE     // Objectif en cours, fonds bloqués
  UNLOCKED   // Date atteinte, retrait autorisé
  COMPLETED  // Objectif atteint et fonds retirés
}
```

### Interfaces

```ts
interface User {
  id: string;              // UUID Supabase Auth
  email: string;
  name: string;
  phone: string;
  lnbits_wallet_id: string; // Clé API du wallet LNbits principal (récupérée via Supabase Vault)
  lnurl_address: string;    // Ex: "prenom@satvault.app"
}

interface Session {
  access_token: string;    // JWT Supabase
  user: User;
}

interface Transaction {
  id: string;              // = checking_id LNbits
  user_id: string;         // UUID Supabase
  type: TransactionType;
  amount_sats: number;     // Toujours positif (le signe vient du type)
  memo?: string;
  bolt11?: string;         // Invoice Lightning (pour SEND/RECEIVE)
  status: TransactionStatus;
  created_at: string;      // ISO 8601
}

interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;               // Ex: "Voyage"
  emoji: string;              // Ex: "✈️"
  target_amount_sats: number; // Montant cible
  current_amount_sats: number;// Montant accumulé
  locked_until: string;       // ISO 8601 — date de déblocage
  status: SavingsStatus;
}

interface Invoice {
  payment_hash: string;       // Hash unique du paiement
  payment_request: string;    // String bolt11 (le QR code)
  checking_id: string;        // ID pour vérifier le statut
  lnurl_response?: string;    // Réponse LNURL optionnelle
}
```

---

## 9. Couche de données — `lib/`

### `lib/supabase.ts` — Client Supabase

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(URL, ANON_KEY, {
  auth: {
    storage: AsyncStorage,      // Persiste la session dans AsyncStorage (pas localStorage)
    autoRefreshToken: true,     // Rafraîchit le JWT avant expiration
    persistSession: true,       // Sauvegarde la session entre les lancements
    detectSessionInUrl: false,  // Désactivé (pas de navigateur web)
  },
});
```

**Méthodes utilisées dans le projet :**
- `supabase.auth.signInWithPassword({ email, password })`
- `supabase.auth.signUp({ email, password, options: { data: { name, phone } } })`
- `supabase.auth.signOut()`
- `supabase.auth.getSession()` — hydratation initiale du store
- `supabase.auth.onAuthStateChange(callback)` — écoute continue

---

### `lib/lnbits.ts` — Client LNbits

Utilise une instance `axios` avec `baseURL = LNBITS_URL`.

Chaque appel passe le header `X-Api-Key: <walletApiKey>`.

| Fonction | Méthode HTTP | Endpoint | Description |
|---|---|---|---|
| `getWalletBalance(apiKey)` | GET | `/api/v1/wallet` | Retourne le solde en sats (LNbits renvoie en millisats → ÷ 1000) |
| `createInvoice(apiKey, amount, memo)` | POST | `/api/v1/payments` | Crée une invoice RECEIVE (`out: false`) |
| `payInvoice(apiKey, bolt11)` | POST | `/api/v1/payments` | Paye une invoice SEND (`out: true`) |
| `getTransactions(apiKey)` | GET | `/api/v1/payments` | Retourne l'historique, mappe vers notre type `Transaction` |

**Mapping LNbits → Transaction :**
- `amount < 0` → `TransactionType.SEND`
- `amount > 0` → `TransactionType.RECEIVE`
- `amount` en millisats → `Math.abs(Math.floor(amount / 1000))` sats
- `status === 'complete'` → `TransactionStatus.COMPLETED`

---

## 10. Hooks

### `hooks/useAuth.ts`

Monte une souscription Supabase `onAuthStateChange` pour synchroniser automatiquement l'état de la session avec le store Zustand.

**Cycle de vie :**
1. Au montage : `supabase.auth.getSession()` → hydrate le store si session persistée
2. Pendant la vie de l'app : `onAuthStateChange` → met à jour le store à chaque login/logout
3. Au démontage : `listener.subscription.unsubscribe()` → nettoyage

**Utilisé dans :** `app/_layout.tsx` via `AuthGuard` (monté une seule fois à la racine).

**Fonction helper interne `buildSession(raw)`** : Mappe le format Supabase (`user.user_metadata.name`, etc.) vers notre interface `User` propre.

---

## 11. Constantes & Thème

### `constants/index.ts`

```ts
// Palette de couleurs du design system
export const COLORS = {
  background:    '#0a0a0a',  // Fond principal des écrans
  surface:       '#111111',  // Surface légèrement plus claire (tab bar)
  card:          '#1a1a1a',  // Cartes, inputs, éléments de liste
  primary:       '#f7931a',  // Orange Bitcoin — boutons CTA, accent
  text:          '#ffffff',  // Texte principal
  textSecondary: '#888888',  // Texte secondaire, labels, hints
  success:       '#22c55e',  // Montants positifs (reçus)
  error:         '#ef4444',  // Montants négatifs (envoyés), erreurs
  border:        '#2a2a2a',  // Bordures des cartes et inputs
};

// URLs des services
export const LNBITS_URL = process.env.EXPO_PUBLIC_LNBITS_URL || 'https://legend.lnbits.com';
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
export const APP_NAME = 'SatVault';

// Taux de conversion (à remplacer par l'API Flash Sandbox)
export const SATS_TO_XOF_RATE = 0.33; // 1 sat ≈ 0.33 XOF (exemple statique)
```

> **À faire :** Remplacer `SATS_TO_XOF_RATE` par un appel à l'API Flash Sandbox pour un taux en temps réel.

---

## 12. Variables d'environnement

Expo expose les variables préfixées `EXPO_PUBLIC_` au code JS/TS via `process.env`.

| Variable | Obligatoire | Description | Exemple |
|---|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | ✅ Oui | URL du projet Supabase | `https://xxxx.supabase.co` |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | ✅ Oui | Clé publique anonyme Supabase (JWT) | `eyJhbGciOiJIUzI1NiJ9...` |
| `EXPO_PUBLIC_LNBITS_URL` | ❌ Non | URL de l'instance LNbits (défaut: legend) | `https://legend.lnbits.com` |
| `EXPO_PUBLIC_FLASH_API_URL` | ❌ Non | URL de l'API Flash Sandbox (taux XOF) | `https://api.flashapp.me/sandbox` |

**Configuration :**
1. Copier `.env.example` → `.env` (jamais commiter `.env`)
2. Remplir les valeurs Supabase (obtenues sur app.supabase.com)

> **Sécurité :** Les variables `EXPO_PUBLIC_*` sont **publiques** et embarquées dans le bundle de l'app. Ne jamais y mettre de secrets (clés privées, `service_role` Supabase, etc.). Les secrets vivent dans les Supabase Edge Functions via les variables d'environnement Supabase (côté serveur).

---

## 13. Scripts npm

```json
{
  "start":   "expo start",           // Lance le serveur Metro + QR code pour Expo Go
  "android": "expo start --android", // Lance directement sur émulateur/device Android
  "ios":     "expo start --ios",     // Lance sur simulateur iOS (macOS requis)
  "web":     "expo start --web"      // Lance la version web dans le navigateur
}
```

**Commandes utiles non-scriptées :**
```sh
# Ajouter un package compatible Expo SDK 56
npx expo install nom-du-package

# Ajouter un package non-Expo (toujours avec --legacy-peer-deps)
npm install --legacy-peer-deps nom-du-package

# Vérifier les dépendances incompatibles
npx expo-doctor

# Build APK pour Android (cloud EAS)
npx eas build --platform android --profile preview

# Nettoyer le cache Metro
npx expo start --clear
```

---

## 14. Services externes

### LNbits — `https://legend.lnbits.com`

| Élément | Détail |
|---|---|
| **Rôle** | Serveur de wallets Lightning Network |
| **Auth** | Header `X-Api-Key: <wallet_api_key>` |
| **Un wallet = une clé API** | Wallet principal + un wallet par objectif d'épargne |
| **API utilisée** | REST `/api/v1/` |
| **Endpoints clés** | `GET /wallet`, `POST /payments` (in/out), `GET /payments` |
| **Unité** | Millisatoshis (÷ 1000 pour avoir des sats) |
| **Coût** | Gratuit sur l'instance publique legend.lnbits.com |

**Sécurité des clés :** Les clés API LNbits ne doivent **jamais** transiter en clair côté mobile pour les opérations d'envoi. Elles doivent être récupérées via Supabase Vault dans une Edge Function. La lecture du solde (GET /wallet) peut être faite depuis le mobile.

---

### Supabase

| Feature | Usage dans SatVault |
|---|---|
| **Auth** | Inscription, connexion, JWT, gestion des sessions |
| **PostgreSQL** | Tables `users`, `savings`, `transactions` |
| **Edge Functions** | Logique métier sécurisée : création de wallets LNbits, déblocage d'épargne (vérification `locked_until`) |
| **Vault** | Chiffrement AES-256 des clés API LNbits |
| **Realtime** | Notifications quand un objectif d'épargne est débloqué |

**Tables Supabase (à créer dans le dashboard) :**

```sql
-- Table users
CREATE TABLE users (
  id               UUID PRIMARY KEY REFERENCES auth.users,
  email            TEXT UNIQUE NOT NULL,
  name             TEXT,
  phone            TEXT,
  lnbits_wallet_id TEXT,           -- ID du wallet principal
  lnbits_vault_key TEXT,           -- Référence Vault (jamais la clé en clair)
  lnurl_address    TEXT,           -- prenom@satvault.app
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Table savings
CREATE TABLE savings (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID REFERENCES users NOT NULL,
  name                  TEXT NOT NULL,
  emoji                 TEXT,
  target_amount_sats    INT NOT NULL,
  current_amount_sats   INT DEFAULT 0,
  locked_until          TIMESTAMPTZ NOT NULL,
  lnbits_wallet_id      TEXT,
  lnbits_vault_key      TEXT,
  status                TEXT DEFAULT 'ACTIVE', -- ACTIVE | UNLOCKED | COMPLETED
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Table transactions (cache local des txs LNbits)
CREATE TABLE transactions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users NOT NULL,
  type          TEXT NOT NULL,   -- SEND | RECEIVE | DEPOSIT_SAVING | CASHU_OUT | CASHU_IN
  amount_sats   INT NOT NULL,
  memo          TEXT,
  bolt11        TEXT,
  status        TEXT DEFAULT 'PENDING', -- PENDING | COMPLETED | FAILED
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Flash Sandbox — Taux XOF/BTC

| Élément | Détail |
|---|---|
| **Rôle** | Taux de change Bitcoin / Franc CFA en temps réel |
| **Usage** | Affichage du solde en XOF, saisie en XOF, estimation des objectifs |
| **Variable env** | `EXPO_PUBLIC_FLASH_API_URL` |
| **Statut** | Non encore intégré (remplacé par `SATS_TO_XOF_RATE` statique dans constants/) |

---

### Cashu — eCash hors-ligne

| Élément | Détail |
|---|---|
| **Package** | `@cashu/cashu-ts` v4.6.0 |
| **Rôle** | Génération et rachat de tokens eCash |
| **Principe** | L'expéditeur "brûle" des sats de son wallet LNbits → reçoit un token Cashu → le transmet sans internet → le destinataire rachète le token quand il est en ligne |
| **Statut** | Package installé, intégration dans `cashu.tsx` à compléter |

---

### LNURL — Adresses lisibles

| Élément | Détail |
|---|---|
| **Format** | `prenom@satvault.app` (comme une adresse email) |
| **Rôle** | Remplace les longues invoices bolt11 pour les paiements récurrents |
| **Stocké dans** | `users.lnurl_address` en base Supabase |
| **Statut** | Type déclaré, implémentation à faire (nécessite un serveur DNS /.well-known) |

---

## 15. Flux de données complet

### Flux d'inscription

```
register.tsx
  → useAuthStore.signUp(email, password, name, phone)
    → supabase.auth.signUp({ email, password, options: { data: { name, phone } } })
      → Supabase crée le compte Auth
      → Trigger Supabase (à créer) appelle Edge Function "on-user-created"
        → Edge Function appelle LNbits API → crée wallet principal
        → Chiffre la clé API LNbits via Supabase Vault
        → INSERT INTO users (lnbits_wallet_id, lnbits_vault_key, lnurl_address)
      → Retourne JWT + session
    → useAuthStore met à jour user + session
      → AuthGuard détecte session active → redirige vers (tabs)/dashboard
```

### Flux de connexion

```
login.tsx
  → useAuthStore.signIn(email, password)
    → supabase.auth.signInWithPassword(...)
      → Vérifie credentials
      → Retourne JWT + user_metadata (name, phone, lnbits_wallet_id, lnurl_address)
    → Store mis à jour
      → AuthGuard → dashboard
```

### Flux de synchronisation de session (au relancement de l'app)

```
app/_layout.tsx monte
  → AuthGuard → useAuth()
    → hooks/useAuth.ts
      → supabase.auth.getSession()
        → Lit la session depuis AsyncStorage (persisted)
        → Si session valide → setSession(buildSession(raw))
          → AuthGuard détecte session → (tabs)/dashboard
          → Sans relancer de login
      → onAuthStateChange souscrit pour les changements futurs
```

### Flux d'envoi de sats

```
transfer.tsx (à implémenter)
  → Scan QR code (expo-camera) ou saisie manuelle de bolt11
  → expo-local-authentication → validation biométrique
  → useAuthStore.user.lnbits_wallet_id
    → Appel Supabase Edge Function "pay-invoice" (pas lib/lnbits directement pour sécurité)
      → Edge Function récupère clé API depuis Vault
      → Appelle LNbits POST /api/v1/payments { out: true, bolt11 }
      → INSERT INTO transactions (type: SEND, ...)
    → expo-haptics.notificationAsync(SUCCESS)
    → walletStore.fetchBalance() pour rafraîchir
```

### Flux d'épargne — création d'objectif

```
savings/new.tsx (à implémenter)
  → Formulaire : nom, emoji, target_sats, locked_until
  → Supabase Edge Function "create-savings-goal"
    → Appelle LNbits → crée wallet secondaire isolé
    → Chiffre clé API du wallet secondaire via Vault
    → INSERT INTO savings (...)
  → router.back() → liste mise à jour
```

### Flux d'épargne — déblocage

```
savings/[id].tsx → bouton "Retirer"
  → Supabase Edge Function "unlock-savings"
    → Vérifie : locked_until <= NOW()
      → Si non : retourne 403 Forbidden (impossible de contourner côté mobile)
      → Si oui :
        → Récupère clé API wallet secondaire depuis Vault
        → LNbits transfert interne : wallet secondaire → wallet principal
        → UPDATE savings SET status = 'UNLOCKED'
    → walletStore.fetchBalance()
```

---

## 16. Conventions & patterns

### Alias d'import `@/`

```ts
// ✅ Correct
import { useAuthStore } from '@/store/authStore';
import { COLORS } from '@/constants';
import type { Transaction } from '@/types';

// ❌ Éviter
import { useAuthStore } from '../../store/authStore';
```

### Sélecteurs Zustand (performance)

```ts
// ✅ Sélecteur ciblé → re-render uniquement si user change
const user = useAuthStore((s) => s.user);

// ⚠️ Éviter — re-render à chaque changement du store
const { user, session, isLoading, signIn } = useAuthStore();
```

### Styles NativeWind vs StyleSheet

```tsx
// ✅ Préférer NativeWind pour les styles statiques
<View className="flex-1 bg-[#0a0a0a] px-6">

// ✅ Utiliser style= pour les valeurs dynamiques
<View style={{ width: `${progress}%` }} />

// ✅ Mixer les deux quand nécessaire
<View className="rounded-full h-2 overflow-hidden" style={{ width: progress + '%' }}>
```

### Gestion des erreurs dans les stores

```ts
// Pattern : isLoading dans try/finally
set({ isLoading: true });
try {
  const result = await someApiCall();
  set({ data: result });
} finally {
  set({ isLoading: false }); // Toujours exécuté, même en cas d'erreur
}
```

### Thème sombre — Classes Tailwind fréquentes

| Élément | Classe |
|---|---|
| Fond d'écran | `bg-[#0a0a0a]` |
| Carte/input | `bg-[#1a1a1a]` |
| Bordure | `border border-[#2a2a2a]` |
| Texte principal | `text-white` |
| Texte secondaire | `text-[#888888]` |
| Bouton CTA | `bg-[#f7931a]` + texte `text-black font-bold` |
| Bouton secondaire | `bg-[#2a2a2a]` + texte `text-white` |
| Montant positif | `text-[#22c55e]` |
| Montant négatif | `text-[#ef4444]` |
| Arrondi carte | `rounded-2xl` |
| Arrondi bouton | `rounded-xl` |

---

*Document généré pour SatVault — Hackathon 2026*
*Maintenir à jour à chaque ajout de dépendance ou changement d'architecture*
