const DataRetriever = require('../services/DataRetriever');
require('dotenv').config();

// Instanciation des classes avec les variables d'environnement
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;
const dataRetriever = new DataRetriever(clientId, accessToken);

// Contrôleur pour obtenir les détails d'un jeu
async function getGameDetails(req, res) {
    try {
        const gameId = req.params.id;
        const gameData = await dataRetriever.getGameInfo(gameId); // Appel direct de la méthode
        res.json(gameData);
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du jeu :', error);
        res.status(500).json({error: 'Impossible de récupérer les détails du jeu.'});
    }
}

// Contrôleur pour obtenir les jeux populaires
async function getPopularGames(req, res) {
    try {
        const limit = req.query.limit || 10;
        const offset = req.query.offset || 0;
        const popularGames = await dataRetriever.getCatalogByPopularity(limit, offset);
        res.json(popularGames);
    } catch (error) {
        console.error('Erreur lors de la récupération des jeux populaires :', error);
        res.status(500).json({error: 'Impossible de récupérer les jeux populaires.'});
    }
}

// Contrôleur pour obtenir les jeux récents
async function getRecentGames(req, res) {
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

module.exports
