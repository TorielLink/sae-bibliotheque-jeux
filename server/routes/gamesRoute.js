const express = require('express');
const router = express.Router();
const DataRetriever = require('../services/DataRetriever');

// Setup environment variables for IGDB API
const clientId = process.env.CLIENT_ID;
const accessToken = process.env.ACCESS_TOKEN;

if (!clientId || !accessToken) {
    console.error("CLIENT_ID or ACCESS_TOKEN missing in .env");
    process.exit(1);
}

const dataRetriever = new DataRetriever(clientId, accessToken);

// Route to fetch games
router.get('/', async (req, res) => {
    try {
        const fields = "id, name, aggregated_rating, created_at, cover.image_id, genres.name";
        const filters = "where created_at != null;";
        const options = "sort created_at desc; limit 20;";

        const games = await dataRetriever.getGameData(fields, filters, options);
        console.log("games", games);

        // Transforme les jeux
        const transformedGames = games.map(game => {
            // Vérifie si le jeu a une image de couverture
            const cover = game.cover?.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
                : null;  // Si pas de couverture, mets null

            // Retourne l'objet jeu, sans la clé `cover` si pas de couverture
            return {
                id: game.id,
                name: game.name,
                cover: cover,  // Inclut la couverture uniquement si elle existe
                aggregatedRating: game.aggregated_rating || 0,
                releaseDate: new Date(game.created_at * 1000) || null,
                genres: game.genres?.map(genre => genre.name) || [],
            };
        });

        // Filtre les jeux qui n'ont pas de couverture
        const filteredGames = transformedGames.filter(game => game.cover !== null);  // Supprime les jeux sans couverture

        res.json(filteredGames);
    } catch (error) {
        console.error("Error fetching games:", error.message);
        res.status(500).json({ message: "Failed to fetch games." });
    }
});



module.exports = router;
