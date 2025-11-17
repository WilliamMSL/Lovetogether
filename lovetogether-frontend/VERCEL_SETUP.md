# Configuration MongoDB sur Vercel

## Problème résolu

Le code a été modifié pour utiliser une **connexion lazy** à MongoDB, ce qui est nécessaire pour les fonctions serverless de Vercel. Au lieu de se connecter au démarrage, la connexion se fait maintenant à la première requête.

## Configuration des variables d'environnement sur Vercel

Pour que MongoDB fonctionne sur Vercel, vous devez configurer les variables d'environnement suivantes dans votre projet Vercel :

### 1. Accéder aux paramètres Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Sélectionnez votre projet
3. Allez dans **Settings** → **Environment Variables**

### 2. Ajouter les variables d'environnement

Ajoutez les variables suivantes :

#### Obligatoire :
- **`MONGODB_URI`** : Votre chaîne de connexion MongoDB Atlas
  - Format : `mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority`
  - Vous pouvez la trouver dans MongoDB Atlas → Connect → Connect your application

#### Optionnel :
- **`REDIS_URL`** : URL de connexion Redis (si vous utilisez Redis)
- **`REACT_APP_API_BASE_URL`** : URL de base de votre API (pour le frontend)
  - En production sur Vercel, cela devrait être : `https://votre-domaine.vercel.app`
  - Ou laissez-le vide pour utiliser l'URL relative `/api`

### 3. Appliquer les variables à tous les environnements

Assurez-vous de sélectionner :
- ✅ **Production**
- ✅ **Preview** 
- ✅ **Development**

Puis cliquez sur **Save**.

### 4. Redéployer

Après avoir ajouté les variables d'environnement :
1. Allez dans **Deployments**
2. Cliquez sur les trois points (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**

Ou poussez un nouveau commit pour déclencher un nouveau déploiement.

## Vérification

Pour vérifier que MongoDB fonctionne :

1. Visitez : `https://votre-domaine.vercel.app/api/test`
2. Vous devriez voir une réponse JSON avec :
   ```json
   {
     "message": "L'API fonctionne",
     "timestamp": "...",
     "mongoStatus": "connected"
   }
   ```

## Notes importantes

- ⚠️ **Ne commitez jamais** votre `MONGODB_URI` dans le code ou dans Git
- ✅ Les variables d'environnement sont sécurisées sur Vercel
- ✅ La connexion MongoDB est maintenant lazy (se connecte à la demande)
- ✅ Compatible avec les fonctions serverless de Vercel

## Dépannage

Si MongoDB ne fonctionne toujours pas :

1. **Vérifiez les logs Vercel** :
   - Allez dans **Deployments** → Sélectionnez un déploiement → **Functions** → Cliquez sur `/api/index.js` → Voir les logs

2. **Vérifiez que MONGODB_URI est bien défini** :
   - Les logs devraient afficher : `MONGODB_URI est définie : true`

3. **Vérifiez votre MongoDB Atlas** :
   - Assurez-vous que votre IP est autorisée (ou utilisez `0.0.0.0/0` pour autoriser toutes les IPs)
   - Vérifiez que votre utilisateur MongoDB a les bonnes permissions

4. **Vérifiez le format de MONGODB_URI** :
   - Doit commencer par `mongodb+srv://`
   - Ne doit pas contenir d'espaces
   - Doit être correctement encodé (les caractères spéciaux dans le mot de passe doivent être encodés)

