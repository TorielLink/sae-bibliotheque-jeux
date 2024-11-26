const APIRequests = require('./APIRequests.js');

class DataRetriever extends APIRequests {
    static #DEFAULT_OFFSET = 0
    static #DEFAULT_LIMIT = 50

    static #gamePageFields = `
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
        websites
        `
    static gameListFields = `
        aggregated_rating,
        cover,
        first_release_date,
        genres,
        name
        `

    gamePageRequests(game) {
        return [
            [this.getGamePlatforms, game.platforms, 3],
            [this.getGameAgeRatingsData, game.age_ratings, 2],
            [this.getGameCover, game.cover, 1],
            [this.getGameGenres, game.genres, 1],

            [this.getGameScreenshots, game.screenshots, 1],
            [this.getGameVideos, game.videos, 1],

            [this.getGameExternalLinks, game.external_games, 1],
            // A la toute fin
            // [this.getGamePlayerPerspectives, game.player_perspectives, 1],
            // [this.getGameThemes, game.themes, 1],
        ];
    }

    gameListRequests(coversIds, genresIds) {
        return [
            [this.getCovers, coversIds, 1],
            [this.getGameGenres, genresIds, 1],
        ];
    }

    async getGameInfo(id) {
        const game = (await this.getGameData(DataRetriever.#gamePageFields, `where id=${id};`))[0]
        let requests = this.gamePageRequests(game)

        const relatedContentIds = [
            ...(game.bundles || []),
            ...(game.collections || []),
            ...(game.dlcs || []),
            ...(game.expansions || []),
            ...(game.franchises || []),
            ...(game.game_modes || []),
            ...(game.remakes || []),
            ...(game.remasters || []),
            ...(game.similar_games || []),
            ...(game.standalone_expansions || []),
            ...(game.parent_game || [])
        ].filter(Boolean);
        const relatedContentData = await this.#getRelatedContent(relatedContentIds)
        let relatedContentMap = new Map()
        relatedContentData.map(el => {
            relatedContentMap.set(el.id, el);
        })
        /*
        [this.getGameParentGame, game.parent_game, 1],
        */
        const bundles = this.#setRelatedContent("bundles", game.bundles || [], relatedContentMap);
        const collections = this.#setRelatedContent("collections", game.collections || [], relatedContentMap);
        const dlcs = this.#setRelatedContent("dlcs", game.dlcs || [], relatedContentMap);
        const expansions = this.#setRelatedContent("expansions", game.expansions || [], relatedContentMap);
        //Vérifier les données de franchise
        const franchises = this.#setRelatedContent("franchises", game.franchises || [], relatedContentMap);
        const remakes = this.#setRelatedContent("remakes", game.remakes || [], relatedContentMap);
        const remasters = this.#setRelatedContent("remasters", game.remasters || [], relatedContentMap);
        const similar_games = this.#setRelatedContent("similar_games", game.similar_games || [], relatedContentMap);
        const standalone_expansions = this.#setRelatedContent("standalone_expansions", game.standalone_expansions || [], relatedContentMap);

        let result
        result = {
            name: game.name,
            summary: game.summary,
            storyline: game.storyline,
            criticsAggregatedRating: game.aggregated_rating,
            criticsAggregatedRatingCount: game.aggregated_rating_count,
            category: game.category,
            releaseDate: game.first_release_date,
            bundles: bundles,
            collections: collections,
            dlcs: dlcs,
            expansions: expansions,
            franchises: franchises,
            remakes: remakes,
            remasters: remasters,
            similarGames: similar_games,
            standaloneExpansions: standalone_expansions,
            ...await this.makeRequests(requests)
        }
        return result
    }

    #setRelatedContent(name, contentIds, contentMap) {
        let list = []
        contentIds.map(el => {
            list.push(contentMap.get(el));
        })
        return list
    }

    async #getGameList(sortingOption, paginationOption) {
        const games = await this.getGameData(DataRetriever.gameListFields, "", `${sortingOption}${paginationOption}`)

        let coversIds = [...new Set(games.filter(el => el.cover).map(el => el.cover))]
        let genresIds = [...new Set(games.flatMap(el => el.genres?.length > 0 ? el.genres : []))]

        let requests = this.gameListRequests(coversIds, genresIds)
        let coverGenresData = {
            ...await this.makeRequests(requests)
        }
        let genresMap = new Map()
        const coversMap = coverGenresData.coverMap;
        const genres = coverGenresData.genres.map(el => genresMap.set(el.id, el))

        let result = []
        games.map(el => {
            let game = {
                ...el
            }
            game.cover = game.cover == undefined ? undefined : coversMap.get(game.cover)
            if (game.genres != undefined) {

                let genres = []
                el.genres.map(genreId => {
                    genres.push(genresMap.get(genreId))
                })
                game.genres = genres
            }
            result.push(game)
        })

        return result
    }

    async #getRelatedContent(gamesIds) {
        const sortingOptions = `where id = (${gamesIds.join(",")});`
        const paginationOption = `limit ${gamesIds.length};`;
        return await this.#getGameList(sortingOptions, paginationOption);
    }

    async getCatalogByDate(limit = DataRetriever.#DEFAULT_LIMIT, offset = DataRetriever.#DEFAULT_OFFSET) {
        const dateSortingOption = `where first_release_date < ${Math.floor(Date.now() / 1000)};sort first_release_date desc;`
        const paginationOption = `limit ${limit};offset ${offset};`;
        return await this.#getGameList(dateSortingOption, paginationOption);
    }

    async getCatalogByPopularity(limit = DataRetriever.#DEFAULT_LIMIT, offset = DataRetriever.#DEFAULT_OFFSET) {
        const popuaritySortingOption = `sort aggregated_rating desc;`
        const paginationOption = `limit ${limit};offset ${offset};`;
        return await this.#getGameList(popuaritySortingOption, paginationOption)
    }

}

module.exports = DataRetriever