const express = require('express');
const Roleplay = require('../models/Roleplay');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
      console.log('Fetching roleplay data...');
      const roleplays = await Roleplay.find();
      console.log('Roleplays fetched:', roleplays);
      res.json(roleplays);
    } catch (err) {
      console.error('Error fetching roleplays:', err);
      res.status(500).json({ message: err.message });
    }
  });

  // Ajoutez ce code dans votre fichier de routes pour roleplay

// Récupérer un roleplay aléatoire
router.get('/random', async (req, res) => {
    try {
        const count = await Roleplay.countDocuments();
        const randomIndex = Math.floor(Math.random() * count);
        const randomRoleplay = await Roleplay.findOne().skip(randomIndex);
        res.json(randomRoleplay);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;

