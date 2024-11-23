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
        const fields = "id, name, aggregated_rating, first_release_date, cover.image_id, genres.name";
        const filters = "where first_release_date != null;";
        const options = "sort created_at desc; limit 20;";

        const games = await dataRetriever.getGameData(fields, filters, options);
        console.log("games", games);
        const transformedGames = games.map(game => ({
            id: game.id,
            name: game.name,
            cover: game.cover?.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
                : "https://via.placeholder.com/150",
            aggregatedRating: game.aggregated_rating || 0,
            releaseDate: game.first_release_date || null,
            genres: game.genres?.map(genre => genre.name) || [],
        }));
        res.json(transformedGames);
    } catch (error) {
        console.error("Error fetching games:", error.message);
        res.status(500).json({ message: "Failed to fetch games." });
    }
});


module.exports = router;
