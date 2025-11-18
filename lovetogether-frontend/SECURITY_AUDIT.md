# Audit de sécurité - Variables d'environnement

## ⚠️ PROBLÈME CRITIQUE DÉTECTÉ

Des fichiers `.env` contenant des secrets en clair ont été trouvés dans le dépôt.

### Fichiers concernés :
- ✅ `api/.env` - **NON tracké par Git** (bon)
- ❌ `api/.env.backup` - **ÉTAIT tracké par Git** (retiré)

### Secrets exposés dans `api/.env.backup` :
- **Supabase URL** : `https://wgkzsdqbvzhvacqwnijr.supabase.co`
- **Supabase Anon Key** : JWT token complet
- **MongoDB URI** : Contient le mot de passe `RoLVxx6brmkRfpHu`
- **Redis URL** : `redis://localhost:6379`

## ✅ Actions correctives effectuées

1. **Mise à jour du `.gitignore`** :
   - Ajout de `api/.env`
   - Ajout de `api/.env.backup`
   - Ajout de `api/.env.*` (pour tous les variants)

2. **Retrait du fichier du tracking Git** :
   - `api/.env.backup` a été retiré du tracking Git avec `git rm --cached`

## 🔒 Actions à faire IMMÉDIATEMENT

### 1. Changer les secrets exposés

Si `api/.env.backup` a été commité et poussé sur GitHub/GitLab :
- **Changez le mot de passe MongoDB** dans MongoDB Atlas
- **Régénérez la clé Supabase** dans le dashboard Supabase
- **Changez les credentials Redis** si nécessaire

### 2. Vérifier l'historique Git

```bash
# Vérifier si les secrets sont dans l'historique Git
git log --all --full-history -- api/.env.backup

# Si oui, considérez utiliser git-filter-repo pour nettoyer l'historique
# OU créez un nouveau dépôt et migrez le code sans les secrets
```

### 3. S'assurer que les fichiers sont bien ignorés

```bash
# Vérifier que les fichiers .env sont bien ignorés
git status --ignored | grep .env
```

### 4. Configurer les variables sur Vercel

Assurez-vous que toutes les variables d'environnement sont configurées sur Vercel :
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `MONGODB_URI`
- `REDIS_URL` (si nécessaire)
- `PORT`
- `NODE_ENV`

## 📋 Variables d'environnement nécessaires

### Frontend (React)
- `REACT_APP_SUPABASE_URL` - URL de votre projet Supabase
- `REACT_APP_SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `REACT_APP_API_BASE_URL` - URL de l'API (optionnel, défaut: `http://localhost:1812`)

### Backend (API)
- `MONGODB_URI` - URI de connexion MongoDB Atlas
- `REDIS_URL` - URL de connexion Redis (optionnel)
- `PORT` - Port du serveur (optionnel, défaut: `1812`)
- `NODE_ENV` - Environnement (`development` ou `production`)

## ✅ Bonnes pratiques appliquées

1. ✅ Variables d'environnement utilisées via `process.env`
2. ✅ Pas de valeurs hardcodées dans le code
3. ✅ `.gitignore` mis à jour pour exclure les fichiers `.env`
4. ✅ Fichiers `.env` retirés du tracking Git

## ⚠️ À ne JAMAIS faire

- ❌ Commiter des fichiers `.env` ou `.env.backup`
- ❌ Hardcoder des secrets dans le code
- ❌ Partager des secrets dans les messages/emails
- ❌ Exposer des secrets dans les logs (déjà corrigé)

