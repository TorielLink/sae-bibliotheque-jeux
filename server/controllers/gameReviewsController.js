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
async function getGameData(igdb_game_ids) {
    const cachedGames = igdb_game_ids.map(id => gameCache.get(id)).filter(Boolean);

    const missingIds = igdb_game_ids.filter(id => !gameCache.has(id));
    if (missingIds.length === 0) {
        return cachedGames;
    }
    try {
        const gamesData = await dataRetriever.getGameList(missingIds);
        gamesData.forEach(game => gameCache.set(game.id, game));
        return [...cachedGames, ...gamesData];
    } catch (error) {
        console.error(`Erreur lors de la récupération des données des jeux:`, error.message);
        return cachedGames;
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
                    where: { name: 'Public' },
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
            raw: false,  // Désactiver raw pour éviter les doublons
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'No reviews found' });
        }

        // Créer une map pour éviter les doublons sur les reviews
        const uniqueReviewsMap = new Map();

        reviews.forEach((review) => {
            const reviewKey = `${review.id}-${review.user_id}-${review.igdb_game_id}`;

            if (!uniqueReviewsMap.has(reviewKey)) {
                uniqueReviewsMap.set(reviewKey, {
                    id: review.id,
                    user_id: review.user.user_id,
                    user: { username: review.user?.username || 'Unknown User' },
                    igdb_game_id: review.igdb_game_id,
                    content: review.content,
                    spoiler: review.spoiler,
                    date_published: formatDateToFrench(review.date_published),
                    privacy: review.review_privacy?.name || 'Unknown Privacy',
                    platforms: [],
                    game: {
                        title: 'Unknown Game',
                        cover: null,
                    },
                    rating: null,
                });
            }

            const storedReview = uniqueReviewsMap.get(reviewKey);

            // Ajouter la plateforme si elle n'existe pas déjà
            if (review.user.user_game_logs?.length) {
                review.user.user_game_logs.forEach(log => {
                    if (!storedReview.platforms.some(p => p.name === log.platform?.name)) {
                        storedReview.platforms.push({
                            name: log.platform?.name || 'Unknown Platform',
                            icon: log.platform?.icon || null,
                        });
                    }
                });
            }

            // Ajouter la note s'il y en a une
            if (review.user.user_ratings?.length) {
                const userRating = review.user.user_ratings.find(
                    rating => Number(rating.igdb_game_id) === Number(review.igdb_game_id)
                );
                if (userRating) storedReview.rating = userRating.rating_value;
            }
        });

        // Récupérer tous les jeux en une seule requête
        const igdbGameIds = [...new Set(reviews.map(r => r.igdb_game_id))];
        const gameDataMap = new Map((await getGameData(igdbGameIds)).map(g => [g.id, g]));

        // Associer les jeux aux reviews
        uniqueReviewsMap.forEach((review) => {
            const gameData = gameDataMap.get(review.igdb_game_id);
            if (gameData) {
                review.game.title = gameData.name;
                review.game.cover = gameData.cover;
            }
        });

        res.status(200).json({
            message: 'Reviews fetched successfully',
            data: Array.from(uniqueReviewsMap.values()),
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Error fetching reviews', error: error.message });
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

        // Vérifier si l'utilisateur est authentifié
        if (!req.user || !req.user.user_id) {
            return res.status(401).json({message: 'Utilisateur non authentifié.'});
        }
        const user_id = req.user.user_id;

        // Vérifier les champs obligatoires
        if (!igdb_game_id || !content || !privacy_setting_id || !platform_id) {
            return res.status(400).json({
                message: 'Les champs igdb_game_id, content, privacy_setting_id et platform_id sont obligatoires.',
            });
        }


        // Vérifier si une critique existe déjà pour cet utilisateur et ce jeu
        const existingReview = await gameReview.findOne({where: {user_id, igdb_game_id}});

        if (existingReview) {
            return res.status(400).json({message: 'Vous avez déjà publié un commentaire pour ce jeu.'});
        }

        // Vérifier si l'utilisateur existe
        const user = await users.findByPk(user_id);
        if (!user) {
            return res.status(404).json({message: 'Utilisateur non trouvé.'});
        }

        // Vérifier si la plateforme existe
        const platform = await gamePlatforms.findByPk(platform_id);
        if (!platform) {
            return res.status(400).json({message: 'Plateforme invalide.'});
        }

        // Créer la critique
        const review = await gameReview.create({
            user_id,
            igdb_game_id,
            content,
            privacy_setting_id,
            spoiler: spoiler || false,
            date_published: new Date(),
        });
        // Vérifier si une note existe déjà
        const existingRating = await gameRatings.findOne({where: {user_id, igdb_game_id}});
        if (!existingRating && rating_value !== undefined) {
            await gameRatings.create({
                user_id,
                igdb_game_id,
                rating_value,
                privacy_setting_id,
            });
        }

        // Vérifier si un log existe déjà pour la plateforme
        let existingLog = await gameLogs.findOne({where: {user_id, igdb_game_id}});

        if (!existingLog) {
            existingLog = await gameLogs.create({
                user_id,
                igdb_game_id,
                platform_id,
                privacy_setting_id,
                time_played: 0,
            });
        } else {
            await existingLog.update({
                platform_id,
                privacy_setting_id,
            });
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
        const {id} = req.params;
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
        await gameLogs.destroy({where: {igdb_game_id: review.igdb_game_id, user_id: review.user_id}});

        // Supprimer la note associée dans game_ratings
        await gameRatings.destroy({where: {user_id: review.user_id, igdb_game_id: review.igdb_game_id}});

        // Supprimer la critique
        await review.destroy();

        res.status(200).json({message: 'Critique, logs et note associés supprimés avec succès'});
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
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: 'Game ID manquant.' });
        }

        const gameId = Number(id); // Conversion en nombre

        // Récupérer les critiques associées à ce jeu
        const reviews = await gameReview.findAll({
            where: { igdb_game_id: gameId },
            include: [
                {
                    model: privacySettings,
                    as: 'review_privacy',
                    attributes: ['name'],
                    where: { name: 'Public' },
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

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'Aucun avis trouvé pour ce jeu.' });
        }

        // Vérification du cache
        let gameData = gameCache.get(gameId);
        if (!gameData) {
            const gameDataList = await getGameData([gameId]); // Correction : passer un tableau [gameId]
            gameData = gameDataList.length > 0 ? gameDataList[0] : null;

            if (gameData) {
                gameCache.set(gameId, gameData); // Stocker en cache
            }
        }

        // Vérifier que gameData contient bien les informations correctes
        if (!gameData || !gameData.name || !gameData.cover) {
            console.warn(`Données du jeu introuvables ou incomplètes pour l'ID: ${gameId}`);
            gameData = { name: 'Titre inconnu', cover: 'https://placehold.co/200x300' };
        }
        // Transformation des critiques avec les détails du jeu
        const reviewsWithDetails = reviews.map((review) => {
            const userLogs = review.user?.user_game_logs || [];
            const platformLog = userLogs.find(
                (log) => Number(log.igdb_game_id) === Number(review.igdb_game_id)
            );

            const platform = platformLog?.platform || { name: 'Plateforme inconnue', icon: null };

            const userRating = review.user?.user_ratings?.find(
                (rating) => Number(rating.igdb_game_id) === Number(review.igdb_game_id)
            );

            return {
                id: review.id,
                user_id: review.user?.user_id || null,
                user: { username: review.user?.username || 'Utilisateur inconnu' },
                igdb_game_id: review.igdb_game_id,
                content: review.content,
                spoiler: review.spoiler,
                date_published: formatDateToFrench(review.date_published),
                privacy: review.review_privacy?.name || 'Confidentialité inconnue',
                platform: platform.name,
                platform_icon: platform.icon,
                game: {
                    title: gameData.name,
                    cover: gameData.cover,
                },
                rating: userRating?.rating_value || null,
            };
        });

        res.status(200).json({
            message: 'Critiques du jeu récupérées avec succès',
            data: reviewsWithDetails,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des critiques par ID de jeu :', error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des critiques par ID de jeu',
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
            return res.status(400).json({ message: 'ID utilisateur manquant.' });
        }

        // Récupérer les critiques de l'utilisateur avec les relations correctes
        const reviews = await gameReviews.findAll({
            where: { user_id: userId },
            include: [
                {
                    model: users,
                    as: 'user',
                    attributes: ['username', 'profile_picture'],
                    include: [
                        {
                            model: gameRatings,
                            as: 'user_ratings', // Récupérer les notes via l'utilisateur
                            attributes: ['rating_value', 'igdb_game_id'],
                        },
                    ],
                },
            ],
        });

        if (!reviews || reviews.length === 0) {
            return res.status(404).json({ message: 'Aucune critique trouvée pour cet utilisateur.' });
        }

        // Récupérer les jeux en une seule requête pour optimiser les performances
        const igdbGameIds = [...new Set(reviews.map(r => r.igdb_game_id))];

        let gameDataMap = new Map();
        if (igdbGameIds.length > 0) {
            const gameDataList = await getGameData(igdbGameIds);
            gameDataMap = new Map(gameDataList.map(game => [game.id, game]));
        }

        // Transformation des critiques avec les détails du jeu et la note
        const reviewsWithDetails = reviews.map((review) => {
            const gameData = gameDataMap.get(review.igdb_game_id) || {
                name: 'Titre inconnu',
                cover: 'https://placehold.co/200x300',
            };

            // Vérifier si une note existe pour ce jeu et cet utilisateur
            const userRating = review.user?.user_ratings?.find(
                (rating) => Number(rating.igdb_game_id) === Number(review.igdb_game_id)
            );

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
                rating: userRating?.rating_value || null, // Associer la note de l'utilisateur au jeu
            };
        });

        return res.status(200).json({
            message: 'Critiques récupérées avec succès',
            data: reviewsWithDetails,
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des critiques par utilisateur :', error);
        return res.status(500).json({ message: 'Erreur serveur', error: error.message });
    }
};

module.exports = controller;
