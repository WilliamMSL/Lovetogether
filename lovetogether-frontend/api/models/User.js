const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, required: true },
    toys: [{ type: String }]  // Liste de jouets choisis
});

module.exports = mongoose.model('User', UserSchema);