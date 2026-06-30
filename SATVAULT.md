# SatVault — Documentation Technique du Projet

> Application mobile de transfert et d'épargne programmée en Bitcoin pour l'Afrique de l'Ouest

---

## Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Problèmes résolus](#2-problèmes-résolus)
3. [Fonctionnalités](#3-fonctionnalités)
4. [Architecture globale](#4-architecture-globale)
5. [Stack technique complète](#5-stack-technique-complète)
6. [Services externes](#6-services-externes)
7. [Structure des écrans](#7-structure-des-écrans)
8. [Modèle de données](#8-modèle-de-données)
9. [Déploiement](#9-déploiement)

---

## 1. Vue d'ensemble

**SatVault** est une application mobile (iOS & Android) construite sur le **Lightning Network** qui permet à des utilisateurs en Afrique de l'Ouest de :

- **Envoyer et recevoir des sats** instantanément via Lightning
- **Épargner en Bitcoin** avec des objectifs bloqués dans le temps
- **Convertir** entre Bitcoin et XOF (Franc CFA) via Flash Sandbox
- **Recevoir des paiements hors-ligne** via des vouchers Cashu (eCash)

Chaque utilisateur dispose d'**un seul wallet LNbits** qui sert de base aux deux usages (transferts + épargne). Les objectifs d'épargne sont des wallets secondaires isolés, inaccessibles avant la date choisie.

---

## 2. Problèmes résolus

| Problème | Solution SatVault |
|---|---|
| Transferts traditionnels chers et lents | Lightning Network — instantané, frais quasi nuls |
| Difficulté à épargner (argent trop accessible) | Épargne bloquée à objectif — fonds inaccessibles jusqu'à la date choisie |
| Dépréciation de l'épargne en FCFA | Épargne en Bitcoin — réserve de valeur alternative |
| Connectivité internet instable | Réception hors-ligne via vouchers Cashu (eCash) |

---

## 3. Fonctionnalités

### 3.1 Wallet Principal
- Affichage du solde en **sats** et en **XOF** (conversion temps réel via Flash)
- Envoi de sats via invoice Lightning (bolt11)
- Réception via QR code généré automatiquement
- Historique des transactions

### 3.2 Transferts
- Envoi vers une **adresse Lightning** ou **adresse LNURL** (`prenom@satvault.app`)
- Scanner de QR code pour les invoices
- Mémo facultatif sur chaque transfert
- Confirmation biométrique (Face ID / empreinte) avant envoi

### 3.3 Épargne Programmée
- Création d'un **objectif d'épargne** (nom, emoji, montant cible en sats, date de déblocage)
- Chaque objectif = un wallet LNbits secondaire isolé
- Dépôt progressif vers l'objectif
- Barre de progression visuelle
- Fonds **strictement inaccessibles** avant la date de déblocage
- Notification automatique quand un objectif est débloqué (Supabase Realtime)

**Mécanisme de blocage :** Le retrait d'un objectif passe obligatoirement par une Edge Function qui vérifie `locked_until <= now()` avant d'autoriser le transfert vers le wallet principal. Si la date n'est pas atteinte, l'Edge Function retourne une erreur **403 Forbidden** — les fonds restent dans le wallet LNbits secondaire sans aucune possibilité de contournement côté mobile.

### 3.4 Réception Hors-ligne (Cashu)
- Génération de **vouchers eCash** (tokens Cashu) depuis le wallet principal
- Voucher affiché en QR code — transmissible sans connexion internet
- Rachat du voucher par le destinataire quand il est de retour en ligne
- Idéal pour les zones à connectivité instable

---

## 4. Architecture globale

```
┌──────────────────────────────────────┐
│         APPLICATION MOBILE           │
│       React Native + Expo            │
│         (iOS & Android)              │
└──────────────┬───────────────────────┘
               │ HTTPS
┌──────────────▼───────────────────────┐
│             SUPABASE                 │
│  PostgreSQL · Auth · Edge Functions  │
│         · Realtime                   │
└──────┬───────────────────────────────┘
       │
┌──────▼───────────────────────────────┐
│          SERVICES EXTERNES           │
│   LNbits · Flash Sandbox · Cashu     │
└──────────────────────────────────────┘
```

**Pas de backend Node.js/Express séparé.** Toute la logique métier vit dans les **Supabase Edge Functions** (TypeScript). Supabase remplace Railway + Express + node-cron.

---

## 5. Stack technique complète

### 5.1 Application Mobile

| Rôle | Technologie | Version |
|---|---|---|
| Framework | **React Native** | 0.76+ |
| Outillage mobile | **Expo** (SDK 52) | — |
| Langage | **TypeScript** | 5.x |
| Navigation | **Expo Router** | v4 |
| UI — styles | **NativeWind** (Tailwind pour RN) | v4 |
| UI — composants | **React Native Paper** | v5 |
| Animations | **React Native Reanimated** | v3 |

### 5.2 Gestion d'état et données

| Rôle | Technologie |
|---|---|
| État global (client) | **Zustand** |
| Requêtes API & cache | **TanStack Query** (React Query v5) |
| Client HTTP | **Axios** |

### 5.3 Stockage local

| Rôle | Technologie | Usage |
|---|---|---|
| Données sensibles | **Expo SecureStore** | Token JWT, clé API LNbits |
| Données non sensibles | **AsyncStorage** | Préférences, cache offline |

### 5.4 Fonctionnalités natives Expo

| Fonctionnalité | Package |
|---|---|
| Scanner QR code (invoices + vouchers) | `expo-camera` |
| Génération QR code | `react-native-qrcode-svg` |
| Authentification biométrique | `expo-local-authentication` |
| Notifications push | `expo-notifications` |
| Retour haptique | `expo-haptics` |

### 5.5 Backend — Supabase

| Rôle | Supabase Feature |
|---|---|
| Base de données | **PostgreSQL** (hébergé Supabase) |
| Authentification (JWT) | **Supabase Auth** |
| Logique métier API | **Edge Functions** (TypeScript / Deno) |
| Notifications temps réel | **Supabase Realtime** |

Supabase remplace intégralement un backend Express + Railway + node-cron.

### 5.6 Flux d'authentification

```
Inscription
  1. L'utilisateur soumet email + mot de passe
  2. Supabase Auth crée le compte → retourne un JWT
  3. Une Edge Function est déclenchée (trigger post-inscription)
  4. L'Edge Function appelle LNbits → crée un wallet principal
  5. La clé API LNbits est chiffrée et stockée dans Supabase Vault
  6. La référence Vault + wallet_id sont sauvegardés dans la table users
  7. L'utilisateur est connecté — JWT Supabase utilisé pour toutes les requêtes

Connexion
  1. Supabase Auth vérifie email + mot de passe
  2. Retourne un JWT valide
  3. Le JWT est stocké dans Expo SecureStore sur l'appareil
```

---

## 6. Services externes

### 6.1 LNbits — Wallets Lightning

- **Rôle :** Création et gestion des wallets Bitcoin Lightning
- **URL :** `https://legend.lnbits.com`
- **Usage :**
  - Un wallet principal par utilisateur (créé à l'inscription)
  - Un wallet secondaire par objectif d'épargne
  - Génération d'invoices bolt11 pour recevoir des sats
  - Paiement d'invoices pour envoyer des sats
  - Transferts internes entre wallet principal et wallets d'épargne

```
Utilisateur
  └── Wallet Principal (LNbits)
        ├── Objectif "Voyage" (wallet LNbits isolé)
        ├── Objectif "Téléphone" (wallet LNbits isolé)
        └── Objectif "Urgence" (wallet LNbits isolé)
```

### 6.2 Flash Sandbox — Conversion XOF ↔ BTC

- **Rôle :** Taux de change Bitcoin / Franc CFA en temps réel
- **Usage :**
  - Affichage du solde en XOF
  - Saisie d'un montant en XOF lors d'un transfert (converti en sats)
  - Estimation de la valeur d'un objectif d'épargne en XOF

### 6.3 Cashu — Réception hors-ligne

- **Package :** `@cashu/cashu-ts`
- **Rôle :** Génération et rachat de vouchers eCash
- **Usage :**
  - L'expéditeur génère un voucher depuis son wallet principal
  - Le voucher est encodé en QR code (ou texte)
  - Le destinataire scanne le QR code et rachète le voucher quand il est en ligne
  - Aucune connexion internet requise pour transmettre le voucher

### 6.4 LNURL — Adresses lisibles

- **Rôle :** Adresses de paiement humainement lisibles
- **Format :** `prenom@satvault.app`
- **Avantage UX :** Remplace les longues invoices bolt11 pour les paiements fréquents entre utilisateurs SatVault

---

## 7. Structure des écrans

```
app/
├── (auth)/
│   ├── login.tsx           → Connexion (email + mot de passe)
│   └── register.tsx        → Inscription + création wallet LNbits
│
├── (tabs)/
│   ├── dashboard.tsx       → Solde (sats + XOF), résumé activité
│   ├── transfer.tsx        → Envoyer / Recevoir (QR, invoice, LNURL)
│   ├── savings.tsx         → Liste des objectifs d'épargne
│   └── cashu.tsx           → Générer / Racheter un voucher hors-ligne
│
├── savings/
│   ├── new.tsx             → Créer un objectif (nom, montant, date)
│   └── [id].tsx            → Détail d'un objectif (progression, dépôt)
│
└── _layout.tsx             → Layout racine (auth guard, providers)
```

---

## 8. Modèle de données

### Table `users`
```
id                UUID (PK)
email             TEXT UNIQUE
name              TEXT
phone             TEXT
lnbits_wallet_id  TEXT       ← ID du wallet principal LNbits
lnbits_vault_key  TEXT       ← Référence Supabase Vault (jamais la clé en clair)
lnurl_address     TEXT       ← prenom@satvault.app
created_at        TIMESTAMP
```

### Table `savings`
```
id                    UUID (PK)
user_id               UUID (FK → users)
name                  TEXT       ← Nom de l'objectif
emoji                 TEXT       ← Icône (ex: ✈️)
target_amount_sats    INT        ← Montant cible en sats
current_amount_sats   INT        ← Montant accumulé
locked_until          TIMESTAMP  ← Date de déblocage
lnbits_wallet_id      TEXT       ← Wallet LNbits isolé pour cet objectif
lnbits_vault_key      TEXT       ← Référence Supabase Vault (jamais la clé en clair)
status                ENUM       ← ACTIVE | UNLOCKED | COMPLETED
created_at            TIMESTAMP
```

> **Sécurité — clés API LNbits :** Les clés API LNbits ne sont **jamais stockées en clair** en base de données. Elles sont chiffrées avec **AES-256 via Supabase Vault** (coffre-fort chiffré intégré à Supabase). Seule une référence opaque (`vault_key`) est stockée dans PostgreSQL. La clé réelle est déchiffrée à la demande, uniquement dans l'Edge Function, au moment de l'appel à LNbits.

### Table `transactions`
```
id            UUID (PK)
user_id       UUID (FK → users)
type          ENUM        ← SEND | RECEIVE | DEPOSIT_SAVING | CASHU_OUT | CASHU_IN
amount_sats   INT
memo          TEXT
bolt11        TEXT
status        ENUM        ← PENDING | COMPLETED | FAILED
created_at    TIMESTAMP
```

---

## 9. Déploiement

| Composant | Plateforme | Coût |
|---|---|---|
| App mobile (test & démo jury) | **Expo Go** — scan QR, app instantanée | Gratuit |
| App mobile (build APK final) | **EAS Build** (Expo) — build cloud | Gratuit |
| Base de données PostgreSQL | **Supabase** | Gratuit |
| Auth + Edge Functions + Realtime | **Supabase** | Gratuit |
| Wallets Lightning | **LNbits** (`legend.lnbits.com`) | Gratuit |
| Conversion XOF | **Flash Sandbox** | Gratuit |

> **Coût total infrastructure : 0 €** — Stack entièrement gratuite pour le hackathon.

---

*Document généré pour le hackathon SatVault — 2026*
