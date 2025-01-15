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

// Initialiser DataRetriever avec vos clés d'API
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;
const dataRetriever = new DataRetriever(clientId, accessToken);

const controller = {};

// Mise en place d'un cache en mémoire pour éviter d'appeler l'API IGDB pour chaque critique identique
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
        const reviews = await gameReview.findAll({
            include: [
                {
                    model: privacySettings,
                    as: 'review_privacy',
                    attributes: ['name'],
                    where: {name: 'Publique'}, // Critères publics
                },
                {
                    model: users,
                    as: 'user',
                    attributes: ['username'],
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
                    ],
                },
            ],
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({message: 'No reviews found'});
        }

        // Récupérer les données de jeu en parallèle et les stocker dans une Map
        const gameDataMap = new Map();
        const gameDataPromises = reviews.map(async (review) => {
            if (!gameDataMap.has(review.igdb_game_id)) {
                const gameData = await getGameData(review.igdb_game_id);
                if (gameData) {
                    gameDataMap.set(review.igdb_game_id, gameData);
                }
            }
        });

        // Attendre que tous les appels à l'API soient terminés
        await Promise.all(gameDataPromises);

        // Transformation des données enrichies pour chaque critique
        const reviewsWithDetails = reviews
            .map((review) => {
                const gameData = gameDataMap.get(review.igdb_game_id);

                const userLogs = review.user?.user_game_logs || [];
                const platformLog = userLogs.find(
                    (log) => Number(log.igdb_game_id) === Number(review.igdb_game_id)
                );

                const platform = platformLog?.platform || {name: 'Unknown Platform', icon: null};

                return {
                    id: review.id,
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
                        cover: gameData.cover?.url || null,
                    },
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
        const user_id = req.user.user_id; // Assurez-vous que "user_id" est la clé utilisée dans le payload du token

        // Vérifier si les champs obligatoires sont fournis
        if (!content || !platform_id) {
            return res.status(400).json({
                message: 'La critique (content) et la plateforme (platform_id) sont obligatoires.'
            });
        }

        // Vérifier si l'utilisateur existe (facultatif si vous faites confiance au middleware)
        const user = await users.findOne({where: {user_id}}); // Utilisation correcte de `user_id`
        if (!user) {
            return res.status(404).json({message: 'Utilisateur non trouvé.'});
        }

        // Créer la critique
        const review = await gameReview.create({
            user_id,
            igdb_game_id,
            content,
            privacy_setting_id,
            spoiler: spoiler || false, // Défaut à false si non fourni
            date_published: new Date(),
        });

        // Ajouter une note si elle est fournie
        if (rating_value !== undefined && rating_value !== null) {
            await gameRatings.create({
                user_id,
                igdb_game_id,
                rating_value,
                privacy_setting_id,
            });
        }

        // Ajouter un log pour la plateforme
        let existingLog = await gameLogs.findOne({
            where: {user_id, igdb_game_id}, // Utilisation correcte de `user_id`
        });

        if (!existingLog) {
            // Créer un nouveau log
            await gameLogs.create({
                user_id,
                igdb_game_id,
                platform_id,
                privacy_setting_id,
                time_played: 0,
            });
        } else {
            // Si un log existe déjà, mettre éventuellement à jour la plateforme
            await existingLog.update({
                platform_id,
                privacy_setting_id,
            });
        }

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

/**
 * Obtenir les critiques par utilisateur
 */
controller.getReviewsByUserId = async (req, res) => {
    try {
        // Récupérer l'utilisateur authentifié via le token JWT
        const {user_id} = req.user;

        const reviews = await gameReview.findAll({
            where: {user_id},
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
                    model: gameLogs,
                    as: 'game_logs',
                    attributes: ['platform_id', 'igdb_game_id'],
                    include: [
                        {
                            model: gamePlatforms,
                            as: 'platform',
                            attributes: ['name', 'icon'],
                        },
                    ],
                },
            ],
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({message: 'No reviews found for this user'});
        }

        // Récupérer les données de jeux en parallèle
        const gameDataMap = new Map();
        for (const review of reviews) {
            if (!gameDataMap.has(review.igdb_game_id)) {
                const gameData = await getGameData(review.igdb_game_id);
                // Ajouter uniquement les données valides dans le cache
                if (gameData && gameData.name) {
                    gameDataMap.set(review.igdb_game_id, gameData);
                }
            }
        }

        // Transformation des données enrichies pour chaque critique avec filtrage des jeux inexistants
        const reviewsWithDetails = reviews
            .filter((review) => gameDataMap.has(review.igdb_game_id)) // Filtrer les critiques sans données de jeu
            .map((review) => {
                const gameData = gameDataMap.get(review.igdb_game_id);

                const userLogs = review.game_logs || [];
                const platformLog = userLogs.find(
                    (log) => Number(log.igdb_game_id) === Number(review.igdb_game_id)
                );

                const platform = platformLog?.platform || {name: 'Unknown Platform', icon: null};

                return {
                    id: review.id,
                    user: {username: review.user?.username || 'Unknown User'},
                    igdb_game_id: review.igdb_game_id,
                    content: review.content,
                    spoiler: review.spoiler,
                    date_published: review.date_published,
                    privacy: review.review_privacy?.name || 'Unknown Privacy',
                    platform: platform.name,
                    platform_icon: platform.icon,
                    game: {
                        title: gameData.name,
                        cover: gameData.cover?.url || null,
                    },
                };
            });

        if (reviewsWithDetails.length === 0) {
            return res.status(404).json({message: 'No valid reviews found for this user'});
        }

        res.status(200).json({
            message: 'User reviews fetched successfully',
            data: reviewsWithDetails,
        });
    } catch (error) {
        console.error('Error fetching reviews by user ID:', error);
        res.status(500).json({
            message: 'Error fetching reviews by user ID',
            error: error.message,
        });
    }
};

/**
 * Obtenir les critiques par jeu
 */
controller.getReviewsByGameId = async (req, res) => {
    try {
        const {id} = req.params;
        const reviews = await gameReview.findAll({
            where: {igdb_game_id: id},
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
                    model: gameLogs,
                    as: 'game_logs',
                    attributes: ['platform_id'],
                    include: [
                        {
                            model: gamePlatforms,
                            as: 'platform',
                            attributes: ['name', 'icon'],
                        },
                    ],
                },
            ],
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({message: 'No reviews found for this game'});
        }

        const reviewsWithDetails = reviews.map(review => {
            const platform = review.game_logs?.[0]?.platform || {name: 'Plateforme inconnue', icon: null};

            return {
                ...review.toJSON(),
                platform: platform.name,
                platform_icon: platform.icon,
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

module.exports = controller;
