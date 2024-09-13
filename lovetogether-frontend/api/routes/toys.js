const express = require('express');
const router = express.Router();
const Toy = require('../models/Toys');

// Créer un jouet
router.post('/', async (req, res) => {
    const { name, name_id } = req.body;  // Assurez-vous que `name_id` est fourni
    const toy = new Toy({ name, name_id });
    try {
        const savedToy = await toy.save();
        res.status(201).json(savedToy);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Récupérer tous les jouets
router.get('/', async (req, res) => {
    try {
        const toys = await Toy.find();
        res.json(toys);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Récupérer un jouet spécifique par `name_id`
router.get('/:name_id', async (req, res) => {
    try {
        const toy = await Toy.findOne({ name_id: req.params.name_id }); // Recherche par `name_id`
        if (!toy) {
            return res.status(404).json({ message: 'Toy not found' });
        }
        res.json(toy);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
