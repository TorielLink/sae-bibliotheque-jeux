const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const path = require('path');
const http = require('http');
require('dotenv').config();

const verifyToken = require('./middleware/auth');

const FRONTEND_URL = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_BUILD_URL
    : process.env.FRONTEND_PREVIEW_URL;

console.log(`Mode: ${process.env.NODE_ENV} | Frontend: ${FRONTEND_URL}`);

// Importation des routes
const searchRoutes = require('./routes/searchRoute');
const usersRoutes = require('./routes/usersRoutes');
const statusRoutes = require('./routes/statusRoutes');
const gamePlatformsRoutes = require('./routes/gamePlatformsRoutes');
const gameLogsRoutes = require('./routes/gameLogsRoutes');
const gameSessionRoutes = require('./routes/gameSessionsRoutes');
const gameReviewRoutes = require('./routes/gameReviewsRoutes');
const gameRatingsRoutes = require('./routes/gameRatingsRoutes');
const gameStatusRoutes = require('./routes/gameStatusRoutes');
const friendsRoutes = require('./routes/friendsRoutes');
const { swaggerUi, swaggerDocs } = require('./middleware/swagger'); // Documentation API
const gamesRoutes = require('./routes/gamesRoutes');
const privacySettingsRoutes = require('./routes/privacySettingsRoutes')
const gameCollectionsRoutes = require('./routes/gameCollectionsRoutes');
const collectionContentRoutes = require('./routes/collectionContentRoutes')

// Création de l'application Express
const app = express();

const configureCors = () => {
    const allowedOrigins = [
        process.env.FRONTEND_PREVIEW_URL,
        process.env.FRONTEND_BUILD_URL
    ];

    return cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error('Origine non autorisée par CORS'));
            }
        },
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    });
};
app.use(configureCors());

app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Permet l'envoi de formulaires ou requêtes fetch vers le backend
        connectSrc: ["'self'", "http://localhost:8080"],
        formAction: ["'self'", "http://localhost:8080"],
        // Autorise les images depuis le backend + base64
        imgSrc: ["'self'", "http://localhost:8080", "data:"],
        // Si besoin, autorise styles/scripts externes
        // styleSrc: ["'self'", ...],
        // scriptSrc: ["'self'", ...],
      },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'), {
    maxAge: '7d',
    immutable: true,
  })
);

// ---------------------
// Gestion des routes
// ---------------------
app.use('/games', gamesRoutes);
app.use('/search', searchRoutes);
app.use('/users', usersRoutes);
app.use('/status', statusRoutes);
app.use('/game-platforms', gamePlatformsRoutes);
app.use('/game-collections', gameCollectionsRoutes);
app.use('/collection-content', collectionContentRoutes);
app.use('/game-logs', gameLogsRoutes);
app.use('/privacy-settings', privacySettingsRoutes);
app.use('/game-sessions', gameSessionRoutes);
app.use('/game-reviews', gameReviewRoutes);
app.use('/game-ratings', gameRatingsRoutes);
app.use('/game-status', gameStatusRoutes);
app.use('/friends', friendsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Middleware pour les routes non trouvées
app.use((req, res) => {
  res.status(404).json({ message: 'Ressource non trouvée.' });
});

// Middleware global d'erreur
app.use((err, req, res, next) => {
  console.error('Erreur du serveur :', err.stack);
  res.status(500).json({ message: 'Erreur interne du serveur.', error: err.message });
});

// ---------------------
// Démarrage du serveur
// ---------------------
const startServer = () => {
  const PORT = process.env.PORT_APP || 8080;
  const NODE_ENV = process.env.NODE_ENV || 'development';

  console.log(`🚀 Serveur lancé en mode ${NODE_ENV} sur le port ${PORT}`);
  console.log(`🔗 Frontend accessible à ${FRONTEND_URL}`);

  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`✅ Serveur opérationnel sur http://localhost:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('❌ Erreur du serveur:', err.message);
  });

  // Gestion des fermetures propres
  process.on('SIGTERM', () => {
    console.log('🔴 Fermeture du serveur...');
    server.close(() => {
      console.log('✅ Serveur arrêté proprement.');
      process.exit(0);
    });
  });

  process.on('SIGINT', () => {
    console.log('🛑 Interruption détectée, arrêt du serveur...');
    server.close(() => {
      console.log('✅ Serveur arrêté proprement.');
      process.exit(0);
    });
  });
};

startServer();
