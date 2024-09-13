const mongoose = require('mongoose');

const IntensitySchema = new mongoose.Schema({
    name: { type: String, required: true } // Nom de l'intensité
});

module.exports = mongoose.model('Intensity', ToySchema);