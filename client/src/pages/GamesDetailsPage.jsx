import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"; // pour récupérer les paramètres de l'URL
import GameDetails from "../components/GameDetails.jsx";
import GameReviews from "../components/GameReviews.jsx";
import GameMedias from "../components/GameMedias.jsx";
// import GameLogs from '../components/GameLogs.jsx';
//const GameDataRetriever = require('../../../server/services/GameDataRetriever');

export default function GamesDetailsPage() {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                console.log(`Fetching game data for ID: ${id}`); // Log ID
                const response = await fetch(`http://localhost:8080/games/${id}`);
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);

                const data = await response.json();
                setGameData(data);
            } catch (err) {
                console.error('Erreur lors de la récupération des données du jeu :', err);
                setError('Impossible de charger les données du jeu.');
            } finally {
                setLoading(false);
            }
        };
        fetchGameData();
    }, [id]);

    if (loading) return <div>Chargement des données...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <GameDetails
                name={gameData.name}
                description={gameData.summary}
                releaseDate={gameData.releaseDate}
                ageRating={gameData.ageRating || "Non précisé"}
                rating={gameData.aggregatedRating}
                detailedSynopsis={gameData.storyline}
                platforms={gameData.platforms}
                genres={gameData.genres}
                coverImage={gameData.cover?.url || 'https://via.placeholder.com/300x400'}
            />
            <GameReviews />
            {/* TODO: si l'utilisateur est connecté : montrer "GameLogs" */}
            <GameMedias
                videos={gameData.videos}
                screenshots={gameData.screenshots}
            />
        </>
    );
}
