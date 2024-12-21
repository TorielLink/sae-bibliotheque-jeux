const { Sequelize, gameReview, privacySettings, users, gameRatings } = require('../database/sequelize');
const DataRetriever = require('../services/DataRetriever');

// Initialiser DataRetriever avec vos clés d'API
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;
const dataRetriever = new DataRetriever(clientId, accessToken);

const controller = {};

// Mise en place d'un cache en mémoire pour éviter d'appeler l'API IGDB pour chaque critique identique
const gameCache = new Map();

/**
 * Récupérer les données d'un jeu via l'API ou le cache
 */
async function getGameData(igdb_game_id) {
    if (gameCache.has(igdb_game_id)) {
        return gameCache.get(igdb_game_id);
    }
    const gameData = await dataRetriever.getGameInfo(igdb_game_id);
    gameCache.set(igdb_game_id, gameData);
    return gameData;
}

/**
 * Obtenir toutes les critiques
 */
controller.getAllReviews = async (req, res) => {
    try {
        const reviews = await gameReview.findAll({
            include: [
                {
                    model: privacySettings,
                    as: 'review_privacy',
                    attributes: ['name'],
                },
                {
                    model: users,
                    as: 'user',
                    attributes: ['username'],
                },
                {
                    model: gameRatings,
                    as: 'rating',
                    required: false,
                    where: {
                        user_id: Sequelize.col('game_reviews.user_id'),
                        igdb_game_id: Sequelize.col('game_reviews.igdb_game_id'),
                    },
                    attributes: ['rating_value'],
                },
            ],
        });

        // Charger les données des jeux dans le cache
        const uniqueGameIds = [...new Set(reviews.map(r => r.igdb_game_id))];
        for (const gameId of uniqueGameIds) {
            if (!gameCache.has(gameId)) {
                await getGameData(gameId);
            }
        }

        // Ajouter les données des jeux aux critiques
        const reviewsWithGames = reviews.map(review => {
            const gameData = gameCache.get(review.igdb_game_id);
            return {
                ...review.toJSON(),
                game: {
                    id: review.igdb_game_id,
                    title: gameData?.name || 'Titre inconnu',
                    cover: gameData?.cover?.url || null,
                },
                rating: review.rating ? review.rating.rating_value : null,
            };
        });

        res.status(200).json({ message: 'Reviews fetched successfully', data: reviewsWithGames });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
    }
};

/**
 * Obtenir les critiques par utilisateur
 */
controller.getReviewsByUserId = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await gameReview.findAll({
            where: { user_id: id },
            include: [
                {
                    model: privacySettings,
                    as: 'review_privacy',
                    attributes: ['name'],
                },
                {
                    model: users,
                    as: 'user',
                    attributes: ['username'],
                },
                {
                    model: gameRatings,
                    as: 'rating',
                    required: false,
                    where: {
                        user_id: Sequelize.col('game_reviews.user_id'),
                        igdb_game_id: Sequelize.col('game_reviews.igdb_game_id'),
                    },
                    attributes: ['rating_value'],
                },
            ],
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this user' });
        }

        // Charger les données des jeux dans le cache
        const uniqueGameIds = [...new Set(reviews.map(r => r.igdb_game_id))];
        for (const gameId of uniqueGameIds) {
            if (!gameCache.has(gameId)) {
                await getGameData(gameId);
            }
        }

        // Ajouter les données des jeux aux critiques
        const reviewsWithGames = reviews.map(review => {
            const gameData = gameCache.get(review.igdb_game_id);
            return {
                ...review.toJSON(),
                game: {
                    id: review.igdb_game_id,
                    title: gameData?.name || 'Titre inconnu',
                    cover: gameData?.cover?.url || null,
                },
                rating: review.rating ? review.rating.rating_value : null,
            };
        });

        res.status(200).json({ message: 'User reviews fetched successfully', data: reviewsWithGames });
    } catch (error) {
        console.error('Error fetching reviews by user ID:', error);
        res.status(500).json({ message: 'Error fetching reviews by user ID', error: error.message });
    }
};

/**
 * Obtenir les critiques par jeu
 */
controller.getReviewsByGameId = async (req, res) => {
    try {
        const { id } = req.params;
        const reviews = await gameReview.findAll({
            where: { igdb_game_id: id },
            include: [
                {
                    model: privacySettings,
                    as: 'review_privacy',
                    attributes: ['name'],
                },
                {
                    model: users,
                    as: 'user',
                    attributes: ['username'],
                },
                {
                    model: gameRatings,
                    as: 'rating',
                    required: false,
                    where: {
                        user_id: Sequelize.col('game_reviews.user_id'),
                        igdb_game_id: Sequelize.col('game_reviews.igdb_game_id'),
                    },
                    attributes: ['rating_value'],
                },
            ],
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found for this game' });
        }

        if (!gameCache.has(id)) {
            await getGameData(id);
        }

        // Ajouter les données des jeux aux critiques
        const reviewsWithGames = reviews.map(review => {
            const gameData = gameCache.get(review.igdb_game_id);
            return {
                ...review.toJSON(),
                game: {
                    id: review.igdb_game_id,
                    title: gameData?.name || 'Titre inconnu',
                    cover: gameData?.cover?.url || null,
                },
                rating: review.rating ? review.rating.rating_value : null,
            };
        });

        res.status(200).json({ message: 'Game reviews fetched successfully', data: reviewsWithGames });
    } catch (error) {
        console.error('Error fetching reviews by game ID:', error);
        res.status(500).json({ message: 'Error fetching reviews by game ID', error: error.message });
    }
};

module.exports = controller;
