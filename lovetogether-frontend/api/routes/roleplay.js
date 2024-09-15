const express = require('express');
const router = express.Router();
const Roleplay = require('../models/Roleplay');

// Créer un roleplay
router.post('/', async (req, res) => {
  const { title, description } = req.body;
  
  if (!title || !description) {
    return res.status(400).json({ message: 'Les champs "title" et "description" sont requis.' });
  }

  const roleplay = new Roleplay({ title, description });

  try {
    const savedRoleplay = await roleplay.save();
    res.status(201).json(savedRoleplay);
  } catch (err) {
    console.error('Error saving roleplay:', err);
    res.status(400).json({ message: 'Erreur lors de la sauvegarde du roleplay.', error: err.message });
  }
});

// Récupérer tous les roleplays
router.get('/', async (req, res) => {
  try {
    const roleplays = await Roleplay.find();
    res.json(roleplays);
  } catch (err) {
    console.error('Error fetching roleplays:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des roleplays.', error: err.message });
  }
});

// Récupérer un roleplay aléatoire
router.get('/random', async (req, res) => {
  try {
    const count = await Roleplay.countDocuments();
    const random = Math.floor(Math.random() * count);
    const roleplay = await Roleplay.findOne().skip(random);
    
    if (!roleplay) {
      return res.status(404).json({ message: 'Aucun roleplay trouvé.' });
    }
    
    res.json(roleplay);
  } catch (err) {
    console.error('Error fetching random roleplay:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération du roleplay aléatoire.', error: err.message });
  }
});

// Mettre à jour un roleplay
router.put('/:id', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: 'Les champs "title" et "description" sont requis.' });
  }

  try {
    const roleplay = await Roleplay.findByIdAndUpdate(
      req.params.id,
      { title, description },
      { new: true, runValidators: true }
    );

    if (!roleplay) {
      return res.status(404).json({ message: 'Roleplay non trouvé.' });
    }

    res.json(roleplay);
  } catch (err) {
    console.error('Error updating roleplay:', err);
    res.status(400).json({ message: 'Erreur lors de la mise à jour du roleplay.', error: err.message });
  }
});

// Supprimer un roleplay
router.delete('/:id', async (req, res) => {
  try {
    const roleplay = await Roleplay.findByIdAndDelete(req.params.id);
    if (!roleplay) {
      return res.status(404).json({ message: 'Roleplay non trouvé.' });
    }
    res.json({ message: 'Roleplay supprimé avec succès.' });
  } catch (err) {
    console.error('Error deleting roleplay:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression du roleplay.', error: err.message });
  }
});

module.exports = router;