const express = require('express');
const cors = require('cors'); // Importez CORS
const app = express();
require('dotenv').config();

// Configuration de CORS
const corsOptions = {
    origin: 'http://localhost:5175', // URL de votre frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes autorisées
    credentials: true // Si des cookies ou des autorisations sont utilisés
};

// Activez le middleware CORS
app.use(cors(corsOptions));

// Autres middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importez les routes
const gameGenreRoute = require('./routes/gameGenreRoute');
app.use('/gameGenres', gameGenreRoute);

// Gestion des erreurs 404
app.use(({ res }) => {
    res.status(404).json({ message: 'Resource not found' });
});

// Lancer le serveur
const PORT = process.env.PORT_APP || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
