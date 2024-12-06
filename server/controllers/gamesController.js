const CatalogDataRetriever = require('../services/CatalogDataRetriever');
const GameDataRetriever = require('../services/GameDataRetriever');

// Chargement des variables d'environnement pour l'API IGDB
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;

if (!clientId || !accessToken) {
    console.error("CLIENT_ID or ACCESS_TOKEN missing in .env");
    process.exit(1);
}

const catalogRetriever = new CatalogDataRetriever(clientId, accessToken);
const gameRetriever = new GameDataRetriever(clientId, accessToken);

const gamesController = {
    // Obtenir les jeux populaires
    async getGamesByPopularity(req, res) {
        const { limit = 20, offset = 0 } = req.query;
        try {
            const catalog = await catalogRetriever.getCatalogByPopularity(limit, offset);
            res.json(catalog);
        } catch (error) {
            console.error("Erreur lors de la récupération des jeux populaires :", error.message);
            res.status(500).json({ message: "Échec de la récupération des jeux populaires." });
        }
    },

    // Obtenir les jeux récents
    async getGamesByDate(req, res) {
        const { limit = 20, offset = 0 } = req.query;
        try {
            const catalog = await catalogRetriever.getCatalogByDate(limit, offset);
            res.json(catalog);
        } catch (error) {
            console.error("Erreur lors de la récupération des jeux récents :", error.message);
            res.status(500).json({ message: "Échec de la récupération des jeux récents." });
        }
    },

    // Obtenir les détails d’un jeu spécifique
    async getGameDetails(req, res) {
        const { id } = req.params;
        try {
            const gameDetails = await gameRetriever.getGameInfo(id); // Appel à l'API IGDB via GameDataRetriever
            res.json(gameDetails);
        } catch (error) {
            console.error(`Erreur lors de la récupération des détails du jeu ${id} :`, error.message);
            res.status(500).json({ message: "Échec de la récupération des détails du jeu.", error: error.message });
        }
    },

    // Obtenir une liste de jeux avec filtres
// Obtenir une liste de jeux avec filtres
async getFilteredGames(req, res) {
    const { limit = 200, offset = 0, sort = 'first_release_date desc', recent = false } = req.query;
    try {
        const fields = "id, name, aggregated_rating, first_release_date, cover.image_id, genres.name";

        const now = Math.floor(Date.now() / 1000);
        const sixMonthsAgo = now - 6 * 30 * 24 * 60 * 60;
        const recentFilter = recent === 'true'
            ? `where first_release_date >= ${sixMonthsAgo} & first_release_date <= ${now};`
            : `where first_release_date <= ${now};`;

        const options = `sort ${sort}; limit ${limit}; offset ${offset};`;

        const games = await catalogRetriever.getGameData(fields, recentFilter, options);

        // Transform and filter games to exclude those without a cover
        const transformedGames = games
            .filter(game => game.cover?.image_id) // Exclude games without a cover
            .map(game => ({
                id: game.id,
                name: game.name || "Titre inconnu",
                cover: `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`,
                aggregatedRating: game.aggregated_rating || 0,
                releaseDate: game.first_release_date
                    ? new Date(game.first_release_date * 1000).toISOString()
                    : null,
                genres: game.genres?.map(genre => genre.name) || [],
            }));

        res.json(transformedGames);
    } catch (error) {
        console.error("Erreur lors de la récupération des jeux :", error.message);
        res.status(500).json({ message: "Échec de la récupération des jeux.", error: error.message });
    }
},
};

module.exports = gamesController;
