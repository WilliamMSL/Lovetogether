require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Importation des routes
const userRoutes = require('./routes/user');
const truthOrDareRoutes = require('./routes/truthordare');
const toyRoutes = require('./routes/toys');
const roleplayRoutes = require('./routes/roleplay');

// Route middlewares
app.use('/api/users', userRoutes);
app.use('/api/truthordare', truthOrDareRoutes);
app.use('/api/toys', toyRoutes);
app.use('/api/roleplay', roleplayRoutes);

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Créez un client Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

// Connectez-vous à Redis
redisClient.connect().catch(console.error);

// Rendez le client Redis disponible dans l'application
app.set('redisClient', redisClient);

// Démarrage du serveur
const PORT = process.env.PORT || 1812;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
