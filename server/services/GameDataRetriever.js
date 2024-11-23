const DataRetriever = require('./DataRetriever.js');

class GameDataRetriever extends DataRetriever {
    static #fields = `
        age_ratings,
        aggregated_rating,
        aggregated_rating_count,
        bundles,
        category,
        checksum,
        collections,
        cover,
        dlcs,
        expansions,
        external_games,
        first_release_date,
        franchises,
        game_modes,
        genres,
        involved_companies,
        parent_game,
        name,
        platforms,
        player_perspectives,
        remakes,
        remasters,
        screenshots,
        similar_games,
        standalone_expansions,
        storyline,
        summary,
        themes,
        videos,
        websites,
        created_at
        `

    requestList(game) {
        return [
            [this.getGameInvolvedCompanies, game.involved_companies, 4],
            [this.getGamePlatforms, game.platforms, 3],
            [this.getGameAgeRatingsData, game.age_ratings, 2],
            [this.getGameBundles, game.bundles, 1],
            [this.getGameCollections, game.collections, 1],
            [this.getGameCover, game.cover, 1],
            [this.getGameDlcs, game.dlcs, 1],
            [this.getGameExpansions, game.expansions, 1],
            [this.getGameExternalLinks, game.external_games, 1],
            [this.getGameFranchises, game.franchises, 1],
            [this.getGameGameModes, game.game_modes, 1],
            [this.getGameGenres, game.genres, 1],
            [this.getGameParentGame, game.parent_game, 1],
            [this.getGamePlayerPerspectives, game.player_perspectives, 1],
            [this.getGameRemakes, game.remakes, 1],
            [this.getGameRemasters, game.remasters, 1],
            [this.getGameScreenshots, game.screenshots, 1],
            [this.getGameSimilarGames, game.similar_games, 1],
            [this.getGameStandalones, game.standalone_expansions, 1],
            [this.getGameThemes, game.themes, 1],
            [this.getGameVideos, game.videos, 1],
            [this.getGameWebsites, game.websites, 1]
            [this.getGameCreatedAt, game.created_at, 1]
        ];
    }

    async getGameInfo(id) {
        const game = (await this.getGameData(GameDataRetriever.#fields, `where id=${id};`))[0]
        let requests = this.requestList(game)

        let result
        result = {
            name: game.name,
            summary: game.summary,
            storyline: game.storyline,
            criticsAggregatedRating: game.aggregated_rating,
            criticsAggregatedRatingCount: game.aggregated_rating_count,
            category: game.category,
            releaseDate: game.created_at,
            ...await this.makeRequests(requests)
        }

        return result
    }
}

module.exports = GameDataRetriever