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
            [this.getGameFranchises, game.franchises, 1],

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
        const apiData = {
            ...await this.makeRequests(requests)
        }

        const [bundles, collections, dlcs, expansions, remakes,
            remasters, similar_games, standalone_expansions, franchises, parentGame] = await this.#getRelatedContent(game, apiData)

        let result
        result = {
            name: game.name,
            summary: game.summary,
            storyline: game.storyline,
            criticsAggregatedRating: game.aggregated_rating,
            criticsAggregatedRatingCount: game.aggregated_rating_count,
            category: game.category,
            releaseDate: game.first_release_date,
            platforms: apiData.platforms,
            ageRating: apiData.ageRatingSummary,
            cover: apiData.cover,
            genres: apiData.genres,
            screenshots: apiData.screenshots,
            videos: apiData.videos,
            externalLinks: apiData.externalLinks,
            bundles: bundles,
            collections: collections,
            dlcs: dlcs,
            expansions: expansions,
            franchises: franchises,
            remakes: remakes,
            remasters: remasters,
            similarGames: similar_games,
            standaloneExpansions: standalone_expansions,
            parentGame: parentGame
        }
        return result
    }

    async #getRelatedContent(game, apiData) {

        let franchisesIds = []
        apiData.franchises.map(el => {
            franchisesIds.push(...el.games)
        })


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
            ...(franchisesIds || [])
        ].filter(Boolean);

        if (game.parent_game !== undefined) {
            relatedContentIds.push(game.parent_game);
        }

        const relatedContentData = await this.#getRelatedContentList(relatedContentIds)
        let relatedContentMap = new Map()
        relatedContentData.map(el => {
            relatedContentMap.set(el.id, el);
        })


        const bundles = this.#setRelatedContent("bundles", game.bundles || [], relatedContentMap);
        const collections = this.#setRelatedContent("collections", game.collections || [], relatedContentMap);
        const dlcs = this.#setRelatedContent("dlcs", game.dlcs || [], relatedContentMap);
        const expansions = this.#setRelatedContent("expansions", game.expansions || [], relatedContentMap);
        const remakes = this.#setRelatedContent("remakes", game.remakes || [], relatedContentMap);
        const remasters = this.#setRelatedContent("remasters", game.remasters || [], relatedContentMap);
        const similar_games = this.#setRelatedContent("similar_games", game.similar_games || [], relatedContentMap);
        const standalone_expansions = this.#setRelatedContent("standalone_expansions", game.standalone_expansions || [], relatedContentMap);

        apiData.franchises.map(franchise => {
            const gameIds = franchise.games
            franchise.games = []
            gameIds.forEach(id => {
                franchise.games.push(relatedContentMap.get(id))
            })
        })

        const parent_game = game.parent_game ? relatedContentMap.get(game.parent_game) : null

        return [bundles, collections, dlcs, expansions, remakes, remasters, similar_games,
            standalone_expansions, apiData.franchises, parent_game]
    }

    #setRelatedContent(name, contentIds, contentMap) {
        let list = []
        contentIds.map(el => {
            list.push(contentMap.get(el));
        })
        return list
    }

    async #getRelatedContentList(gamesIds) {
        const sortingOptions = `where id = (${gamesIds.join(",")});`
        const paginationOption = `limit ${gamesIds.length};`;
        return await this.#getGameList(sortingOptions, paginationOption);
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

            game.aggregated_rating = !game.aggregated_rating ? 0 : (game.aggregated_rating / 10).toFixed(1)

            game.releaseDate = el.first_release_date
                ? new Date(el.first_release_date * 1000).toISOString()
                : null
            delete game.first_release_date

            game.cover = game.cover == undefined ? undefined : coversMap.get(game.cover).url
            let genres = []
            if (game.genres != undefined) {
                el.genres.map(genreId => {
                    genres.push(genresMap.get(genreId).name)
                })
            }
            game.genres = genres
            result.push(game)
        })

        let sortedResult = result
            .filter(el => el.cover !== undefined)
            .map(el => {
                return el;
            })
        return sortedResult
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