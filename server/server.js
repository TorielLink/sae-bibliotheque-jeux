const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importation des routes
const gameRoutes = require('./routes/gamesRoute'); // accès aux jeux http://localhost:8080/games
const gameGenreRoutes = require('./routes/gameGenreRoute');
// Route pour la recherche, test avec http://localhost:8080/search?query=mario
 const searchRoutes = require('./routes/searchRoute');

// Création de l'application Express
const app = express();

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
app.use('/games', gameRoutes); // Routes pour les jeux
app.use('/gameGenres', gameGenreRoutes); // Routes pour les genres
app.use('/search', searchRoutes); // Routes pour la recherche

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
