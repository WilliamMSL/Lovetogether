require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');

const app = express();

// Middlewares
app.use(bodyParser.json());

app.use(cors({
  origin: ['https://lovetogether3-cyjhjdtyb-williammsls-projects.vercel.app', 'https://lovetogether3.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Could not connect to MongoDB Atlas', err));

// Middleware pour vérifier l'état de la connexion MongoDB
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(500).json({ error: 'Database connection is not ready' });
  }
  next();
});

// Créez un client Redis
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

// Fonction pour initialiser Redis
const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err);
  }
};

// Initialiser Redis
initRedis();

// Rendez le client Redis disponible dans l'application
app.set('redisClient', redisClient);

// Route de test API
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Catch-all route pour l'API
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Gestion de la fermeture gracieuse
process.on('SIGINT', async () => {
  try {
    await redisClient.quit();
    await mongoose.connection.close();
    console.log('Connections closed gracefully');
    process.exit(0);
  } catch (err) {
    console.error('Error during graceful shutdown:', err);
    process.exit(1);
  }
});

// test
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working' });
});

// Démarrage du serveur
const PORT = process.env.PORT || 1812;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;