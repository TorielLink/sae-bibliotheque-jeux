import React, {useState, useEffect, useContext} from "react"
import {FormControl, InputLabel, MenuItem, OutlinedInput, Select, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {PowerInput} from "@mui/icons-material";
import LogPlatform from "./LogPlatform.jsx";

function GameLog({userId, gameId, currentLog, setCurrentLog}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [logs, setLogs] = useState(null)
    const [error, setError] = useState(null)
    const [currentLogIndex, setCurrentLogIndex] = useState(-1)
    const [currentPrivacyIndex, setCurrentPrivacyIndex] = useState(-1)
    const [selectedPlatform, setSelectedPlatform] = useState(1)

    useEffect(() => {
        const fetchLogData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/game-logs/user/${userId}/game/${gameId}`)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

                const data = await response.json()
                setLogs(data.data)
            } catch (err) {
                console.error('Erreur lors de la récupération des données du status :', err)
                setError('Impossible de charger le status.')
            }
        }

        fetchLogData()
    }, [])


    const handleLogChange = (event) => {
        setCurrentLog(logs[event.target.value])
        setCurrentLogIndex(event.target.value)
        setCurrentPrivacyIndex(currentLog.privacy.privacy_setting_id)
        setSelectedPlatform(currentLog.platform.platform_id)
    };

    const handlePrivacyChange = (event) => {
        setCurrentPrivacyIndex(event.target.value)
    };

    return (
        <div style={styles.container}>
            <FormControl style={styles.logSettingsForm}>
                <Select
                    style={{...styles.selector, ...styles.logSelector}}
                    id="log-selector"
                    value={currentLogIndex}
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
                            <MenuItem key={log.game_log_id} value={index}>
                                {`Journal ${index + 1}`}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            <FormControl style={styles.logSettingsForm}>
                <Select
                    style={{...styles.selector, ...styles.privacySelector}}
                    id="log-selector"
                    value={currentPrivacyIndex}
                    label="Visibilité"
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

            <LogPlatform selectedPlatform={selectedPlatform} setSelectedPlatform={setSelectedPlatform}/>


        </div>
    )
}

const getStyles = (theme) => ({
    container: {
        display: 'flex',
        width: '100%',
        padding: '1.5rem',
        flexDirection: 'column',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    logSettingsForm: {
        display: 'flex',
        alignItems: 'center',
    },
    selector: {
        height: '2.5em',
        marginBottom: '1em',
        boxShadow: `0 0 0.2em 0.05em ${theme.palette.text.primary}`,
        borderRadius: '0.3rem',
        background: theme.palette.background.default,
    },
    logSelector: {
        fontSize: 'large'
    },
    privacySelector: {
        height: '2.5em',
    },

})

export default GameLog