const mongoose = require('mongoose');

const roleplaySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Roleplay', roleplaySchema);