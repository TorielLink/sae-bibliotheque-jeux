import React, { useState, useEffect } from 'react';
import {useParams} from 'react-router-dom';

const GameDetailsPage = () => {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                console.log(`Fetching game data for ID: ${id}`); // log ID
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
        <div>
            <h1>Détails du jeu</h1>
            <p>Nom du jeu : {gameData.name}</p>
            {/* Ajoutez d'autres informations ici */}
        </div>
    );
};

export default GameDetailsPage;
