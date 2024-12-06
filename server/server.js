const express = require('express');
const cors = require('cors');
const path = require('path'); // Import du module path
require('dotenv').config();

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
const userListsRoutes = require('./routes/userListsRoutes');
const { swaggerUi, swaggerDocs } = require('./middleware/swagger'); // Importez la configuration
const gamesRoutes = require('./routes/gamesRoutes');

// Création de l'application Express
const app = express();
const gameListRoutes = require('./routes/gameListsRoutes');
const listContentRoutes = require('./routes/listContentRoutes');


// Configuration CORS

// Configuration CORS
const configureCors = () => {
    const allowedOrigins = []; // On définira dynamiquement les origines autorisées

    // Générer la liste des origines dans la plage
    for (let port = 5173; port <= 5177; port++) {
        allowedOrigins.push(`http://localhost:${port}`);
    }

    return cors({
        origin: (origin, callback) => {
            // Si l'origine est dans la liste, on l'autorise
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

// Middleware pour parser les données JSON et URL-encodées
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Gestion des routes
app.use('/games', gamesRoutes);
app.use('/search', searchRoutes); // Routes pour la recherche
app.use('/users', usersRoutes); // Routes pour les utilisateurs
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Routes pour les fichiers téléchargés
app.use('/status', statusRoutes); // Ajout des routes pour les statuts
app.use('/game-platforms', gamePlatformsRoutes); // Ajout des routes pour les plateformes de jeu
app.use('/game-lists', gameListRoutes); // Ajout des routes pour les listes de jeux
app.use('/list-content', listContentRoutes);
app.use('/game-logs', gameLogsRoutes);
app.use('/game-sessions', gameSessionRoutes);
app.use('/game-reviews', gameReviewRoutes);
app.use('/game-ratings', gameRatingsRoutes);
app.use('/game-status', gameStatusRoutes);
app.use('/friends', friendsRoutes);
app.use('/user-lists', userListsRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// Gestion des erreurs pour les routes non définies
app.use((req, res) => {
    res.status(404).json({ message: 'Ressource non trouvée.' });
});

// Gestionnaire global des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur du serveur :', err.stack);
    res.status(500).json({ message: 'Erreur interne du serveur.', error: err.message });
});

// Démarrage du serveur
const startServer = () => {
    const PORT = process.env.PORT_APP || 8080;
    app.listen(PORT, () => {
        console.log(`Le serveur fonctionne sur le port ${PORT}`);
    });
};

startServer();
