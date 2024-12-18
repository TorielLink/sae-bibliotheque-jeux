import React, {useEffect, useContext, useState} from "react"
import {useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import GameLogsTab from "./GameLogsTab.jsx";
import {Info, FormatListBulleted} from "@mui/icons-material";
import GameLogDetails from "./GameLogDetails.jsx";
import {AuthContext} from "../AuthContext.jsx";
import GameLogSessions from "./GameLogSessions.jsx";

function GameLogs({gameId, gameName, gameCoverImage}) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const {isAuthenticated, user} = useContext(AuthContext)
    const [error, setError] = useState(null);
    const [logData, setLogData] = useState(null);
    const [currentLog, setCurrentLog] = useState(-1)
    const [currentSession, setCurrentSession] = useState(-1)

    useEffect(() => {
        const fetchGameData = async () => {
            try {
                console.log(`Fetching log data for user : `, user.id);
                //TODO : récupérer uniquement les logs de ce jeu

                const response = await fetch(`http://localhost:8080/game-logs/user/${user.id}`);
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`);

                const data = await response.json();
                setLogData(data[0]);
            } catch (err) {
                console.error('Erreur lors de la récupération des données du jeu :', err);
                setError('Impossible de charger les données du jeu.');
            }
        };

        fetchGameData();
    }, []);

    return (
        <div style={styles.container}>
            <div style={styles.logsContainer}>
                <GameLogsTab
                    tabNumber={0}
                    tabBackground={'yellow'}
                    tabIcon={<Info/>}
                    tabContent={<GameLogDetails userId={user.id} gameId={gameId} logData={logData} gameName={gameName}
                                                gameCoverImage={gameCoverImage} currentLog={currentLog}
                                                setCurrentLog={setCurrentLog}/>}
                />

                <GameLogsTab
                    tabNumber={1}
                    tabBackground={'blue'}
                    tabIcon={<FormatListBulleted/>}
                    tabContent={<GameLogSessions log={currentLog} currentSession={currentSession}
                                                 setCurrentSession={setCurrentSession}/>}
                />
            </div>
        </div>
    )
}

const getStyles = (theme) => ({
    container: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        paddingBlock: '0rem',
        paddingInline: '5rem',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    logsContainer: {
        width: '100%',
        height: '85vh',
        background: theme.palette.background,
        boxShadow: `0 0 0.5em ${theme.palette.text.primary}`,
        borderRadius: '0.625em',
        overflow: "hidden",
        display: 'flex',
        position: 'relative',
    },
})

export default GameLogs