# Migration vers Supabase

## 🎯 Vue d'ensemble

Cette migration remplace l'ancienne architecture **Express + MongoDB + Redis** par **Supabase** (PostgreSQL + API REST).

## ✅ Avantages

- **Moins d'infrastructure** : Plus besoin de maintenir un serveur API séparé
- **Base de données unifiée** : PostgreSQL avec Supabase
- **Temps réel** : Subscriptions possibles si besoin
- **Authentification** : Prête à l'emploi (déjà configurée)
- **Moins de coûts** : Un seul service au lieu de 3 (Vercel API + MongoDB Atlas + Redis)

## 📁 Structure

```
supabase/
├── schema.sql              # Schéma de la base de données
├── migrate-from-mongodb.js # Script de migration des données
└── README.md               # Ce fichier

src/lib/
├── supabase.js             # Client Supabase (existant)
└── supabaseService.js      # Fonctions d'accès aux données
```

## 🚀 Installation

### 1. Créer les tables dans Supabase

1. Aller dans le [Dashboard Supabase](https://supabase.com/dashboard)
2. Ouvrir le **SQL Editor**
3. Copier-coller le contenu de `schema.sql`
4. Exécuter

### 2. Migrer les données (optionnel)

Si tu as des données existantes dans MongoDB :

```bash
# Ajouter la clé service Supabase à ton .env
# (Trouvable dans Settings > API > service_role key)
echo "SUPABASE_SERVICE_KEY=your-service-key" >> api/.env

# Exécuter la migration
cd lovetogether-frontend
node supabase/migrate-from-mongodb.js
```

### 3. Variables d'environnement

Assure-toi que ces variables sont définies :

```env
REACT_APP_SUPABASE_URL=https://xxxxx.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJ...
```

## 📊 Schéma des tables

### `toys`
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| name | TEXT | Nom du jouet |
| name_id | TEXT | Identifiant unique |
| category | TEXT | Catégorie |

### `roleplays`
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| title | TEXT | Titre |
| description | TEXT | Description |

### `truth_or_dare`
| Colonne | Type | Description |
|---------|------|-------------|
| id | UUID | Clé primaire |
| template | TEXT | Texte du défi/vérité |
| duration | INTEGER | Durée en secondes |
| intensity | TEXT[] | Niveaux d'intensité |
| type | TEXT | 'truth' ou 'dare' |
| player | TEXT | Joueur cible |
| toys | TEXT[] | Jouets requis |

## 🔧 Utilisation dans le code

```javascript
import { 
  fetchToys,
  fetchRandomRoleplay,
  fetchRandomTruthOrDare,
  createTruthOrDare
} from '../lib/supabaseService';

// Récupérer les jouets
const toys = await fetchToys();

// Récupérer un roleplay aléatoire
const roleplay = await fetchRandomRoleplay();

// Récupérer un truth or dare aléatoire
const result = await fetchRandomTruthOrDare({
  type: 'dare',
  player: 'firstName1',
  toys: ['lush', 'all'],
  intensity: 'medium'
});

// Créer un nouveau truth or dare
await createTruthOrDare({
  template: 'Tu dois...',
  type: 'dare',
  player: 'all',
  intensity: 'Warm-Up',
  toys: []
});
```

## 🗑️ Nettoyage (optionnel)

Une fois la migration validée, tu peux supprimer :

- Le dossier `api/` (ancien serveur Express)
- Les références à `API_BASE_URL` dans le code
- Les dépendances MongoDB/Redis du `package.json` racine

## 🔄 Gestion des répétitions

L'ancien système utilisait Redis pour éviter les répétitions. Le nouveau système utilise **localStorage** :

- Les actions récentes sont stockées pendant 30 minutes
- Chaque joueur a son propre historique
- Les actions "all" sont partagées entre tous les joueurs
- Si toutes les actions sont épuisées, l'historique se réinitialise automatiquement
