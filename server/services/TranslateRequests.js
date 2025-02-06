class TranslateRequests {
    constructor(apiUrl = "http://localhost:5000", apiKey = "") {
        this.apiUrl = apiUrl;
        this.apiKey = apiKey;
    }

    async translateText(text, sourceLang, targetLang) {
        if (!text || !sourceLang || !targetLang)
            throw new Error("Les paramètres 'text', 'sourceLang' et 'targetLang' sont requis.");

        try {
            const response = await fetch(`${this.apiUrl}/translate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    q: text,
                    source: sourceLang,
                    target: targetLang,
                    format: "text",
                    api_key: this.apiKey
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Erreur HTTP ${response.status}: ${errorData.error || "Réponse invalide"}`);
            }

            const data = await response.json();
            if (!data || !data.translatedText)
                throw new Error("Réponse API invalide ou champ 'translatedText' manquant.")

            return data.translatedText;
        } catch (error) {
            console.error("Erreur lors de la traduction :", error.message);
            return null;
        }
    }

    async translateIGDBData(data, sourceLang, targetLang, fieldsToTranslate = []) {
        if (!data || typeof data !== 'object')
            throw new Error("Les données IGDB doivent être un tableau d'objets.");
        if (!sourceLang || !targetLang)
            throw new Error("Les paramètres 'sourceLang' et 'targetLang' sont requis.");
        try {
            const translatedData = {...data};

            for (const field of fieldsToTranslate)
                if (translatedData[field]) {
                    if (Array.isArray(translatedData[field])) {
                        const trad = await Promise.all(translatedData[field].map(async (item) => {
                            if (typeof item === 'string') {
                                return await this.translateText(item, sourceLang, targetLang)
                            } else if (typeof item === 'object' && item !== null) {
                                let translatedItem = {...item};
                                for (const key in translatedItem) {
                                    if (typeof translatedItem[key] === 'string') {
                                        translatedItem[key] = await this.translateText(translatedItem[key], sourceLang, targetLang)
                                    }
                                }
                                return translatedItem
                            }
                        }))
                        translatedData[field] = trad
                    } else {
                        translatedData[field] = await this.translateText(translatedData[field], sourceLang, targetLang);
                    }

                }

            return translatedData;
        } catch (error) {
            console.error("Erreur lors de la traduction des données IGDB :", error.message);
            return data; // Retourne les données non traduites en cas d'erreur
        }
    }
}

module.exports = {TranslateRequests};