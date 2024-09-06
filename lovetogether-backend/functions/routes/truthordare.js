const express = require('express');
const router = express.Router();
const TruthOrDare = require('../models/TruthOrDare');
const mongoose = require('mongoose');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

router.get('/random', async (req, res) => {
    const { type, player, toys, intensity } = req.query;
    const redisClient = req.app.get('redisClient');

    console.log('\n--- New Request ---');
    console.log('Request params:', { type, player, toys, intensity });

    try {
        const playerActionsKey = `recent_actions:${player}:${type}`;
        const sharedActionsKey = `recent_actions:shared:${type}`;
        
        console.log('Checking Redis keys:', { playerActionsKey, sharedActionsKey });
        let playerActionIds = await redisClient.sMembers(playerActionsKey);
        let sharedActionIds = await redisClient.sMembers(sharedActionsKey);
        console.log('Player action IDs:', playerActionIds);
        console.log('Shared action IDs:', sharedActionIds);
        
        const allRecentActionIds = [...new Set([...playerActionIds, ...sharedActionIds])];
        console.log('All recent action IDs:', allRecentActionIds);

        let query = { 
            type: type,
            $or: [
                { player: player },
                { player: 'all' },
                { player: { $in: [player, 'all'] } }
            ]
        };
        if (type === 'dare') {
            if (toys) query.toys = { $in: toys.split(',') };
            if (intensity) query.intensity = intensity;
        }
        console.log('Base query:', JSON.stringify(query));
        
        const pipeline = [
            { $match: query },
            { $addFields: { weight: { $rand: {} } } },
            { $sort: { weight: 1 } },
            { $limit: 50 }
        ];

        if (allRecentActionIds.length > 0) {
            pipeline.unshift({ $match: { _id: { $nin: allRecentActionIds.map(id => new mongoose.Types.ObjectId(id)) } } });
        }

        console.log('Aggregation pipeline:', JSON.stringify(pipeline));

        let results = await TruthOrDare.aggregate(pipeline);

        console.log(`Number of results returned: ${results.length}`);

        if (results.length === 0) {
            console.log('No results found. All actions/truths have been used recently. Resetting recent actions.');
            
            await redisClient.del(playerActionsKey);
            await redisClient.del(sharedActionsKey);
            
            pipeline.shift();
            
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
                weight: randomDocument.weight
            });
            
            try {
                const playerAddResult = await redisClient.sAdd(playerActionsKey, randomDocument._id.toString());
                console.log('Redis player sAdd result:', playerAddResult);
                
                if (randomDocument.player.includes('all') || randomDocument.player.length > 1) {
                    const sharedAddResult = await redisClient.sAdd(sharedActionsKey, randomDocument._id.toString());
                    console.log('Redis shared sAdd result:', sharedAddResult);
                }
                
                await redisClient.expire(playerActionsKey, 1800);
                await redisClient.expire(sharedActionsKey, 1800);

                console.log('Redis operations completed');
            } catch (redisError) {
                console.error('Redis operation failed:', redisError);
            }
            
            const response = {
                template: randomDocument.template,
                duration: randomDocument.duration || null,
                intensity: randomDocument.intensity || null
            };
            console.log('Sending response:', response);
            res.json(response);
        } else {
            console.log('No results found even after resetting recent actions. This should not happen unless the database is empty.');
            res.status(500).json({ message: 'Erreur inattendue: aucune action ou vérité disponible.' });
        }
    } catch (error) {
        console.error('Error in /random route:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;