# Guide de déploiement Vercel - Backend API

## Problèmes résolus

### 1. ✅ Dépendances manquantes
Les dépendances `express` et `cors` ont été ajoutées au `api/package.json`.

### 2. Configuration Vercel

Le fichier `vercel.json` est correctement configuré :
- Build du frontend avec `@vercel/static-build`
- Build de l'API avec `@vercel/node`
- Routes configurées pour `/api/*` → `/api/index.js`

## Vérifications à faire sur Vercel

### 1. Variables d'environnement

Assurez-vous que toutes ces variables sont configurées dans Vercel (Settings → Environment Variables) :

- `MONGODB_URI` - URI de connexion MongoDB Atlas
- `REDIS_URL` - URL Redis (optionnel)
- `NODE_ENV` - `production`
- `REACT_APP_SUPABASE_URL` - URL Supabase
- `REACT_APP_SUPABASE_ANON_KEY` - Clé anonyme Supabase
- `REACT_APP_API_BASE_URL` - URL de l'API (optionnel)

### 2. MongoDB Atlas Network Access

MongoDB Atlas doit autoriser les connexions depuis Vercel :
1. Allez sur MongoDB Atlas → **Network Access**
2. Cliquez sur **Add IP Address**
3. Ajoutez `0.0.0.0/0` (autorise toutes les IPs) OU les IPs spécifiques de Vercel

### 3. Build Command

Vérifiez que le build command est correct dans Vercel :
- **Build Command** : `npm run build` (pour le frontend)
- **Output Directory** : `build`

### 4. Install Command

Vercel devrait automatiquement détecter et installer les dépendances dans :
- Racine du projet (`package.json`)
- Dossier `api/` (`api/package.json`)

## Test après déploiement

1. **Test de l'API** :
   ```
   https://votre-projet.vercel.app/api/test
   ```
   Devrait retourner :
   ```json
   {
     "message": "L'API fonctionne",
     "timestamp": "...",
     "mongoStatus": "connected"
   }
   ```

2. **Test des routes** :
   ```
   https://votre-projet.vercel.app/api/toys
   https://votre-projet.vercel.app/api/truthordare/random?type=truth&player=firstName1
   ```

## Problèmes courants

### L'API retourne 404
- Vérifiez que `vercel.json` est à la racine du projet
- Vérifiez que les routes dans `vercel.json` sont correctes
- Vérifiez les logs Vercel (Deployments → Functions → `/api/index.js`)

### Erreur de connexion MongoDB
- Vérifiez que `MONGODB_URI` est configurée sur Vercel
- Vérifiez que MongoDB Atlas autorise les connexions depuis Vercel
- Vérifiez les logs Vercel pour voir l'erreur exacte

### Erreur "Cannot find module"
- Vérifiez que toutes les dépendances sont dans `api/package.json`
- Vérifiez que `npm install` s'exécute correctement dans le dossier `api/`
- Vérifiez les logs de build Vercel

## Structure attendue

```
lovetogether-frontend/
├── api/
│   ├── index.js          # Point d'entrée de l'API
│   ├── package.json      # Dépendances de l'API
│   ├── routes/           # Routes de l'API
│   └── models/           # Modèles MongoDB
├── src/                  # Code source React
├── package.json          # Dépendances frontend
├── vercel.json           # Configuration Vercel
└── build/                # Build du frontend (généré)
```

## Commandes utiles

### Installation locale des dépendances API
```bash
cd api
npm install
```

### Test local de l'API
```bash
cd api
npm start
# L'API sera disponible sur http://localhost:1812
```

### Vérifier les logs Vercel
1. Allez sur Vercel Dashboard
2. Sélectionnez votre projet
3. Allez dans **Deployments**
4. Cliquez sur un déploiement
5. Allez dans **Functions** → `/api/index.js`
6. Regardez les logs pour voir les erreurs

