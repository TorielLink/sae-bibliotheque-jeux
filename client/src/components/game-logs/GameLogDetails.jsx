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
import GameStatus from "./log-details-content/GameStatus.jsx"
import GameLog from "./log-details-content/GameLog.jsx"

function GameLogDetails({userId, gameId, logData, gameName, gameCoverImage, currentLog, setCurrentLog}) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    return (
        <div style={styles.container}>
            <img
                src={gameCoverImage}
                alt={`${gameName} cover`}
                style={styles.coverImage}
            />
            <hr style={styles.separator}/>

            <GameStatus userId={userId} gameId={gameId}/>
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