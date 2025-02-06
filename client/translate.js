const fs = require("fs");
const path = require("path");
const { TranslateRequests } = require("../server/services/TranslateRequests.js");

const LOCALES_DIR = path.join(__dirname, "locales");
const LANGUAGES = ["fr", "en", "de", "es"];
const SOURCE_LANG = "fr";

const translator = new TranslateRequests();

const loadJSON = (filePath) => {
    if (!fs.existsSync(filePath)) return {}; // Retourne un objet vide si le fichier n'existe pas
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
};

const saveJSON = (filePath, data) => {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
};

const translateFiles = async () => {
    const sourceFile = path.join(LOCALES_DIR, `${SOURCE_LANG}.json`);
    const sourceData = loadJSON(sourceFile);

    for (const targetLang of LANGUAGES) {
        if (targetLang === SOURCE_LANG) continue; // On ne traduit pas la langue source

        const targetFile = path.join(LOCALES_DIR, `${targetLang}.json`);
        const targetData = loadJSON(targetFile);

        for (const key in sourceData)
            if (!targetData[key] || targetData[key] === "TODO")
                try {
                    const translatedText = await translator.translateText(sourceData[key], SOURCE_LANG, targetLang);
                    targetData[key] = translatedText || sourceData[key]; // Si la traduction échoue, on garde la valeur originale
                } catch (error) {
                    console.error(`Erreur pour '${key}' (${SOURCE_LANG} → ${targetLang}) :`, error.message);
                }

        saveJSON(targetFile, targetData);
    }
};


translateFiles().then(() => {
    console.log("🎉 Traduction terminée ! Lancement de React...");
    process.exit(0); // Ferme le script proprement après exécution
}).catch((err) => {
    console.error("❌ Erreur lors de la traduction :", err);
    process.exit(1);
});
