require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const redis = require('redis');
const winston = require('winston');

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

const app = express();

// Middlewares
app.use(express.json());

// Mettez à jour votre liste d'origines autorisées pour inclure l'origine manquante
const allowedOrigins = [
  'https://lovetogether3-cyjhjdtyb-williammsls-projects.vercel.app',
  'https://lovetogether3.vercel.app',
  'http://localhost:3000',
  'https://lovetogether3-ic3snytxb-williammsls-projects.vercel.app', // Ajout de cette origine
  'http://192.168.0.23:3000', // Ajoutez cette ligne
];

logger.info('Origines autorisées :', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('L\'origine n\'est pas autorisée par la politique CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

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

// Fonction d'initialisation du serveur
(async () => {
  try {
    // Connexion à MongoDB Atlas
    logger.info('Connexion à MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    logger.info('Connecté avec succès à MongoDB Atlas');

    // Vérification de l'état de la connexion MongoDB
    app.use((req, res, next) => {
      if (mongoose.connection.readyState !== 1) {
        logger.error('La connexion MongoDB n\'est pas prête. État actuel :', mongoose.connection.readyState);
        return res.status(500).json({ error: 'La connexion à la base de données n\'est pas prête' });
      }
      next();
    });

    // Initialisation de Redis
    logger.info('Initialisation du client Redis...');
    const redisClient = redis.createClient({
      url: process.env.REDIS_URL,
    });

    await redisClient.connect();
    logger.info('Connecté avec succès à Redis');

    // Mise à disposition du client Redis dans l'application
    app.set('redisClient', redisClient);

    // Route de test API
    app.get('/api/test', (req, res) => {
      logger.info('Route API de test appelée');
      res.json({ message: 'L\'API fonctionne', timestamp: new Date().toISOString() });
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
        await redisClient.quit();
        await mongoose.connection.close();
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

// Exportation de l'application pour les tests ou l'utilisation externe
module.exports = app;
