class DataRetriever {
    static #apiUrl = "https://api.igdb.com/v4";
    #clientId;
    #accessToken;

    constructor(clientId, accessToken) {
        this.#clientId = clientId;
        this.#accessToken = accessToken;
    }

    async fetchAPI(endpoint, queryBody) {
        const url = `${DataRetriever.#apiUrl}/${endpoint}`;
        const headers = {
            'Client-ID': this.#clientId,
            'Authorization': `Bearer ${this.#accessToken}`,
            'Content-Type': 'text/plain',
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: queryBody,
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error("Error fetching data from IGDB:", error);
            throw error;
        }
    }

    async getGameData(fields, filters = "", options = "") {
        const query = `fields ${fields}; ${filters} ${options}`;
        return await this.fetchAPI("games", query);
    }
}

module.exports = DataRetriever;
