const {
    Sequelize,
    gameReview,
    privacySettings,
    users,
    gameRatings,
    gameLogs,
    gamePlatforms,
} = require('../database/sequelize');
const DataRetriever = require('../services/DataRetriever');
const {gameReview: gameReviews} = require('../database/sequelize');

// Initialiser DataRetriever avec vos clés d'API
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;
const dataRetriever = new DataRetriever(clientId, accessToken);

const controller = {};

const gameCache = new Map();

// Fonction pour récupérer les données de jeu à partir de l'API IGDB
async function getGameData(igdb_game_id) {
    if (gameCache.has(igdb_game_id)) {
        return gameCache.get(igdb_game_id);
    }

    try {
        const gameData = await dataRetriever.getGameInfo(igdb_game_id);
        gameCache.set(igdb_game_id, gameData);
        return gameData;
    } catch (error) {
        console.error(`Error fetching game data for ${igdb_game_id}:`, error.message);
        return {name: 'Titre inconnu', cover: {url: null}};
    }
}

// fonction pour formater la date en format français
const formatDateToFrench = (date) => {
    if (!date) return null;

    const d = typeof date === 'number' ? new Date(date * 1000) : new Date(date);

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();

    return `${day}-${month}-${year}`;
};
/**
 * Récupérer toutes les critiques publiques avec les détails du jeu et de la plateforme
 */
controller.getAllReviews = async (req, res) => {
    try {
        // Récupérer toutes les critiques avec les relations nécessaires
        const reviews = await gameReview.findAll({
            include: [
                {
                    model: privacySettings,
                    as: 'review_privacy',
                    attributes: ['name'],
                    where: {name: 'Public'},
                },
                {
                    model: users,
                    as: 'user',
                    attributes: ['username', 'user_id'],
                    include: [
                        {
                            model: gameLogs,
                            as: 'user_game_logs',
                            attributes: ['platform_id', 'igdb_game_id'],
                            include: [
                                {
                                    model: gamePlatforms,
                                    as: 'platform',
                                    attributes: ['name', 'icon'],
                                },
                            ],
                        },
                        {
                            model: gameRatings,
                            as: 'user_ratings',
                            attributes: ['rating_value', 'igdb_game_id'],
                        },
                    ],
                },
            ],
        });

        // Vérification si des critiques existent
        if (!reviews || reviews.length === 0) {
            return res.status(404).json({message: 'No reviews found'});
        }

        const gameDataMap = new Map();

        for (const review of reviews) {
            const igdbGameId = review.igdb_game_id;

            // Si le jeu n'est pas déjà dans le cache, récupérer les données
            if (!gameDataMap.has(igdbGameId)) {
                const gameData = await getGameData(igdbGameId);
                gameDataMap.set(igdbGameId, {
                    name: gameData.name || null,
                    cover: gameData.cover?.url || null,
                });
            }
        }

        
        const reviewsWithDetails = reviews.map((review) => {
            const gameData = gameDataMap.get(review.igdb_game_id) || {
                name: 'Unknown Game',
                cover: null,
            };

            const userLogs = review.user?.user_game_logs || [];
            const platformLog = userLogs.find(
                (log) => Number(log.igdb_game_id) === Number(review.igdb_game_id)
            );

            const platform = platformLog?.platform || {name: null, icon: null};


            const userRating = review.user?.user_ratings?.find(
                (rating) => Number(rating.igdb_game_id) === Number(review.igdb_game_id)
            );

            return {
                id: review.id,
                user_id: review.user.user_id,
                user: {username: review.user?.username || 'Unknown User'},
                igdb_game_id: review.igdb_game_id,
                content: review.content,
                spoiler: review.spoiler,
                date_published: formatDateToFrench(review.date_published), // Formatage de la date
                privacy: review.review_privacy?.name || 'Unknown Privacy',
                platform: platform.name,
                platform_icon: platform.icon,
                game: {
                    title: gameData.name,
                    cover: gameData.cover,
                },
                rating: userRating?.rating_value || null, // Ajouter la note de l'utilisateur
            };
        });


        if (reviewsWithDetails.length === 0) {
            return res.status(404).json({message: 'No valid reviews found'});
        }


        res.status(200).json({
            message: 'Reviews fetched successfully',
            data: reviewsWithDetails,
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({message: 'Error fetching reviews', error: error.message});
    }
};

/**
 * Ajouter une critique avec une note et une plateforme
 */
controller.addReview = async (req, res) => {
    try {
        const {
            igdb_game_id,
            content,
            rating_value,
            privacy_setting_id,
            spoiler,
            platform_id
        } = req.body;

        // Récupérer le user_id depuis le middleware verifyToken
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({message: 'Utilisateur non authentifié.'});
        }
        const user_id = req.user.user_id;

        // Vérifier si les champs obligatoires sont fournis
        if (!igdb_game_id || !content || !privacy_setting_id || !platform_id) {
            return res.status(400).json({
                message: 'Les champs igdb_game_id, content, privacy_setting_id et platform_id sont obligatoires.',
            });
        }

        console.log("Données reçues :", req.body);

        // Vérifier si un commentaire existe déjà pour cet utilisateur et ce jeu
        const existingReview = await gameReview.findOne({
            where: {user_id, igdb_game_id},
        });

        if (existingReview) {
            return res.status(400).json({
                message: 'Vous avez déjà publié un commentaire pour ce jeu.',
            });
        }

        // Vérifier si l'utilisateur existe
        const user = await users.findOne({where: {user_id}});
        if (!user) {
            return res.status(404).json({message: 'Utilisateur non trouvé.'});
        }
        console.log("Utilisateur trouvé :", user_id);

        // Créer la critique
        const review = await gameReview.create({
            user_id,
            igdb_game_id,
            content,
            privacy_setting_id,
            spoiler: spoiler || false, // Défaut à false si non fourni
            date_published: new Date(),
        });
        console.log("Critique créée :", review);

        // Ajouter une note
        await gameRatings.create({
            user_id,
            igdb_game_id,
            rating_value,
            privacy_setting_id,
        });
        console.log("Note ajoutée :", rating_value);

        // Vérifier ou créer un log pour la plateforme
        let existingLog = await gameLogs.findOne({
            where: {user_id, igdb_game_id},
        });

        if (!existingLog) {
            existingLog = await gameLogs.create({
                user_id,
                igdb_game_id,
                platform_id,
                privacy_setting_id,
                time_played: 0,
            });
            console.log("Nouveau log créé :", existingLog);
        } else {
            await existingLog.update({
                platform_id,
                privacy_setting_id,
            });
            console.log("Log existant mis à jour :", existingLog);
        }

        // Retourner une réponse de succès
        res.status(201).json({
            message: 'Critique et plateforme ajoutées avec succès.',
            data: review,
        });
    } catch (error) {
        console.error('Erreur lors de l\'ajout de la critique :', error);
        res.status(500).json({
            message: 'Erreur lors de l\'ajout de la critique.',
            error: error.message,
        });
    }
};

/**
 * Mettre à jour une critique et la plateforme associée
 */
controller.updateReview = async (req, res) => {
    try {
        const {id} = req.params; // ID de la critique à modifier
        const {content, privacy_setting_id, spoiler, platform_id} = req.body;

        // Trouver la critique existante
        const review = await gameReview.findOne({where: {id}});
        if (!review) {
            return res.status(404).json({message: 'Critique non trouvée'});
        }

        // Vérifiez si l'utilisateur authentifié est le propriétaire de la critique
        if (req.user.user_id !== review.user_id) {
            return res.status(403).json({message: 'Vous n\'êtes pas autorisé à modifier cette critique.'});
        }

        // Mettre à jour les champs de la critique
        const updatedReview = await review.update({
            content: content !== undefined ? content : review.content,
            privacy_setting_id: privacy_setting_id !== undefined ? privacy_setting_id : review.privacy_setting_id,
            spoiler: spoiler !== undefined ? spoiler : review.spoiler,
        });

        // Mettre à jour la plateforme dans game_logs si platform_id est fourni
        if (platform_id) {
            // Vérifier si un log existe pour ce user_id et ce igdb_game_id
            const existingLog = await gameLogs.findOne({
                where: {
                    user_id: review.user_id, // Colonne correcte
                    igdb_game_id: review.igdb_game_id, // Colonne correcte
                },
            });

            if (existingLog) {
                // Mettre à jour la plateforme et potentiellement la confidentialité
                await existingLog.update({
                    platform_id,
                    privacy_setting_id: privacy_setting_id || existingLog.privacy_setting_id,
                });
            } else {
                // Créer un nouveau log si aucun n'existe
                await gameLogs.create({
                    user_id: review.user_id,
                    igdb_game_id: review.igdb_game_id,
                    platform_id,
                    privacy_setting_id: privacy_setting_id || 1, // Défaut si non fourni
                    time_played: 0, // Par défaut
                });
            }
        }

        res.status(200).json({
            message: 'Critique (et éventuellement plateforme) mise à jour avec succès',
            data: updatedReview,
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la critique :', error);
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de la critique',
            error: error.message,
        });
    }
};

/**
 * Supprimer une critique et les logs associés
 */
controller.deleteReview = async (req, res) => {
    try {
        const {id} = req.params;
        const {user_id} = req.user;

        // Trouver la critique existante
        const review = await gameReview.findOne({where: {id}});
        if (!review) {
            return res.status(404).json({message: 'Critique non trouvée'});
        }

        // Vérifiez si l'utilisateur est autorisé à supprimer la critique
        if (review.user_id !== user_id) {
            return res.status(403).json({message: 'Vous n\'êtes pas autorisé à supprimer cette critique.'});
        }

        // Supprimer les logs associés dans game_logs
        await gameLogs.destroy({
            where: {igdb_game_id: review.igdb_game_id, user_id: review.user_id},
        });

        // Supprimer la critique
        await review.destroy();

        res.status(200).json({message: 'Critique et logs associés supprimés avec succès'});
    } catch (error) {
        console.error('Erreur lors de la suppression de la critique :', error);
        res.status(500).json({
            message: 'Erreur lors de la suppression de la critique',
            error: error.message,
        });
    }
};

controller.getReviewsByGameId = async (req, res) => {
    try {
        const {id} = req.params;

        // Récupérer les critiques associées à ce jeu, seulement celles avec la confidentialité "Public"
        const reviews = await gameReview.findAll({
            where: {igdb_game_id: id},
            include: [
                {
                    model: privacySettings,
                    as: 'review_privacy',
                    attributes: ['name'],
                    where: {name: 'Public'}, // Filtrer uniquement les avis publics
                },
                {
                    model: users,
                    as: 'user',
                    attributes: ['username', 'user_id'], // Inclure l'ID utilisateur
                    include: [
                        {
                            model: gameLogs,
                            as: 'user_game_logs',
                            attributes: ['platform_id', 'igdb_game_id'],
                            include: [
                                {
                                    model: gamePlatforms,
                                    as: 'platform',
                                    attributes: ['name', 'icon'],
                                },
                            ],
                        },
                        {
                            model: gameRatings,
                            as: 'user_ratings',
                            attributes: ['rating_value', 'igdb_game_id'],
                        },
                    ],
                },
            ],
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({message: 'No reviews found for this game'});
        }

        // Récupération des données du jeu via API ou cache
        const gameData = await getGameData(id);

        // Transformation des critiques avec les détails du jeu, plateforme, et notes
        const reviewsWithDetails = reviews.map((review) => {
            const userLogs = review.user?.user_game_logs || [];
            const platformLog = userLogs.find(
                (log) => Number(log.igdb_game_id) === Number(review.igdb_game_id)
            );

            const platform = platformLog?.platform || {name: 'Plateforme inconnue', icon: null};

            // Récupérer la note associée à ce jeu pour cet utilisateur
            const userRating = review.user?.user_ratings?.find(
                (rating) => Number(rating.igdb_game_id) === Number(review.igdb_game_id)
            );

            return {
                id: review.id,
                user_id: review.user.user_id,
                user: {username: review.user?.username || 'Unknown User'},
                igdb_game_id: review.igdb_game_id,
                content: review.content,
                spoiler: review.spoiler,
                date_published: formatDateToFrench(review.date_published), // Formatage de la date
                privacy: review.review_privacy?.name || 'Unknown Privacy',
                platform: platform.name,
                platform_icon: platform.icon,
                game: {
                    title: gameData.name || 'Titre inconnu',
                    cover: gameData.cover?.url || null,
                },
                rating: userRating?.rating_value || null, // Ajouter la note de l'utilisateur
            };
        });

        res.status(200).json({
            message: 'Game reviews fetched successfully',
            data: reviewsWithDetails,
        });
    } catch (error) {
        console.error('Error fetching reviews by game ID:', error);
        res.status(500).json({
            message: 'Error fetching reviews by game ID',
            error: error.message,
        });
    }
};
/**
 * Obtenir les critiques par utilisateur
 */
controller.getReviewsByUserId = async (req, res) => {
    try {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({message: 'ID utilisateur manquant.'});
        }

        // Récupérer les critiques de l'utilisateur
        const reviews = await gameReviews.findAll({
            where: {user_id: userId},
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: ['username', 'profile_picture'], // Inclure les informations utilisateur
                },
            ],
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({message: 'Aucune critique trouvée pour cet utilisateur.'});
        }

        // Récupérer les détails des jeux (titre, cover) via API IGDB ou cache
        const gameDataMap = new Map();

        for (const review of reviews) {
            const igdbGameId = review.igdb_game_id;

            if (!gameDataMap.has(igdbGameId)) {
                const gameData = await getGameData(igdbGameId); // Récupérer les données de jeu
                gameDataMap.set(igdbGameId, {
                    name: gameData.name || 'Titre inconnu',
                    cover: gameData.cover?.url || '/placeholder-image.png',
                });
            }
        }

        // Transformer les critiques avec les détails enrichis
        const reviewsWithDetails = reviews.map((review) => {
            const gameData = gameDataMap.get(review.igdb_game_id) || {
                name: 'Titre inconnu',
                cover: '/placeholder-image.png',
            };

            return {
                id: review.id,
                user_id: review.user_id,
                content: review.content,
                spoiler: review.spoiler,
                date_published: formatDateToFrench(review.date_published),
                user: {
                    username: review.user?.username || 'Utilisateur inconnu',
                    profile_picture: review.user?.profile_picture || '/default-avatar.png',
                },
                game: {
                    title: gameData.name,
                    cover: gameData.cover,
                },
            };
        });

        return res.status(200).json({
            message: 'Critiques récupérées avec succès',
            data: reviewsWithDetails,
        });
    } catch (err) {
        console.error('Erreur lors de la récupération des critiques :', err);
        return res.status(500).json({message: 'Erreur serveur', error: err.message});
    }
};

module.exports = controller;
