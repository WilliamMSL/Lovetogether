# Guide pour tester l'API LoveTogether

## 1. Démarrer le serveur API

```bash
cd api
npm install  # Si ce n'est pas déjà fait
npm start
```

Ou si vous avez un script spécifique :

```bash
cd api
node index.js
```

Le serveur devrait démarrer sur `http://localhost:1812`

## 2. Tester l'API

### Méthode 1 : Navigateur
Ouvrez directement dans votre navigateur :
```
http://localhost:1812/api/truthordare/random?type=dare&player=firstName1&toys=lush,all&intensity=medium
```

### Méthode 2 : curl (Terminal)
```bash
curl "http://localhost:1812/api/truthordare/random?type=dare&player=firstName1&toys=lush,all&intensity=medium"
```

### Méthode 3 : curl avec formatage JSON
```bash
curl "http://localhost:1812/api/truthordare/random?type=dare&player=firstName1&toys=lush,all&intensity=medium" | jq
```

### Méthode 4 : Script Node.js
```javascript
const axios = require('axios');

const testAPI = async () => {
  try {
    const response = await axios.get('http://localhost:1812/api/truthordare/random', {
      params: {
        type: 'dare',
        player: 'firstName1',
        toys: 'lush,all',
        intensity: 'medium'
      }
    });
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

testAPI();
```

### Méthode 5 : Postman / Insomnia
- Méthode: GET
- URL: `http://localhost:1812/api/truthordare/random`
- Query params:
  - type: dare
  - player: firstName1
  - toys: lush,all
  - intensity: medium

## 3. Vérifier que le serveur fonctionne

Testez d'abord la route de test :
```bash
curl http://localhost:1812/api/test
```

Vous devriez recevoir :
```json
{
  "message": "L'API fonctionne",
  "timestamp": "2024-..."
}
```

## 4. Autres endpoints disponibles

- `/api/toys` - Liste des jouets
- `/api/users` - Gestion des utilisateurs
- `/api/roleplay` - Roleplay
- `/api/truthordare/random` - Vérité ou Action aléatoire

