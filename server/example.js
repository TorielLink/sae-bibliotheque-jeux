require('dotenv').config();
const DataRetriever = require('./services/DataRetriever');

const dataRetriever = new DataRetriever(process.env.CLIENT_ID, process.env.ACCESS_TOKEN)

async function example() {

    // Récupération des 50 premiers jeux triés par popularité
    // games : listes des jeux avec leur nom, les genres, la cover, la date de sortie
    // et la note moyenne (temporaire en attendant d'avoir les notes des utilisateurs)
    let data = await dataRetriever.getCatalogByPopularity(50, 0);

    // Récupération des des jeux 50 à 100 triés par sorties récentes
    data = await dataRetriever.getCatalogByDate(50, 50);

    // Récupère toutes les informations d'un jeu spécifique
    const game = await dataRetriever.getGameInfo('1942')
}

example()