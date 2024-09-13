const mongoose = require('mongoose');

const roleplaySchema = new mongoose.Schema({
  id: Number,
  title: String,
  description: String
});

module.exports = mongoose.model('Roleplay', roleplaySchema);