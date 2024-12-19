import React, {useState, useEffect, useContext} from "react"
import {
    RadioGroup,
    Radio,
    FormControl,
    FormControlLabel,
    useMediaQuery,
    Select,
    OutlinedInput,
    MenuItem
} from "@mui/material"
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
import LogPlaytime from "./log-details-content/LogPlaytime.jsx";

function GameLogDetails({
                            userId, gameId, gameName, gameCoverImage,
                            currentStatus, setCurrentStatus,
                            logs,
                            currentLog, setCurrentLog
                        }) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const handleLogChange = (event) => {
        console.log(event.target.value)
        setCurrentLog(logs.find((log) => log.game_log_id === Number(event.target.value)))
    }

    return (
        <div style={styles.container}>
            <img
                src={gameCoverImage}
                alt={`${gameName} cover`}
                style={styles.coverImage}
            />
            <hr style={styles.separator}/>

            <ButtonSelector
                selectedItem={currentStatus}
                setSelectedItem={setCurrentStatus}
                fetchUrl={`http://localhost:8080/status`}
                idName={'game_status_id'}
            />
            <hr style={styles.separator}/>

            <div style={styles.logInformationsContainer}>
                <FormControl style={styles.form}>
                    <Select
                        style={{...styles.selector, ...styles.logSelector}}
                        id="log-selector"
                        value={currentLog?.game_log_id || -1}
                        size="small"
                        label="Journal"
                        input={<OutlinedInput/>}
                        onChange={handleLogChange}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                        }}
                    >
                        <MenuItem disabled value={-1}>
                            <em>Journal</em>
                        </MenuItem>
                        {
                            logs && logs.map((log, index) => (
                                <MenuItem key={index} value={log.game_log_id}>
                                    {`Journal ${index + 1}`}
                                </MenuItem>
                            ))
                        }
                    </Select>
                </FormControl>

                {/*
                <FormControl style={styles.form}>
                    <Select
                        style={{...styles.selector, ...styles.privacySelector}}
                        id="log-selector"
                        value={currentPrivacyIndex}
                        label="Visibilité"
                        size="small"
                        input={<OutlinedInput/>}
                        onChange={handlePrivacyChange}
                        sx={{
                            '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none',
                            },
                        }}
                    >
                        <MenuItem disabled value={-1}>
                            <em>Visibilité</em>
                        </MenuItem>
                        <MenuItem value={1}>Privé</MenuItem>
                        <MenuItem value={2}>Publique</MenuItem>

                    </Select>
                </FormControl>
                */}

                {/*
                <ButtonSelector
                    selectedItem={selectedPlatform}
                    setSelectedItem={setSelectedPlatform}
                    fetchUrl={'http://localhost:8080/game-platforms'}
                    idName={'platform_id'}
                />
                */}

                {/*
                <LogPlaytime playtime={playtime}/>
                */}

            </div>

            {/*<GameLog userId={userId} gameId={gameId} currentLog={currentLog} setCurrentLog={setCurrentLog}/>*/}
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
        maxWidth: '70%',
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
    logInformationsContainer: {
        display: 'flex',
        width: '100%',
        padding: '0',
        flexDirection: 'column',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
        marginTop: '1.5em',
    },
    form: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem'
    },
    selector: {
        boxShadow: `0 0 0.2em 0.05em ${theme.palette.text.primary}`,
        borderRadius: '0.3rem',
        background: theme.palette.background.default,
    },
    logSelector: {
        marginBottom: '0.5rem',
        fontSize: 'large'
    },
    privacySelector: {
        marginBottom: '0.5rem',
    },
})

export default GameLogDetails