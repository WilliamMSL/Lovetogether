const mongoose = require('mongoose');

const TruthOrDareSchema = new mongoose.Schema({
    template: { type: String, required: true },
    duration: { type: Number },
    intensity: [{ type: String }],
    type: { type: String, required: true },
    player: { type: String, required: true },
    toys: [{ type: String }], // Liste des name_id des jouets
});

module.exports = mongoose.model('TruthOrDare', TruthOrDareSchema);
