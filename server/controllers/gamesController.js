const DataRetriever = require('../services/DataRetriever');
require('dotenv').config();

// Chargement des variables d'environnement pour l'API IGDB
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;
const dataRetriever = new DataRetriever(clientId, accessToken);

if (!clientId || !accessToken) {
    console.error("CLIENT_ID or ACCESS_TOKEN missing in .env");
    process.exit(1);
}
const gamesController = {
    // Contrôleur pour obtenir les détails d'un jeu
    async getGameDetails(req, res) {
        try {
            const gameId = req.params.id;
            const gameData = await dataRetriever.getGameInfo(gameId); // Appel direct de la méthode
            res.json(gameData);
        } catch (error) {
            console.error('Erreur lors de la récupération des détails du jeu :', error);
            res.status(500).json({error: 'Impossible de récupérer les détails du jeu.'});
        }
    },

    // Contrôleur pour obtenir les jeux populaires
    async getPopularGames(req, res) {
        try {
            const limit = req.query.limit || 20;
            const offset = req.query.offset || 0;
            const popularGames = await dataRetriever.getCatalogByPopularity(limit, offset);
            res.json(popularGames);
        } catch (error) {
            console.error('Erreur lors de la récupération des jeux populaires :', error);
            res.status(500).json({error: 'Impossible de récupérer les jeux populaires.'});
        }
    },

    // Obtenir une liste de jeux avec filtres
    async getFilteredGames(req, res) {
        const {limit = 200, offset = 0, sort = 'first_release_date desc', recent = false} = req.query;
        try {
            const limit = req.query.limit || 10;
            const offset = req.query.offset || 0;
            const recentGames = await dataRetriever.getCatalogByDate(limit, offset);
            res.json(recentGames);
        } catch (error) {
            console.error('Erreur lors de la récupération des jeux récents :', error);
            res.status(500).json({error: 'Impossible de récupérer les jeux récents.'});
        }
    }
}

module.exports = gamesController;
