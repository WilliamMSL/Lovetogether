const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Créer un utilisateur
router.post('/', async (req, res) => {
    const { firstName, lastName, gender, toys } = req.body;
    const user = new User({ firstName, lastName, gender, toys });
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Récupérer tous les utilisateurs
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;