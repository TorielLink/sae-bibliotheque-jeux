const {category, ESRB, PEGI, CERO, USK, GRAC, CLASS_IND, ACB} = require("./enums/ageRatings");

class APIRequests {
    static #apiUrl = "https://api.igdb.com/v4";
    static #MAX_REQUESTS_PER_SECOND = 4;
    static #REQUEST_INTERVAL = 1000 / this.#MAX_REQUESTS_PER_SECOND;

    #clientId
    #accessToken
    #requestQueue = []
    #isProcessing = false
    #processedData = {}
    #processingPromise = null

    constructor(clientId, accessToken,) {
        this.#clientId = clientId;
        this.#accessToken = accessToken;
    }

    async #delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async fetchAPI(endpoint, queryBody) {
        const url = `${APIRequests.#apiUrl}/${endpoint}`;
        const headers = {
            'Client-ID': this.#clientId,
            'Authorization': `Bearer ${this.#accessToken}`,
            'Content-Type': 'input/plain'
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: queryBody
            });

            if (!response.ok) {
                if (response.status === 429) {
                    console.warn(`Rate limit exceeded for endpoint: ${endpoint}`);
                    throw new Error('Rate limit exceeded');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            //traduire en francais
            return data
        } catch (error) {
            console.error(`Error fetching data from ${endpoint}:`, error.message);
            throw error;
        }
    }

    async #processRequestQueue() {
        if (this.#isProcessing) return this.#processingPromise;
        this.#isProcessing = true;
        this.#processedData = {};

        this.#processingPromise = (async () => {
            try {
                while (this.#requestQueue.length > 0) {
                    const batchProcessStart = performance.now();
                    let cpt = 0;
                    let requestBatch = [];
                    let firstRequest = null;

                    // Prepare batch of requests
                    while (this.#requestQueue.length > 0 && cpt < 4) {
                        const [func, args, requestCallNumber] = this.#requestQueue.shift();

                        if (firstRequest && JSON.stringify([func, args, requestCallNumber]) === JSON.stringify(firstRequest)) {
                            this.#requestQueue.push([func, args, requestCallNumber]);
                            break;
                        }

                        if (cpt + requestCallNumber <= 4) {
                            requestBatch.push({func, args});
                            cpt += requestCallNumber;
                        } else {
                            firstRequest = firstRequest || [func, args, requestCallNumber];
                            this.#requestQueue.push([func, args, requestCallNumber]);
                            break;
                        }
                    }

                    // Execute batch
                    const results = await Promise.all(
                        requestBatch.map(request =>
                            request.func.call(this, request.args)
                        )
                    );

                    // Merge results
                    results.forEach(result => {
                        this.#processedData = {
                            ...this.#processedData,
                            ...result
                        };
                    });

                    // Calculate and enforce rate limit
                    const batchProcessEnd = performance.now();
                    const batchProcessTime = batchProcessEnd - batchProcessStart;
                    const waitTime = batchProcessTime > 1000 ? 0 : 1000 - batchProcessTime;

                    await this.#delay(waitTime);
                }

                return this.#processedData;
            } catch (error) {
                console.error('Error processing request queue:', error);
                throw error;
            } finally {
                this.#isProcessing = false;
            }
        })();

        return this.#processingPromise;
    }

    async getData(endpoint, queryBody) {
        return await this.fetchAPI(endpoint, queryBody);
    }

    async makeRequests(requests) {
        // Add requests to the queue
        this.#requestQueue.push(...requests);

        // If not already processing, start processing
        if (!this.#isProcessing) {
            return this.#processRequestQueue();
        }

        // If already processing, wait for the existing promise
        return this.#processingPromise;
    }

    //-------------------------------------------Fonctions individuelles---------------------------------------------\\
    async getGameData(fields, id = "", optionals = "") {
        const gameData = await this.getData(
            "games",
            `fields ${fields};${id}${optionals}`
        )

        return gameData;
    }

    async getGameAgeRatingsData(ratings) {
        if (!ratings) {
            return {
                ageRating: null,
                ageRatingSummary: null,
            }
        }

        const ageRatingData = await this.getData(
            "age_ratings",
            `fields id, rating, category, synopsis;
                        where id = (${ratings.join(",")});
                        sort category asc;
                        limit ${ratings.length};`
        )

        const order = [2, 4, 1, 3, 5, 6, 7]
        const ratingMappings = {
            [category.ESRB]: ESRB,
            [category.PEGI]: PEGI,
            [category.CERO]: CERO,
            [category.USK]: USK,
            [category.GRAC]: GRAC,
            [category.CLASS_IND]: CLASS_IND,
            [category.ACB]: ACB
        }

        for (const priority of order) {
            const ageRating = ageRatingData.find(rating => rating.category === priority);
            if (!ageRating) continue

            const categoryRating = ratingMappings[ageRating.category]
            if (categoryRating) {
                const pegiRating = ageRating.category === 2
                    ? categoryRating[ageRating.rating]
                    : PEGI[categoryRating[ageRating.rating]]
                return {
                    ageRating: pegiRating,
                }
            }
        }

        return {
            ageRating: PEGI[0]
        }
    }

    async getGameBundles(gameBundles) {
        if (!gameBundles) {
            return {
                bundles: null
            }
        }

        const gameBundlesData = await this.getData(
            "games",
            `fields id, name; where id = (${gameBundles.join(",")});limit ${gameBundles.length};`
        )

        return {
            bundles: gameBundlesData
        }
    }

    async getGameCollections(gameCollections) {
        if (!gameCollections) {
            return {
                collections: null
            }
        }

        const gameCollectionsData = await this.getData(
            "games",
            `fields id, name; where id = (${gameCollections.join(",")});limit ${gameCollections.length};`
        )

        return {
            collections: gameCollectionsData
        }
    }

    async getCovers(coverIds) {
        if (!coverIds) {
            return null
        }

        const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/`

        const coverData = await this.getData(
            "covers",
            `fields image_id,height,width; where id =(${coverIds.join(",")});limit ${coverIds.length};`
        )

        let coverMap = new Map()
        coverData.map(el => {
            el.url = `${coverUrl}${el.image_id}.png`
            delete el.image_id
            coverMap.set(el.id, el)
        })

        return {
            coverMap: coverMap
        }
    }

    async getGameCover(gameCover) {
        if (!gameCover) {
            return {
                cover: null
            }
        }

        const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/`

        const coverData = await this.getData(
            "covers",
            `fields image_id,height,width,game; where id = ${gameCover};`
        )

        coverData[0].url = `${coverUrl}${coverData[0].image_id}.png`
        delete coverData[0].image_id

        return {
            cover: coverData[0]
        }
    }

    async getGameDlcs(gameDlcs) {
        if (!gameDlcs) {
            return null
        }

        const gameDlcsData = await this.getData(
            "games",
            `fields name; where id = (${gameDlcs.join(",")});limit ${gameDlcs.length};`
        )

        return {
            dlcs: gameDlcsData
        }
    }

    async getGameExpansions(gameExpansions) {
        if (!gameExpansions) {
            return {
                expansions: null
            }
        }

        const gameExpansionsData = await this.getData(
            "games",
            `fields name; where id = (${gameExpansions.join(",")});limit ${gameExpansions.length};`
        )

        return {
            expansions: gameExpansionsData
        }
    }

    async getGameExternalLinks(gameExternalLinks) {
        if (!gameExternalLinks) {
            return {
                externalLinks: null
            }
        }

        const gameExternalLinksData = await this.getData(
            "external_games",
            `fields category,uid,url; where id = (${gameExternalLinks.join(",")});limit ${gameExternalLinks.length};`
        )

        return {
            externalLinks: gameExternalLinksData
        }
    }

    async getGameFranchises(gameFranchises) {
        if (!gameFranchises) {
            return {
                franchises: null
            }
        }

        const gameFranchisesData = await this.getData(
            "franchises",
            `fields games,name,slug; where id = (${gameFranchises.join(",")});limit ${gameFranchises.length};`
        )

        return {
            franchises: gameFranchisesData
        }
    }

    async getGameGameModes(gameGameModes) {
        if (!gameGameModes) {
            return {
                gameModes: null,
            }
        }

        const gameGameModesData = await this.getData(
            "game_modes",
            `fields id,name,slug; where id = (${gameGameModes.join(",")});limit ${gameGameModes.length};`
        )

        return {
            gameModes: gameGameModesData
        }
    }

    async getGameGenres(gameGenres) {
        if (!gameGenres || gameGenres.length === 0) {
            return {
                genres: []
            }
        }

        const gameGenresData = await this.getData(
            "genres",
            `fields id,name; where id = (${gameGenres.join(",")});limit ${gameGenres.length};`
        )

        return {
            genres: gameGenresData
        }
    }

    async getGameInvolvedCompanies(gameInvolvedCompanies) {
        if (!gameInvolvedCompanies) {
            return {
                involvedCompanies: null
            }
        }

        const gameInvolvedCompaniesData = await this.getData(
            "involved_companies",
            `fields company,developer,porting,publisher,supporting;
                      where id = (${gameInvolvedCompanies.join(",")});
                      limit ${gameInvolvedCompanies.length};`
        )

        const involvedCompaniesIds = gameInvolvedCompaniesData.map(el => el.company);
        const uniqueInvolvedCompaniesIds = [...new Set(involvedCompaniesIds)];

        const companyData = await this.getData(
            `companies`,
            `fields country,description,developed,logo,name,published,slug,websites;
                      where id = (${uniqueInvolvedCompaniesIds.join(",")});
                      limit ${uniqueInvolvedCompaniesIds.length};`
        )

        let companysMap = new Map()
        companyData.map(el => {
            companysMap.set(el.id, el)
        })

        const companiesLogoIds = companyData.map((el) => el.logo);
        const uniqueCompaniessLogoIds = [...new Set(companiesLogoIds.filter(logo => logo !== undefined))];

        const companiesWebsitesIds = companyData.flatMap(el => el.websites?.length > 0 ? el.websites : []);
        const uniqueCompaniesWebsitesIds = [...new Set(companiesWebsitesIds)];

        const {
            logosMap,
            websitesMap
        } = await this.getLogosAndWebsites("company_logos", uniqueCompaniessLogoIds, "company_websites", uniqueCompaniesWebsitesIds)

        let result = []
        gameInvolvedCompaniesData.map(el => {
            let involvedCompany = {
                ...el
            }

            delete involvedCompany.company

            const logoUrl = `https://images.igdb.com/igdb/image/upload/t_logo_med/`
            involvedCompany.company = companysMap.get(el.company)
            if (involvedCompany.company.logo) {
                const logoId = involvedCompany.company.logo
                delete involvedCompany.company.logo
                involvedCompany.company.logo = logosMap.get(logoId)
                involvedCompany.company.logo.url = `${logoUrl}${involvedCompany.company.logo.image_id}.png`
                delete involvedCompany.company.logo.image_id
            }

            const websitesId = involvedCompany.company.websites?.length > 0 ? involvedCompany.company.websites : []
            delete involvedCompany.company.websites
            let websites = []
            websitesId.map(websiteId => {
                websites.push(websitesMap.get(websiteId))
            })
            involvedCompany.company.websites = websites

            result.push(involvedCompany)
        })

        return {
            involvedCompanies: result,
        }

    }

    async getGameParentGame(gameParentGame) {
        if (!gameParentGame) {
            return {
                parentGame: null
            }
        }

        const gameParentGameData = await this.getData(
            "games",
            `fields id,name; where id = ${gameParentGame};`
        )

        return {
            parentGame: gameParentGameData[0]
        }
    }

    async getLogosAndWebsites(logosEndpoint, logosIds, websitesEndpoint, websitesIds) {
        const [
            logosData,
            websitesData,
        ] = await Promise.all([
            logosIds?.length > 0 ? this.getData(
                `${logosEndpoint}`,
                `fields image_id,width,height; where id = (${logosIds.join(",")});limit ${logosIds.length};`
            ) : [],
            websitesIds?.length > 0 ? this.getData(
                `${websitesEndpoint}`,
                `fields category,url; where id = (${websitesIds.join(",")});limit ${websitesIds.length};`
            ) : []
        ]);

        let logosMap = new Map()
        logosData.map(el => {
            logosMap.set(el.id, el)
        })

        let websitesMap = new Map()
        websitesData.map(el => {
            websitesMap.set(el.id, el)
        })

        return {logosMap, websitesMap}
    }

    async getGamePlatforms(gamePlatforms) {
        if (!gamePlatforms) {
            return {
                platforms: null
            }
        }

        const gamePlatformsData = await this.getData(
            "platforms",
            `fields abbreviation,name,slug;
                      where id = (${gamePlatforms.join(",")});
                      limit ${gamePlatforms.length};`
        )

        /*
        const platformsLogoIds = gamePlatformsData.map((el) => el.platform_logo);
        const uniquePlatformsLogoIds = [...new Set(platformsLogoIds)];

        const platformsWebsitesIds = gamePlatformsData.flatMap(el => el.websites);
        const uniquePlatformsWebsitesIds = [...new Set(platformsWebsitesIds)];

        const {
            logosMap,
            websitesMap
        } = await this.getLogosAndWebsites("platform_logos", uniquePlatformsLogoIds, "platform_websites", uniquePlatformsWebsitesIds)

        let result = []
        gamePlatformsData.map(el => {
            let platform = {
                ...el
            }

            delete platform.platform_logo
            delete platform.websites

            let websites = []
            el.websites.map(website => {
                websites.push(websitesMap.get(website))
            })

            const logoUrl = `https://images.igdb.com/igdb/image/upload/t_logo_med/`
            let logo = logosMap.get(el.platform_logo)
            logo.url = `${logoUrl}${logo.image_id}.png`
            delete logo.image_id
            platform = {
                ...platform,
                logo: logo,
                websites: websites
            }

            result.push(platform)
        })

        */
        return {
            platforms: gamePlatformsData,
        }
    }

    async getGamePlayerPerspectives(gamePlayerPerspectives) {
        if (!gamePlayerPerspectives) {
            return {
                playerPerspectives: null
            }
        }

        const gamePlayerPerspectivesData = await this.getData(
            "player_perspectives",
            `fields name, slug;
                      where id = (${gamePlayerPerspectives.join(",")});
                      limit ${gamePlayerPerspectives.length};`
        )

        return {
            playerPerspectives: gamePlayerPerspectivesData
        }
    }

    async getGameRemakes(gameRemakes) {
        if (!gameRemakes) {
            return {
                remakes: null
            }
        }

        const gameRemakesData = await this.getData(
            "games",
            `fields name; where id = (${gameRemakes.join(",")});limit ${gameRemakes.length};`
        )

        return {
            remakes: gameRemakesData
        }
    }

    async getGameRemasters(gameRemasters) {
        if (!gameRemasters) {
            return {
                remasters: null
            }
        }

        const gameRemastersData = await this.getData(
            "games",
            `fields name; where id = (${gameRemasters.join(",")});limit ${gameRemasters.length};`
        )

        return {
            remasters: gameRemastersData
        }
    }

    async getGameScreenshots(gameScreenshots) {
        if (!gameScreenshots) {
            return {
                screenshots: null
            }
        }

        const screenshotUrl = `https://images.igdb.com/igdb/image/upload/t_screenshot_big/`

        const gameScreenshotsData = await this.getData(
            "screenshots",
            `fields height,image_id,width;
                      where id = (${gameScreenshots.join(",")});
                      limit ${gameScreenshots.length};`
        )

        gameScreenshotsData.forEach(el => {
            el.url = `${screenshotUrl}${el.image_id}.png`
            delete el.image_id
        })

        return {
            screenshots: gameScreenshotsData
        }
    }

    async getGameSimilarGames(gameSimilarGames) {
        if (!gameSimilarGames) {
            return {
                similarGames: null
            }
        }

        const similarGamesData = await this.getData(
            "games",
            `fields name;
                      where id = (${gameSimilarGames.join(",")});
                      limit ${gameSimilarGames.length};`
        )

        return {
            similarGames: similarGamesData
        }
    }

    async getGameStandalones(gameStandalones) {
        if (!gameStandalones) {
            return {
                standalones: null
            }
        }

        const gameStandalonesData = await this.getData(
            "games",
            `fields name; where id = (${gameStandalones.join(",")});limit ${gameStandalones.length};`
        )

        return {
            standalones: gameStandalonesData
        }
    }

    async getGameThemes(gameThemes) {
        if (!gameThemes) {
            return {
                themes: null
            }
        }

        const gameThemesData = await this.getData(
            "themes",
            `fields name,slug; where id = (${gameThemes.join(",")});limit ${gameThemes.length};`
        )

        return {
            themes: gameThemesData
        }
    }

    async getGameVideos(gameVideos) {
        if (!gameVideos) {
            return {
                videos: null
            }
        }

        const gameVideosData = await this.getData(
            "game_videos",
            `fields name,video_id; where id = (${gameVideos.join(",")});limit ${gameVideos.length};`
        )

        return {
            videos: gameVideosData
        }
    }

    async getGameWebsites(gameWebsites) {
        if (!gameWebsites) {
            return {
                websites: null
            }
        }

        const gameWebsitesData = await this.getData(
            "websites",
            `fields *; where id = (${gameWebsites.join(",")});limit ${gameWebsites.length};`
        )

        return {
            websites: gameWebsitesData
        }
    }
}

module.exports = APIRequests