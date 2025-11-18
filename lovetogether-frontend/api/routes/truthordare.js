const express = require('express');
const router = express.Router();
const TruthOrDare = require('../models/TruthOrDare');
const mongoose = require('mongoose');

// Fonction pour mélanger un tableau
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Route GET /random
router.get('/random', async (req, res) => {
  console.log('\n--- New Request to /random ---');
  console.log('Request headers:', req.headers);
  
  const { type, player, toys, intensity } = req.query;
  const redisClient = req.redisClient || req.app.get('redisClient'); // Peut être null si Redis n'est pas configuré

  console.log('Request params:', { type, player, toys, intensity });

  // Validation des entrées
  if (!type || !player) {
    console.log('Bad request: Missing type or player');
    return res.status(400).json({ message: 'Type et player sont requis' });
  }

  try {
    console.log('MongoDB connection state:', mongoose.connection.readyState);

    const playerActionsKey = `recent_actions:${player}:${type}`;
    const sharedActionsKey = `recent_actions:shared:${type}`;

    console.log('Redis available:', !!redisClient);

    let playerActionIds = [];
    let sharedActionIds = [];
    
    // Essayer de récupérer depuis Redis si disponible
    if (redisClient) {
      try {
        playerActionIds = await redisClient.sMembers(playerActionsKey) || [];
        sharedActionIds = await redisClient.sMembers(sharedActionsKey) || [];
        console.log('Redis keys retrieved:', { playerActionsKey, sharedActionsKey, playerActionIds, sharedActionIds });
      } catch (redisError) {
        console.warn('Error fetching from Redis (continuing without Redis):', redisError.message);
        // Continue sans Redis
      }
    } else {
      console.log('Redis not available, continuing without recent actions tracking');
    }

    console.log('Player action IDs:', playerActionIds);
    console.log('Shared action IDs:', sharedActionIds);

    const allRecentActionIds = [...new Set([...playerActionIds, ...sharedActionIds])];
    console.log('All recent action IDs:', allRecentActionIds);

    // Construire la requête de base
    let query = {
      type: type,
      $or: [
        { player: player },
        { player: 'all' }
      ]
    };

    if (type === 'dare') {
      if (toys) {
        const toyArray = toys.split(',');
        query.toys = { $in: [...toyArray, 'all'] };
      }
      if (intensity) {
        // intensity est un tableau dans le schéma, donc on cherche dans le tableau
        query.intensity = { $in: [intensity] };
      }
    }
    
    console.log('Base query:', JSON.stringify(query, null, 2));
    
    // Vérifier combien de documents correspondent à la requête de base
    const countBeforeFilter = await TruthOrDare.countDocuments(query);
    console.log(`Total documents matching base query: ${countBeforeFilter}`);
    
    // Vérifier le total de documents dans la collection
    const totalCount = await TruthOrDare.countDocuments({ type: type });
    console.log(`Total documents of type '${type}' in collection: ${totalCount}`);

    const pipeline = [
      { $match: query },
      { $sample: { size: 50 } }
    ];

    // Gestion des ID MongoDB et du pipeline d'agrégation
    try {
      if (allRecentActionIds.length > 0) {
        pipeline.unshift({ $match: { _id: { $nin: allRecentActionIds.map(id => new mongoose.Types.ObjectId(id)) } } });
      }
    } catch (idError) {
      console.error('Error converting IDs:', idError);
      return res.status(400).json({ message: 'Invalid IDs provided.' });
    }

    console.log('Aggregation pipeline:', JSON.stringify(pipeline));

    // Exécution de la requête MongoDB
    try {
      console.log('Executing MongoDB aggregate pipeline...');
      let results = await TruthOrDare.aggregate(pipeline);
      console.log('MongoDB aggregate pipeline executed successfully.');

      console.log(`Number of results returned: ${results.length}`);

      if (results.length === 0) {
        console.log('No results found. All actions/truths have been used recently. Resetting recent actions.');
        
        // Réinitialiser Redis si disponible
        if (redisClient) {
          try {
            await redisClient.del(playerActionsKey);
            await redisClient.del(sharedActionsKey);
            console.log('Redis keys cleared');
          } catch (redisError) {
            console.warn('Error clearing Redis keys:', redisError.message);
          }
        }
        
        // Supprimer le match basé sur les actions récentes si présent
        if (pipeline[0] && pipeline[0].$match && pipeline[0].$match._id) {
          pipeline.shift();
        }
        
        console.log('Retrying query without recent actions filter...');
        console.log('Pipeline after reset:', JSON.stringify(pipeline));
        
        results = await TruthOrDare.aggregate(pipeline);
        console.log(`Number of results after resetting recent actions: ${results.length}`);
      }

      if (results.length > 0) {
        results = shuffleArray(results);
        console.log('Results shuffled');

        const randomDocument = results[0];
        console.log('Selected document:', {
          id: randomDocument._id,
          template: randomDocument.template.substring(0, 30) + '...',
          player: randomDocument.player,
          toys: randomDocument.toys,
          intensity: randomDocument.intensity
        });

        try {
          // Ajouter dans Redis si disponible
          if (redisClient) {
            await redisClient.sAdd(playerActionsKey, randomDocument._id.toString());
            
            if (randomDocument.player === 'all' || (Array.isArray(randomDocument.player) && randomDocument.player.includes('all'))) {
              await redisClient.sAdd(sharedActionsKey, randomDocument._id.toString());
            }

            await redisClient.expire(playerActionsKey, 1800);
            await redisClient.expire(sharedActionsKey, 1800);

            console.log('Redis operations completed');
          }
        } catch (redisError) {
          console.warn('Redis operation failed (continuing anyway):', redisError.message);
          // Continue même si Redis échoue
        }

        const response = {
          template: randomDocument.template,
          duration: randomDocument.duration || null,
          intensity: randomDocument.intensity || null,
          toys: randomDocument.toys || []
        };
        console.log('Sending response:', response);
        res.json(response);
      } else {
        console.log('No results found even after resetting recent actions.');
        console.log('Query used:', JSON.stringify(query, null, 2));
        console.log('Pipeline used:', JSON.stringify(pipeline, null, 2));
        
        // Vérifier si le problème vient des critères de recherche
        const simpleQuery = { type: type };
        const simpleCount = await TruthOrDare.countDocuments(simpleQuery);
        
        let errorMessage = 'Aucune action ou vérité disponible.';
        if (simpleCount === 0) {
          errorMessage += ` Aucun document de type '${type}' trouvé dans la base de données.`;
        } else {
          errorMessage += ` Il y a ${simpleCount} document(s) de type '${type}', mais aucun ne correspond aux critères (player: ${player}, toys: ${toys || 'any'}, intensity: ${intensity || 'any'}).`;
        }
        
        res.status(404).json({ 
          message: errorMessage,
          debug: {
            query: query,
            totalOfType: simpleCount,
            matchingQuery: countBeforeFilter
          }
        });
      }
    } catch (mongoError) {
      console.error('Error fetching from MongoDB:', mongoError);
      return res.status(500).json({ message: 'Erreur MongoDB', error: mongoError.message });
    }

  } catch (error) {
    console.error('Error in /random route:', error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message, stack: error.stack });
  }
});

module.exports = router;
