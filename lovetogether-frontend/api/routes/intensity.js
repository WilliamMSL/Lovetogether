const express = require('express');
const router = express.Router();
const Toy = require('../models/Intensity');

// Récupérer tous les jouets
router.get('/', async (req, res) => {
    try {
        const toys = await Intensity.find();
        res.json(Intensity);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;