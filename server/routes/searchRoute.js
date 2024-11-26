const express = require('express');
const router = express.Router();
const DataRetriever = require('../services/APIRequests'); // Assurez-vous que ce service existe et est configuré

// Chargez les variables d'environnement
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;

if (!clientId || !accessToken) {
    console.error('CLIENT_ID ou ACCESS_TOKEN manquant dans .env');
    process.exit(1);
}

// Créez une instance de DataRetriever
const dataRetriever = new DataRetriever(clientId, accessToken);

// Route pour l'auto-complétion des jeux
router.get('/', async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ message: 'La requête est vide.' });
    }

    try {
        const fields = 'id, name, cover.image_id';
        const filters = `where name ~ *"${query}"*; limit 10;`;
        const games = await dataRetriever.getData('games', `fields ${fields}; ${filters}`);

        const results = games.map((game) => ({
            id: game.id,
            name: game.name,
            cover: game.cover?.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_cover_small/${game.cover.image_id}.jpg`
                : null,
        }));

        res.json(results);
    } catch (error) {
        console.error('Erreur lors de la récupération des suggestions :', error.message);
        res.status(500).json({ message: 'Erreur lors de la récupération des suggestions.', error: error.message });
    }
});

module.exports = router;
