# Configuration Redis pour Vercel

## URL Redis fournie

```
redis://default:uBEueB8OqWalvoFyzFspeEVUeMfTFaqx@redis-11084.c11.us-east-1-3.ec2.redns.redis-cloud.com:11084
```

## Configuration sur Vercel

### 1. Ajouter la variable d'environnement

1. Allez sur **Vercel Dashboard** → Votre projet → **Settings** → **Environment Variables**
2. Cliquez sur **Add New**
3. Ajoutez :
   - **Key** : `REDIS_URL`
   - **Value** : `redis://default:uBEueB8OqWalvoFyzFspeEVUeMfTFaqx@redis-11084.c11.us-east-1-3.ec2.redns.redis-cloud.com:11084`
   - **Environment** : Sélectionnez **Production**, **Preview**, et **Development**
4. Cliquez sur **Save**

### 2. Redéployer l'application

Après avoir ajouté la variable d'environnement :
1. Allez dans **Deployments**
2. Cliquez sur les trois points (⋯) du dernier déploiement
3. Sélectionnez **Redeploy**

## Vérification

Après le redéploiement, vérifiez les logs Vercel :
1. Allez dans **Deployments** → Dernier déploiement
2. Cliquez sur **Functions** → `/api/index.js`
3. Regardez les logs pour voir :
   - `Initialisation du client Redis...`
   - `Connecté avec succès à Redis` (si ça fonctionne)
   - Ou `Erreur lors de la connexion à Redis` (si ça ne fonctionne pas)

## Test

Testez une route qui utilise Redis :
```
https://lovetogether3.vercel.app/api/truthordare/random?type=truth&player=firstName1
```

Si Redis fonctionne, vous verrez dans les logs :
- `Redis available: true`
- `Redis keys retrieved: ...`

## Notes importantes

⚠️ **Sécurité** : Cette URL contient un mot de passe. Ne la partagez pas publiquement et ne la commitez pas dans Git.

✅ **Fonctionnement** : Même si Redis ne fonctionne pas, l'API continuera de fonctionner. Redis est utilisé uniquement pour éviter les répétitions dans `/api/truthordare/random`.

## Problèmes possibles

### Redis ne se connecte pas
- Vérifiez que l'URL est correcte (copiez-collez exactement)
- Vérifiez que Redis Cloud autorise les connexions depuis Vercel (whitelist IP)
- Vérifiez les logs Vercel pour voir l'erreur exacte

### Timeout Redis
- Le code a maintenant un timeout de 2 secondes pour Redis
- Si Redis prend plus de 2 secondes à répondre, il sera ignoré et l'API continuera sans Redis

