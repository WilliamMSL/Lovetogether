require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');

console.log('Starting server initialization...');

const app = express();

// Middlewares
app.use(bodyParser.json());

const allowedOrigins = [
  'https://lovetogether3-cyjhjdtyb-williammsls-projects.vercel.app', 
  'https://lovetogether3.vercel.app', 
  'http://localhost:3000',
  'https://lovetogether3.vercel.app'  // Ajouté pour Vercel
];
console.log('Allowed origins:', allowedOrigins);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  console.log('Request body:', req.body);
  next();
});

// Importation des routes
console.log('Importing routes...');
const userRoutes = require('./routes/user');
const truthOrDareRoutes = require('./routes/truthordare');
const toyRoutes = require('./routes/toys');
const roleplayRoutes = require('./routes/roleplay');

// Route middlewares
console.log('Setting up route middlewares...');
app.use('/api/users', userRoutes);
app.use('/api/truthordare', truthOrDareRoutes);
app.use('/api/toys', toyRoutes);
app.use('/api/roleplay', roleplayRoutes);

// Connexion à MongoDB Atlas
console.log('Connecting to MongoDB Atlas...');
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
  .then(() => console.log('Successfully connected to MongoDB Atlas'))
  .catch(err => {
    console.error('Failed to connect to MongoDB Atlas:', err);
    process.exit(1);
  });

// Middleware pour vérifier l'état de la connexion MongoDB
app.use((req, res, next) => {
  console.log('Checking MongoDB connection state...');
  if (mongoose.connection.readyState !== 1) {
    console.error('MongoDB connection is not ready. Current state:', mongoose.connection.readyState);
    return res.status(500).json({ error: 'Database connection is not ready' });
  }
  console.log('MongoDB connection is ready.');
  next();
});

// Créez un client Redis
console.log('Initializing Redis client...');
const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

// Fonction pour initialiser Redis
const initRedis = async () => {
  try {
    await redisClient.connect();
    console.log('Successfully connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err);
    process.exit(1);
  }
};

// Initialiser Redis
initRedis();

// Rendez le client Redis disponible dans l'application
app.set('redisClient', redisClient);

// Route de test API
app.get('/api/test', (req, res) => {
  console.log('Test API route hit');
  res.json({ message: 'API is working', timestamp: new Date().toISOString() });
});

// Catch-all route pour l'API
app.use('/api/*', (req, res) => {
  console.log('API route not found:', req.originalUrl);
  res.status(404).json({ message: 'API route not found', path: req.originalUrl });
});

// Middleware d'erreur global
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

// Gestion de la fermeture gracieuse
process.on('SIGINT', async () => {
  console.log('Received SIGINT. Closing connections gracefully...');
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

// Démarrage du serveur
const PORT = process.env.PORT || 1812;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Environment variables:');
  console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
  console.log('REDIS_URL:', process.env.REDIS_URL ? 'Set' : 'Not set');
  console.log('NODE_ENV:', process.env.NODE_ENV);
});

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Application specific logging, throwing an error, or other logic here
});

module.exports = app;