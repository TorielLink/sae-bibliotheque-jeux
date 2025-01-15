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
            const gameData = await dataRetriever.getGameInfo(gameId);
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
    },

    async getSpecificGames(req, res) {
        try {
            const {gameIds} = req.body

            if (!Array.isArray(gameIds) || gameIds.length === 0) {
                return res.status(400).json({error: 'La liste gameIds est invalide ou vide.'})
            }

            const specificGames = await dataRetriever.getGameList(gameIds);

            res.status(200).json(specificGames);
        } catch (error) {
            console.error('Erreur lors de la récupération des jeux :', error);
            res.status(500).json({error: 'Impossible de récupérer les jeux.'});
        }
    },

    async getGamesByGenres(req, res) {
        try {
            const {limit, offset, genres} = req.body;

            if (!Array.isArray(genres)) {
                return res.status(400).json({error: 'La liste des genres est requise.'});
            }

            const games = await dataRetriever.getCatalogByGenres(genres, limit, offset);
            res.json(games);
        } catch (error) {
            console.error('Erreur lors de la récupération des jeux par genres :', error);
            res.status(500).json({error: 'Impossible de récupérer les jeux par genres.'});
        }
    },
}

module.exports = gamesController;
