import React, {useState, useEffect, useContext} from 'react';
import {useParams} from "react-router-dom"; // pour récupérer les paramètres de l'URL
import GameDetails from "../components/game-details/GameDetails.jsx";
import GameReviews from "../components/game-details/GameReviews.jsx";
import GameMedias from "../components/game-details/GameMedias.jsx";
import {Box, CircularProgress, Typography, useMediaQuery} from "@mui/material";
import GameMobileQuickActions from "../components/game-details/GameMobileQuickActions.jsx";
import {useTheme} from "@mui/material/styles";
import MobileTabs from "../components/MobileTabs.jsx";
import GameLogs from '../components/game-details/game-logs/GameLogs.jsx';
import {AuthContext} from "../components/AuthContext.jsx";


/** TODO :
 - Faire la version mobile
 */
export default function GamesDetailsPage() {
    const {id} = useParams(); // Récupère l'ID depuis l'URL
    const [gameData, setGameData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const theme = useTheme();
    const {user} = useContext(AuthContext)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile);

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                setLoading(true);
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

    useEffect(() => {
        if (user)
            fetchData(`http://localhost:8080/game-status/user/${user.id}/game/${id}`, handleStatusChange, "game_status_id")
    }, [user]);

    const fetchData = async (url, setData, optionalId = false) => {
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

            const data = await response.json()
            if (optionalId) {
                setData(data.data[optionalId])
            } else {
                setData(data.data)
            }
            return data.data
        } catch (err) {
            setData(null)
            return null
        }
    }

    const [currentStatus, setCurrentStatus] = useState(0)
    const handleStatusChange = (status) => {
        setCurrentStatus(status || 0)
        if (status) {
            saveStatusChange(
                user.id,
                id,
                {
                    game_status_id: status
                }
            )
        }
    }

    const saveStatusChange = async (userId, gameId, body) => {
        try {
            const response = await fetch(`http://localhost:8080/game-status/update/${userId}/${gameId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                throw new Error(`Failed to update game status: ${response.statusText}`)
            }

            await response.json()
        } catch (error) {
            console.error('Error updating game status:', error)
        }
    }

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
            id={gameData.id}
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
            status={currentStatus}
            changeStatus={handleStatusChange}
        />,
        <GameReviews/>,
        <GameLogs
            game={gameData}
            status={currentStatus}
            changeStatus={handleStatusChange}
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
