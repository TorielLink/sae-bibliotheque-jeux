import React, {useState, useEffect} from 'react';
import {useParams} from "react-router-dom"; // pour récupérer les paramètres de l'URL
import GameDetails from "../components/game-details/GameDetails.jsx";
import GameReviews from "../components/game-details/GameReviews.jsx";
import GameMedias from "../components/game-details/GameMedias.jsx";
import {Box, CircularProgress, Typography, useMediaQuery} from "@mui/material";
import GameMobileQuickActions from "../components/game-details/GameMobileQuickActions.jsx";
import {useTheme} from "@mui/material/styles";
import MobileTabs from "../components/MobileTabs.jsx";
import GameLogs from '../components/game-details/game-logs/GameLogs.jsx';

export default function GamesDetailsPage() {
    const {id} = useParams();
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                setLoading(true);
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

    if (loading) return (
        <Box
            sx={{
                display: 'flex',
                flex: '1',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <CircularProgress/>
        </Box>
    )
    if (error) return <div>{error}</div>;

    const tabTitles = ["Détails", "Avis", "Journaux", "Médias"];
    const tabContents = [
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
        />,
        // Pass gameName along with gameId to GameReviews
        <GameReviews gameId={id} gameName={gameData.name}/>,
        <GameLogs
            game={gameData}
        />,
        <GameMedias
            videos={gameData.videos}
            screenshots={gameData.screenshots}
        />,
    ];

    return (
        <>
            <Typography variant="subtitle2" style={styles.breadcrumb}>
                Accueil &gt; {gameData.name}
            </Typography>

            {isMobile ? (
                <>
                    <GameMobileQuickActions/> {/* Boutons d'actions rapides */}
                    <MobileTabs tabTitles={tabTitles} tabContents={tabContents}/>
                </>
            ) : (
                <div style={styles.container}>
                    <div id="details">
                        {tabContents[0]}
                        <div style={styles.separatorContainerR}>
                            <div style={styles.separator}></div>
                        </div>
                    </div>
                    <div id="reviews">
                        {tabContents[1]}
                        <div style={styles.separatorContainerL}>
                            <div style={styles.separator}></div>
                        </div>
                    </div>
                    <div id="logs">
                        {tabContents[2]}
                        <div style={styles.separatorContainerL}>
                            <div style={styles.separator}></div>
                        </div>
                    </div>
                    <div id="medias">
                        {tabContents[3]}
                    </div>
                </div>
            )}
        </>
    );
}

const getStyles = (theme, isMobile) => ({
    container: {
        flex: '1',
    },
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
