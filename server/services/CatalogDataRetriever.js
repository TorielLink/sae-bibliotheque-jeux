const DataRetriever = require('./DataRetriever.js');

class CatalogDataRetriever extends DataRetriever {
    static #DEFAULT_OFFSET = 0
    static #DEFAULT_LIMIT = 50
    static #fields = `
        aggregated_rating,
        cover,
        first_release_date,
        genres,
        name
        `

    requestList(coversIds, genresIds) {
        return [
            [this.getCovers, coversIds, 1],
            [this.getGameGenres, genresIds, 1],
        ];
    }

    async #getCatalog(sortingOption, paginationOption) {
        const games = await this.getGameData(CatalogDataRetriever.#fields, "", `${sortingOption}${paginationOption}`)
        let coversIds = [...new Set(games.filter(el => el.cover).map(el => el.cover))]
        let genresIds = [...new Set(games.flatMap(el => el.genres?.length > 0 ? el.genres : []))]

        let requests = this.requestList(coversIds, genresIds)
        let coverGenresData = {
            ...await this.makeRequests(requests)
        }
        let genresMap = new Map()
        const coversMap = coverGenresData.coverMap;
        const genres = coverGenresData.genres.map(el => genresMap.set(el.id, el))
        console.log(genresMap)
        let result = []
        games.map(el => {
            let game = {
                ...el
            }
            game.cover = game.cover == undefined ? undefined : coversMap.get(game.cover)
            if (game.genres != undefined){

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

    async getCatalogByDate(limit = CatalogDataRetriever.#DEFAULT_LIMIT, offset = CatalogDataRetriever.#DEFAULT_OFFSET) {
        const dateSortingOption = `where first_release_date < ${Math.floor(Date.now() / 1000)};sort first_release_date desc;`
        const paginationOption = `limit ${limit};offset ${offset};`;
        return await this.#getCatalog(dateSortingOption, paginationOption);
    }

    async getCatalogByPopularity(limit = CatalogDataRetriever.#DEFAULT_LIMIT, offset = CatalogDataRetriever.#DEFAULT_OFFSET) {
        const popuaritySortingOption = `sort aggregated_rating desc;`
        const paginationOption = `limit ${limit};offset ${offset};`;
        return await this.#getCatalog(popuaritySortingOption, paginationOption)
    }
}

module.exports = CatalogDataRetriever