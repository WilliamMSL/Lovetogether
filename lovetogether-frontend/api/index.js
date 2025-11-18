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

// Pattern singleton pour réutiliser la connexion MongoDB dans un environnement serverless
// Utilise global pour persister la connexion entre les invocations de fonction
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Fonction pour se connecter à MongoDB (lazy connection avec cache global)
async function connectToMongoDB() {
  // Si déjà connecté, retourner la connexion existante
  if (cached.conn && mongoose.connection.readyState === 1) {
    logger.debug('Réutilisation de la connexion MongoDB existante');
    return cached.conn;
  }

  // Si une connexion est en cours, attendre qu'elle se termine
  if (!cached.promise) {
    try {
      // Vérifiez que MONGODB_URI est défini
      if (!process.env.MONGODB_URI) {
        logger.error('MONGODB_URI n\'est pas défini dans les variables d\'environnement.');
        throw new Error('MONGODB_URI n\'est pas défini');
      }

      // Connexion à MongoDB Atlas
      logger.info('Connexion à MongoDB Atlas...');
      const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000,
        socketTimeoutMS: 45000,
        maxPoolSize: 10, // Limiter le nombre de connexions
      };

      cached.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((mongoose) => {
        logger.info('Connecté avec succès à MongoDB Atlas');
        cached.conn = mongoose.connection;
        return mongoose.connection;
      });
    } catch (error) {
      cached.promise = null;
      logger.error('Erreur lors de la connexion à MongoDB:', error);
      throw error;
    }
  }

  try {
    await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Pattern singleton pour Redis (similaire à MongoDB)
let cachedRedis = global.redisClient;

if (!cachedRedis) {
  cachedRedis = global.redisClient = { client: null, promise: null };
}

// Fonction pour se connecter à Redis (lazy connection avec cache global)
async function connectToRedis() {
  if (!process.env.REDIS_URL) {
    logger.info('REDIS_URL non défini, Redis désactivé');
    return null;
  }

  // Si déjà connecté, retourner le client existant
  if (cachedRedis.client && cachedRedis.client.isOpen) {
    logger.debug('Réutilisation du client Redis existant');
    return cachedRedis.client;
  }

  // Si une connexion est en cours, attendre qu'elle se termine
  if (!cachedRedis.promise) {
    logger.info('Initialisation du client Redis...');
    const client = redis.createClient({
      url: process.env.REDIS_URL,
      socket: {
        connectTimeout: 2000, // Timeout de connexion à 2 secondes
        reconnectStrategy: false, // Ne pas reconnecter automatiquement en serverless
      },
    });

    // Gérer les erreurs de connexion
    client.on('error', (err) => {
      logger.warn('Erreur Redis:', err.message);
      cachedRedis.promise = null;
      cachedRedis.client = null;
    });

    cachedRedis.promise = client.connect()
      .then(() => {
        logger.info('Connecté avec succès à Redis');
        cachedRedis.client = client;
        return client;
      })
      .catch((redisError) => {
        logger.warn('Erreur lors de la connexion à Redis:', redisError.message);
        cachedRedis.promise = null;
        cachedRedis.client = null;
        throw redisError;
      });
  }

  try {
    await cachedRedis.promise;
    return cachedRedis.client;
  } catch (e) {
    cachedRedis.promise = null;
    cachedRedis.client = null;
    logger.warn('Connexion Redis échouée, continuation sans Redis');
    return null;
  }
}

// Middleware pour s'assurer que MongoDB est connecté avant chaque requête
app.use(async (req, res, next) => {
  // Timeout global de 8 secondes pour éviter le timeout Vercel (10s)
  const timeout = setTimeout(() => {
    if (!res.headersSent) {
      logger.error('Timeout du middleware');
      return res.status(504).json({ 
        error: 'Gateway Timeout',
        message: 'La requête a pris trop de temps'
      });
    }
  }, 8000);

  try {
    await connectToMongoDB();
    
    // Vérification de l'état de la connexion MongoDB
    if (mongoose.connection.readyState !== 1) {
      clearTimeout(timeout);
      logger.error('La connexion MongoDB n\'est pas prête. État actuel :', mongoose.connection.readyState);
      return res.status(500).json({ error: 'La connexion à la base de données n\'est pas prête' });
    }

    // Connecter Redis si nécessaire (avec timeout pour ne pas bloquer)
    // Redis n'est pas critique - utilisé uniquement pour éviter les répétitions dans truthordare
    try {
      const redisPromise = connectToRedis();
      const redisTimeout = new Promise((resolve) => setTimeout(() => resolve(null), 2000)); // Timeout à 2 secondes
      
      const redisClient = await Promise.race([redisPromise, redisTimeout]);
      
      if (redisClient) {
        req.redisClient = redisClient;
        // Aussi mettre dans app pour compatibilité avec l'ancien code
        if (!app.get('redisClient')) {
          app.set('redisClient', redisClient);
        }
      }
    } catch (redisError) {
      // Continue sans Redis - ne pas bloquer la requête
      logger.warn('Redis non disponible, continuation sans Redis:', redisError.message);
    }

    clearTimeout(timeout);
    next();
  } catch (error) {
    clearTimeout(timeout);
    logger.error('Erreur lors de la connexion à la base de données:', error);
    
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Erreur de connexion à la base de données', 
        message: error.message 
      });
    }
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
          if (cachedRedis.client && cachedRedis.client.isOpen) {
            await cachedRedis.client.quit();
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
