import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom"; // pour récupérer les paramètres de l'URL
import GameDetails from "../components/GameDetails.jsx";
import GameReviews from "../components/GameReviews.jsx";
import GameMedias from "../components/GameMedias.jsx";
import {Typography, useMediaQuery} from "@mui/material";
import GameMobileQuickActions from "../components/GameMobileQuickActions.jsx";
import {useTheme} from "@mui/material/styles";
// import GameLogs from '../components/GameLogs.jsx';


/** TODO :
 - Faire la version mobile
 */
export default function GamesDetailsPage() {
    const { id } = useParams(); // Récupère l'ID depuis l'URL
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const styles = getStyles(theme, isMobile);

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
        <>
            <Typography variant="subtitle2"  style={styles.breadcrumb}>
                Accueil &gt; {gameData.name}
            </Typography>
            {/* Boutons d'actions rapides */}
            { isMobile && (
                <GameMobileQuickActions />
            )}
            <div id="details">
                <GameDetails
                    name={gameData.name}
                    description={gameData.summary}
                    releaseDate={gameData.releaseDate}
                    ageRating={gameData.ageRating || "Non précisé"}
                    rating={gameData.criticsAggregatedRating}
                    detailedSynopsis={gameData.storyline}
                    platforms={gameData.platforms}
                    genres={[...(gameData.genres || []), ...(gameData.themes || [])]}
                    coverImage={gameData.cover?.url || 'https://via.placeholder.com/300x400'}

                    dlcs={gameData.dlcs}
                    expansions={gameData.expansions}
                    remakes={gameData.remakes}
                    remasters={gameData.remasters}
                    standaloneExpansions={gameData.standalones}
                    franchises={gameData.franchises}
                    parentGame={gameData.parentGame}
                    similarGames={gameData.similarGames}
                />
                <div style={styles.separatorContainerR}>
                    <div style={styles.separator}></div>
                </div>
            </div>
            <div id="reviews">
                <GameReviews/>
                <div style={styles.separatorContainerL}>
                    <div style={styles.separator}></div>
                </div>
            </div>
            {/* TODO: si l'utilisateur est connecté : montrer "GameLogs" */}
            <div id="medias">
                <GameMedias
                    videos={gameData.videos}
                    screenshots={gameData.screenshots}
                />
            </div>
        </>
    );
}

const getStyles = (theme, isMobile) => ({
    breadcrumb: {
        color: theme.palette.colors.red,
        padding: isMobile ? "0.75em 0 0 0.75em" : "1.5em 0 0 1.5em",
        font: 'Inter',
        fontSize: isMobile ? "0.9em" : "1em",
    },
    separatorContainerR: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        marginBlock: '80px',
    },
    separatorContainerL: {
        display: 'flex',
        justifyContent: 'flex-start',
        width: '100%',
        marginBlock: '80px',
    },
    separator: {
        width: '85%',
        height: '2px',
        backgroundColor: theme.palette.colors.green,
    },
});
