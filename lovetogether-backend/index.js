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
mongoose.connect('mongodb+srv://Cluster98088:cmNmV0NITE5o@cluster98088.7q0ea.mongodb.net/LoveTogether?retryWrites=true&w=majority')
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Créez un client Redis
const redisClient = redis.createClient({
  url: 'redis://localhost:6379'  // Utilisation de localhost puisque Redis est déjà en cours d'exécution
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