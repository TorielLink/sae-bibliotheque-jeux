import React, {useState, useEffect, useContext} from "react"
import {RadioGroup, Radio, FormControl, FormControlLabel, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {
    PlayCircleOutlined as Playing,
    SportsEsports as Played,
    PauseCircleOutlined as Paused,
    StopCircleOutlined as Stopped
} from "@mui/icons-material"
import Library from '../../assets/library-icon.svg?react'
import Wishlist from '../../assets/wishlist-icon.svg?react'
import {Grid, IconButton} from "@mui/material"
import GameLog from "./log-details-content/GameLog.jsx"
import ButtonSelector from "./log-details-content/ButtonSelector.jsx";

function GameLogDetails({userId, gameId, logData, gameName, gameCoverImage, currentLog, setCurrentLog}) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [selectedStatus, setSelectedStatus] = useState(0)

    useEffect(() => {
        const fetchGameStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8080/game-status/user/${userId}/game/${gameId}`)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

                const data = await response.json()
                setSelectedStatus(data.data[0].game_status_id)
            } catch (err) {
                console.error('Erreur lors de la récupération des données du status :', err)
                setError('Impossible de charger le status.')
            }
        }

        fetchGameStatus()
    }, [])

    return (
        <div style={styles.container}>
            <img
                src={gameCoverImage}
                alt={`${gameName} cover`}
                style={styles.coverImage}
            />
            <hr style={styles.separator}/>

            <ButtonSelector
                selectedItem={selectedStatus}
                setSelectedItem={setSelectedStatus}
                fetchUrl={`http://localhost:8080/status`}
                idName={'game_status_id'}
            />
            <hr style={styles.separator}/>

            <GameLog userId={userId} gameId={gameId} currentLog={currentLog} setCurrentLog={setCurrentLog}/>
            <hr style={styles.separator}/>

        </div>
    )
}

const getStyles = (theme) => ({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5em 0',
    },
    coverImage: {
        maxWidth: '80%',
        height: 'auto',
        maxHeight: '20%',
        marginBottom: '1.5em',
        borderRadius: '0.625em',
        boxShadow: '0 0.25em 0.5em rgba(0, 0, 0, 0.1)',
    },
    separator: {
        height: '0.15em',
        width: '100%',
        margin: '0',
        border: 'none',
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.text.primary
    },
    statusContainer: {
        padding: '0 1.5em'
    },
    icon: {
        fontSize: 40,
        color: theme.palette.text.primary,
        played: {
            color: theme.palette.colors.purple
        },
        playing: {
            color: theme.palette.colors.green
        },
        paused: {
            color: theme.palette.text.secondary
        },
        stopped: {
            color: theme.palette.colors.red
        },
    },
    iconImg: {
        width: '2.5rem',
        height: 'auto',
        fill: theme.palette.text.primary,
        library: {
            fill: theme.palette.colors.blue
        },
        wishlist: {
            fill: theme.palette.text.contrast
        },
    }
})

export default GameLogDetails