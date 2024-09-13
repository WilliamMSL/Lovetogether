const express = require('express');
const router = express.Router();
const Toy = require('../models/Toys');

// Créer un jouet
router.post('/', async (req, res) => {
  const { name, name_id } = req.body;  // Assurez-vous que `name_id` est fourni
  
  // Vérification des champs requis
  if (!name || !name_id) {
    return res.status(400).json({ message: 'Les champs "name" et "name_id" sont requis.' });
  }

  const toy = new Toy({ name, name_id });

  try {
    const savedToy = await toy.save();
    res.status(201).json(savedToy);
  } catch (err) {
    console.error('Error saving toy:', err);
    res.status(400).json({ message: 'Erreur lors de la sauvegarde du jouet.', error: err.message });
  }
});

// Récupérer tous les jouets
router.get('/', async (req, res) => {
  try {
    const toys = await Toy.find();
    res.json(toys);
  } catch (err) {
    console.error('Error fetching toys:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération des jouets.', error: err.message });
  }
});

// Récupérer un jouet spécifique par `name_id`
router.get('/:name_id', async (req, res) => {
  try {
    const toy = await Toy.findOne({ name_id: req.params.name_id }); // Recherche par `name_id`
    if (!toy) {
      return res.status(404).json({ message: 'Jouet non trouvé.' });
    }
    res.json(toy);
  } catch (err) {
    console.error('Error fetching toy by name_id:', err);
    res.status(500).json({ message: 'Erreur lors de la récupération du jouet.', error: err.message });
  }
});

// Mettre à jour un jouet par `name_id`
router.put('/:name_id', async (req, res) => {
  const { name, name_id } = req.body;

  // Vérification des champs requis
  if (!name || !name_id) {
    return res.status(400).json({ message: 'Les champs "name" et "name_id" sont requis.' });
  }

  try {
    const toy = await Toy.findOneAndUpdate(
      { name_id: req.params.name_id },
      { name, name_id },
      { new: true, runValidators: true } // Retourne le document mis à jour
    );

    if (!toy) {
      return res.status(404).json({ message: 'Jouet non trouvé.' });
    }

    res.json(toy);
  } catch (err) {
    console.error('Error updating toy by name_id:', err);
    res.status(400).json({ message: 'Erreur lors de la mise à jour du jouet.', error: err.message });
  }
});

// Supprimer un jouet par `name_id`
router.delete('/:name_id', async (req, res) => {
  try {
    const toy = await Toy.findOneAndDelete({ name_id: req.params.name_id });
    if (!toy) {
      return res.status(404).json({ message: 'Jouet non trouvé.' });
    }
    res.json({ message: 'Jouet supprimé avec succès.' });
  } catch (err) {
    console.error('Error deleting toy by name_id:', err);
    res.status(500).json({ message: 'Erreur lors de la suppression du jouet.', error: err.message });
  }
});

module.exports = router;
