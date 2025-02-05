class TranslateRequests {
    // TODO: Changer l'URL de l'API quand on l'aura auto-hébergée
    constructor(apiUrl = "https://libretranslate.com", apiKey = "") {
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
        if (!data || !Array.isArray(data))
            throw new Error("Les données IGDB doivent être un tableau d'objets.");
        if (!sourceLang || !targetLang)
            throw new Error("Les paramètres 'sourceLang' et 'targetLang' sont requis.");

        try {
            const translatedData = [];

            for (const item of data) {
                const translatedItem = { ...item };

                for (const field of fieldsToTranslate)
                    if (translatedItem[field])
                        translatedItem[field] = await this.translateText(translatedItem[field], sourceLang, targetLang);

                translatedData.push(translatedItem);
            }
            return translatedData;
        } catch (error) {
            console.error("Erreur lors de la traduction des données IGDB :", error.message);
            return data; // Retourne les données non traduites en cas d'erreur
        }
    }
}

module.exports = { TranslateRequests };