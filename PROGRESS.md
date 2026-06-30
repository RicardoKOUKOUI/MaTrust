# SatVault — Suivi de progression

## Légende
✅ Fait | 🔄 En cours | ⬜ À faire | ❌ Bloqué

---

## Session en cours
**Date : 2026-06-30**
**Objectif :** Initialisation du projet, documentation de base, mise en place de l'environnement

---

## Environnement & Setup

| Tâche | Statut | Notes |
|-------|--------|-------|
| Création du répertoire projet | ✅ | `projet-forge/` |
| README.md | ✅ | Documentation GitHub complète |
| README.html | ✅ | Landing page autonome |
| PROGRESS.md | ✅ | Ce fichier |
| Initialisation Expo (`npx create-expo-app`) | ⬜ | |
| Configuration TypeScript strict | ⬜ | |
| Installation NativeWind v4 | ⬜ | |
| Installation React Native Paper v5 | ⬜ | |
| Installation Expo Router v4 | ⬜ | |
| Installation Zustand | ⬜ | |
| Installation TanStack Query v5 | ⬜ | |
| Fichier `.env.example` | ⬜ | |
| Configuration ESLint + Prettier | ⬜ | |

---

## Backend — Supabase

| Tâche | Statut | Notes |
|-------|--------|-------|
| Création du projet Supabase | 🔄 | Compte à créer / configurer |
| Schéma base de données (`users`, `wallets`, `savings_goals`, `transactions`) | ⬜ | |
| Row Level Security (RLS) sur toutes les tables | ⬜ | |
| Configuration Supabase Auth (Magic Link email) | ⬜ | |
| Configuration Supabase Vault (chiffrement AES-256) | ⬜ | Stockage clés LNbits |
| Edge Function : `create-wallet` | ⬜ | Créer un wallet LNbits pour un utilisateur |
| Edge Function : `create-savings-goal` | ⬜ | Wallet LNbits isolé par objectif |
| Edge Function : `pay-invoice` | ⬜ | Payer une facture bolt11 |
| Edge Function : `generate-invoice` | ⬜ | Générer une invoice Lightning |
| Edge Function : `get-balance` | ⬜ | Récupérer le solde en sats |
| Edge Function : `create-cashu-voucher` | ⬜ | Générer un voucher eCash Cashu |
| Edge Function : `redeem-cashu-voucher` | ⬜ | Racheter un voucher Cashu |
| Edge Function : `lock-savings` | ⬜ | Bloquer un objectif jusqu'à une date |
| Supabase Realtime : écoute des paiements entrants | ⬜ | |
| Tests Edge Functions (local via Supabase CLI) | ⬜ | |

---

## Services Externes

| Service | Tâche | Statut | Notes |
|---------|-------|--------|-------|
| **LNbits** | Création compte sur legend.lnbits.com | 🔄 | |
| **LNbits** | Récupération Admin Key | ⬜ | À stocker dans Supabase Vault |
| **LNbits** | Test création wallet via API | ⬜ | |
| **Flash** | Inscription Flash Sandbox | ⬜ | |
| **Flash** | Récupération API Key sandbox | ⬜ | |
| **Flash** | Test paiement Lightning via sandbox | ⬜ | |
| **Cashu** | Sélection mint public | ⬜ | minibits.cash ou autre |
| **Cashu** | Test génération token eCash | ⬜ | |

---

## Application Mobile — Structure

| Tâche | Statut | Notes |
|-------|--------|-------|
| Structure dossiers (`app/`, `components/`, `hooks/`, `stores/`, `services/`) | ⬜ | |
| Layout racine `app/_layout.tsx` | ⬜ | Navigation + Providers |
| Configuration tabs `app/(tabs)/_layout.tsx` | ⬜ | |
| Configuration auth guards | ⬜ | Redirect si non connecté |
| Supabase client singleton (`services/supabase.ts`) | ⬜ | |
| LNbits service (`services/lnbits.ts`) | ⬜ | Appels via Edge Functions |
| Cashu service (`services/cashu.ts`) | ⬜ | |
| Zustand store : auth (`stores/authStore.ts`) | ⬜ | |
| Zustand store : wallet (`stores/walletStore.ts`) | ⬜ | |
| Zustand store : savings (`stores/savingsStore.ts`) | ⬜ | |

---

## Écrans

| Écran | Fichier | Statut | Notes |
|-------|---------|--------|-------|
| Login | `app/(auth)/login.tsx` | ⬜ | Magic Link Supabase |
| Register | `app/(auth)/register.tsx` | ⬜ | |
| Dashboard | `app/(tabs)/index.tsx` | ⬜ | Solde Lightning + historique |
| Envoyer | `app/(tabs)/send.tsx` | ⬜ | Scan QR + saisie bolt11 / LNURL |
| Recevoir | `app/(tabs)/receive.tsx` | ⬜ | QR code invoice + bouton Cashu |
| Épargne (liste) | `app/(tabs)/savings.tsx` | ⬜ | Liste des objectifs |
| Créer objectif | `app/savings/new.tsx` | ⬜ | Nom, montant cible, date déblocage |
| Détail objectif | `app/savings/[id].tsx` | ⬜ | Solde, dépôt, timer |
| Paramètres | `app/(tabs)/settings.tsx` | ⬜ | Profil, déconnexion |

---

## Fonctionnalités

### ⚡ Wallet Lightning
| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Afficher solde en sats + BTC | ⬜ | |
| Afficher solde en devise locale (CFA, XOF) | ⬜ | Via API prix BTC |
| Générer invoice Lightning (QR code) | ⬜ | |
| Payer invoice bolt11 (scan QR) | ⬜ | |
| Payer via LNURL-pay | ⬜ | |
| Historique des transactions | ⬜ | |
| Notifications paiement reçu (Realtime) | ⬜ | |

### 🏦 Épargne Programmée
| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Créer un objectif avec wallet isolé | ⬜ | 1 objectif = 1 wallet LNbits |
| Dépôt vers un objectif | ⬜ | |
| Verrouillage temporel (unlock date) | ⬜ | Bloqué côté Edge Function |
| Afficher progression (% du montant cible) | ⬜ | |
| Débloquer et retirer après échéance | ⬜ | |

### 📵 Réception Hors-ligne (Cashu)
| Fonctionnalité | Statut | Notes |
|----------------|--------|-------|
| Générer un voucher Cashu (token eCash) | ⬜ | |
| Afficher voucher en QR code | ⬜ | |
| Partager voucher (texte) | ⬜ | |
| Racheter un voucher Cashu | ⬜ | |

---

## Tests

| Tâche | Statut | Notes |
|-------|--------|-------|
| Tests unitaires services (Jest) | ⬜ | |
| Tests composants (React Native Testing Library) | ⬜ | |
| Tests E2E paiement Lightning (Flash Sandbox) | ⬜ | |
| Tests Edge Functions Supabase | ⬜ | |
| Test flux complet : inscription → dépôt → épargne → retrait | ⬜ | |

---

## Déploiement

| Tâche | Statut | Notes |
|-------|--------|-------|
| Build preview Expo (`eas build --profile preview`) | ⬜ | |
| Déploiement Edge Functions (`supabase functions deploy`) | ⬜ | |
| APK de démo pour hackathon | ⬜ | |
| Vidéo démo (< 3 min) | ⬜ | |
| Pitch deck | ⬜ | |

---

## Notes de session

### 2026-06-30
- Initialisation du projet et de la documentation
- Définition de l'architecture complète (Supabase Edge Functions, LNbits isolé par objectif, Cashu hors-ligne)
- Choix tech validés : Expo SDK 52, NativeWind v4, Zustand, TanStack Query v5
- Coût infra : **0€** (Supabase free tier, LNbits public, Expo gratuit)
- Prochain focus : initialiser le projet Expo + configurer Supabase
