if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
const winston = require('winston');

// Initialisation de l'application Express
const app = express();

// Configuration du middleware CORS
const corsOptions = {
  origin: '*', // Autorise toutes les origines
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes HTTP autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // En-têtes autorisés
  credentials: true, // Autoriser les credentials si nécessaire
};

app.use(cors(corsOptions)); // Utilisez CORS avec les options définies

// Configuration du logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'lovetogether-service' },
  transports: [
    new winston.transports.Console(),
  ],
});

logger.info('Démarrage de l\'initialisation du serveur...');

// Middlewares
app.use(express.json());

// Middleware de journalisation des requêtes
app.use((req, res, next) => {
  logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  logger.debug('En-têtes de la requête :', req.headers);
  logger.debug('Corps de la requête :', req.body);
  next();
});

// Importation des routes
logger.info('Importation des routes...');
const userRoutes = require('./routes/user');
const truthOrDareRoutes = require('./routes/truthordare');
const toyRoutes = require('./routes/toys');
const roleplayRoutes = require('./routes/roleplay');

// Route middlewares
logger.info('Configuration des middlewares de routage...');
app.use('/api/users', userRoutes);
app.use('/api/truthordare', truthOrDareRoutes);
app.use('/api/toys', toyRoutes);
app.use('/api/roleplay', roleplayRoutes);

// Variable globale pour stocker la connexion MongoDB
let mongoConnection = null;
let redisClient = null;

// Fonction pour se connecter à MongoDB (lazy connection)
async function connectToMongoDB() {
  if (mongoConnection && mongoose.connection.readyState === 1) {
    return mongoConnection;
  }

  try {
    // Vérifiez que MONGODB_URI est défini
    if (!process.env.MONGODB_URI) {
      logger.error('MONGODB_URI n\'est pas défini dans les variables d\'environnement.');
      throw new Error('MONGODB_URI n\'est pas défini');
    }

    // Connexion à MongoDB Atlas
    logger.info('Connexion à MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    logger.info('Connecté avec succès à MongoDB Atlas');
    mongoConnection = mongoose.connection;
    return mongoConnection;
  } catch (error) {
    logger.error('Erreur lors de la connexion à MongoDB:', error);
    throw error;
  }
}

// Fonction pour se connecter à Redis (lazy connection)
async function connectToRedis() {
  if (redisClient && redisClient.isOpen) {
    return redisClient;
  }

  if (!process.env.REDIS_URL) {
    logger.info('REDIS_URL non défini, Redis désactivé');
    return null;
  }

  try {
    logger.info('Initialisation du client Redis...');
    redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    });

    await redisClient.connect();
    logger.info('Connecté avec succès à Redis');
    return redisClient;
  } catch (redisError) {
    logger.warn('Erreur lors de la connexion à Redis, continuation sans Redis:', redisError.message);
    return null;
  }
}

// Middleware pour s'assurer que MongoDB est connecté avant chaque requête
app.use(async (req, res, next) => {
  try {
    await connectToMongoDB();
    
    // Vérification de l'état de la connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      logger.error('La connexion MongoDB n\'est pas prête. État actuel :', mongoose.connection.readyState);
      return res.status(500).json({ error: 'La connexion à la base de données n\'est pas prête' });
    }

    // Connecter Redis si nécessaire
    const redis = await connectToRedis();
    if (redis) {
      req.redisClient = redis;
    }

    next();
  } catch (error) {
    logger.error('Erreur lors de la connexion à la base de données:', error);
    return res.status(500).json({ error: 'Erreur de connexion à la base de données', message: error.message });
  }
});

// Route de test API
app.get('/api/test', (req, res) => {
  logger.info('Route API de test appelée');
  res.json({ 
    message: 'L\'API fonctionne', 
    timestamp: new Date().toISOString(),
    mongoStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Catch-all route pour l'API
app.use('/api/*', (req, res) => {
  logger.warn('Route API non trouvée :', req.originalUrl);
  res.status(404).json({ message: 'Route API non trouvée', path: req.originalUrl });
});

// Middleware d'erreur global
app.use((err, req, res, next) => {
  logger.error('Gestionnaire d\'erreur global :', err);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Pour Vercel serverless functions, exporter un handler
module.exports = app;

// Pour le développement local, démarrer le serveur
if (require.main === module) {
  (async () => {
    try {
      await connectToMongoDB();
      await connectToRedis();

      // Démarrage du serveur
      const PORT = process.env.PORT || 1812;
      app.listen(PORT, () => {
        logger.info(`Serveur en cours d'exécution sur le port ${PORT}`);
        logger.debug('Variables d\'environnement :');
        logger.debug('MONGODB_URI est définie :', !!process.env.MONGODB_URI);
        logger.debug('REDIS_URL est définie :', !!process.env.REDIS_URL);
        logger.debug('NODE_ENV :', process.env.NODE_ENV);
      });

      // Gestion des erreurs non capturées
      process.on('unhandledRejection', (reason, promise) => {
        logger.error('Rejet non géré à :', promise, 'raison :', reason);
      });

      // Gestion de la fermeture gracieuse
      const gracefulShutdown = async () => {
        logger.info('Fermeture gracieuse en cours...');
        try {
          if (redisClient && redisClient.isOpen) {
            await redisClient.quit();
          }
          if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
          }
          logger.info('Connexions fermées avec succès');
          process.exit(0);
        } catch (err) {
          logger.error('Erreur lors de la fermeture gracieuse :', err);
          process.exit(1);
        }
      };

      process.on('SIGINT', gracefulShutdown);
      process.on('SIGTERM', gracefulShutdown);

    } catch (err) {
      logger.error('Erreur lors de l\'initialisation du serveur :', err);
      process.exit(1);
    }
  })();
}
