const DataRetriever = require('./DataRetriever.js');

class CatalogDataRetriever extends DataRetriever {
    static #DEFAULT_OFFSET = 0;
    static #DEFAULT_LIMIT = 50;
    static #FIELDS = `
        id,
        name,
        aggregated_rating,
        created_at,
        genres.id,
        genres.name,
        cover.image_id
    `;

    requestList(coversIds, genresIds) {
        return [
            [this.getCovers, coversIds, 1],
            [this.getGameGenres, genresIds, 1],
        ];
    }

    async #getCatalog(sortingOption, paginationOption) {
        const games = await this.getGameData(
            CatalogDataRetriever.#FIELDS,
            "",
            `${sortingOption} ${paginationOption}`
        );

        // Collect all unique cover and genre IDs
        const coverIds = [...new Set(games.filter(game => game.cover?.image_id).map(game => game.cover.image_id))];
        const genreIds = [...new Set(games.flatMap(game => game.genres?.map(genre => genre.id) || []))];

        // Request cover and genre data
        const requests = this.requestList(coverIds, genreIds);
        const { coverMap, genres } = await this.makeRequests(requests);

        // Create a map for genres
        const genresMap = new Map();
        genres?.forEach(genre => genresMap.set(genre.id, genre));

        // Map the games with the necessary details
        return games.map(game => {
            const coverUrl = game.cover?.image_id
                ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg`
                : 'https://via.placeholder.com/150';

            // Return the transformed game object
            return {
                id: game.id,
                name: game.name,
                cover: { url: coverUrl },
                aggregatedRating: game.aggregated_rating || 0,
                releaseDate: game.created_at || null,
                genres: game.genres?.map(genre => genresMap.get(genre.id) || genre) || [],
            };
        });
    }

    async getCatalogByDate(limit = CatalogDataRetriever.#DEFAULT_LIMIT, offset = CatalogDataRetriever.#DEFAULT_OFFSET) {
        const dateSortingOption = `where created_at < ${Math.floor(Date.now() / 1000)}; sort created_at desc;`;
        const paginationOption = `limit ${limit}; offset ${offset};`; // Pagination logic for date sorting
        return await this.#getCatalog(dateSortingOption, paginationOption);
    }

    async getCatalogByPopularity(limit = CatalogDataRetriever.#DEFAULT_LIMIT, offset = CatalogDataRetriever.#DEFAULT_OFFSET) {
        const popularitySortingOption = `sort aggregated_rating desc;`; // Sort by popularity
        const paginationOption = `limit ${limit}; offset ${offset};`; // Pagination logic for popularity sorting
        return await this.#getCatalog(popularitySortingOption, paginationOption);
    }
}

module.exports = CatalogDataRetriever;
