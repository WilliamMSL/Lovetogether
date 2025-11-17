const axios = require('axios');

const API_BASE_URL = 'http://localhost:1812';

// Test de l'API truthordare
async function testTruthOrDare() {
  console.log('🧪 Test de l\'API Truth or Dare...\n');

  const params = {
    type: 'dare',
    player: 'firstName1',
    toys: 'lush,all',
    intensity: 'medium'
  };

  try {
    console.log('📤 Requête:');
    console.log(`   URL: ${API_BASE_URL}/api/truthordare/random`);
    console.log(`   Params:`, params);
    console.log('\n');

    const response = await axios.get(`${API_BASE_URL}/api/truthordare/random`, {
      params,
      timeout: 5000
    });

    console.log('✅ Succès!');
    console.log('📥 Réponse:');
    console.log(JSON.stringify(response.data, null, 2));

  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Erreur: Le serveur n\'est pas démarré');
      console.error('   Assurez-vous que le serveur API tourne sur le port 1812');
      console.error('   Commande: cd api && node index.js');
    } else if (error.response) {
      console.error('❌ Erreur HTTP:', error.response.status);
      console.error('   Message:', error.response.data);
    } else {
      console.error('❌ Erreur:', error.message);
    }
    process.exit(1);
  }
}

// Test de la route de test
async function testHealthCheck() {
  console.log('🏥 Test de santé du serveur...\n');

  try {
    const response = await axios.get(`${API_BASE_URL}/api/test`, {
      timeout: 5000
    });

    console.log('✅ Serveur opérationnel!');
    console.log('📥 Réponse:', response.data);
    console.log('\n');

    return true;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Le serveur n\'est pas démarré');
      console.error('   Démarrez le serveur avec: cd api && node index.js');
    }
    return false;
  }
}

// Exécuter les tests
(async () => {
  console.log('🚀 Test de l\'API LoveTogether\n');
  console.log('='.repeat(50) + '\n');

  const isHealthy = await testHealthCheck();
  
  if (isHealthy) {
    await testTruthOrDare();
  } else {
    process.exit(1);
  }
})();

