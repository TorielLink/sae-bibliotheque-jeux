const express = require('express');
const router = express.Router();
const DataRetriever = require('../services/DataRetriever');

// Chargement des variables d'environnement pour l'API IGDB
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;

if (!clientId || !accessToken) {
    console.error("CLIENT_ID or ACCESS_TOKEN missing in .env");
    process.exit(1);
}

const dataRetriever = new DataRetriever(clientId, accessToken);

// Route pour récupérer les jeux récents
router.get('/by-date', async (req, res) => {
    const {limit = 20, offset = 0} = req.query;
    try {
        const catalog = await dataRetriever.getCatalogByDate(limit, offset);
        res.json(catalog);
    } catch (error) {
        console.error("Erreur lors de la récupération des jeux par date :", error.message);
        res.status(500).json({message: "Échec de la récupération des jeux par date."});
    }
});

// Route pour récupérer les jeux populaires
router.get('/by-popularity', async (req, res) => {
    const {limit = 20, offset = 0} = req.query;
    try {
        const catalog = await dataRetriever.getCatalogByPopularity(limit, offset);
        res.json(catalog);
    } catch (error) {
        console.error("Erreur lors de la récupération des jeux populaires :", error.message);
        res.status(500).json({message: "Échec de la récupération des jeux populaires."});
    }
});

// Route pour récupérer les détails d’un jeu spécifique
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const gameDetails = await dataRetriever.getGameInfo(id);
        res.json(gameDetails);
    } catch (error) {
        console.error(`Erreur lors de la récupération des détails du jeu ${id} :`, error.message);
        res.status(500).json({message: "Échec de la récupération des détails du jeu.", error: error.message});
    }
});

// Route pour récupérer une liste de jeux avec filtres
router.get('/', async (req, res) => {
    const {limit = 200, offset = 0, sort = 'first_release_date desc', recent = false} = req.query;
    try {
        const fields = "id, name, aggregated_rating, first_release_date, cover.image_id, genres.name";

        const now = Math.floor(Date.now() / 1000);
        const sixMonthsAgo = now - 6 * 30 * 24 * 60 * 60;
        const recentFilter = recent === 'true'
            ? `where first_release_date >= ${sixMonthsAgo} & first_release_date <= ${now};`
            : `where first_release_date <= ${now};`;

        const options = `sort ${sort}; limit ${limit}; offset ${offset};`;

        const games = await dataRetriever.getGameData(fields, recentFilter, options);

        const transformedGames = games.map(game => ({
            id: game.id,
            name: game.name || "Titre inconnu",
            cover: game.cover?.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
                : 'https://via.placeholder.com/250x350',
            aggregatedRating: game.aggregated_rating || 0,
            releaseDate: game.first_release_date
                ? new Date(game.first_release_date * 1000).toISOString()
                : null,
            genres: game.genres?.map(genre => genre.name) || [],
        }));

        res.json(transformedGames);
    } catch (error) {
        console.error("Erreur lors de la récupération des jeux :", error.message);
        res.status(500).json({message: "Échec de la récupération des jeux.", error: error.message});
    }
});

module.exports = router;
