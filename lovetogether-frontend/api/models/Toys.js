const mongoose = require('mongoose');

const ToySchema = new mongoose.Schema({
    name: { type: String, required: true },  // Nom du jouet
    name_id: { type: String, required: true, unique: true }  // Identifiant unique pour le jouet
});

module.exports = mongoose.model('Toy', ToySchema);
