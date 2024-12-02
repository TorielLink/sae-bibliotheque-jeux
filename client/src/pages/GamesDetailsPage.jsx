import React, { useState, useEffect } from 'react';
import GameDetails from "../components/GameDetails.jsx";
import GameReviews from "../components/GameReviews.jsx";
import GameMedias from "../components/GameMedias.jsx";
// import GameLogs from '../components/GameLogs.jsx';
const GameDataRetriever = require('../../../server/services/GameDataRetriever');

export default function GamesDetailsPage(gameId) {
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                const retriever = new GameDataRetriever();
                const data = await retriever.getGameInfo(gameId);
                setGameData(data);
                setLoading(false); // Arrêter le chargement
            } catch (error) {
                console.error('Erreur lors de la récupération des données du jeu :', error);
                setLoading(false); // Arrêter le chargement même en cas d'erreur
            }
        };

        fetchGameData().then(() => {} );
    }, [gameId]); // lorsque `gameId` change

    if (loading) return <div>Chargement des données...</div>;
    if (!gameData) return <div>Impossible de charger les données du jeu.</div>;

    return (
        <>
            <GameDetails
                name={gameData.name}
                description={gameData.summary}
                releaseDate={gameData.releaseDate}
                ageRating={gameData.age_ratings?.[0]?.rating || "Non précisé"}
                rating={gameData.aggregated_rating}
                detailedSynopsis={gameData.storyline}
                platforms={gameData.platforms}
                genres={gameData.genres}
                coverImage={gameData.cover?.url || 'https://via.placeholder.com/300x400'}
            />
            <GameReviews />
            {/* TODO: if user connected : show "GameLogs" */}
            <GameMedias
                videos={gameData.videos}
                screenshots={gameData.screenshots}
            />
        </>
    );
};