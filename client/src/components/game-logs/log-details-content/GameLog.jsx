import React, {useState, useEffect, useContext} from "react"
import {FormControl, InputLabel, MenuItem, OutlinedInput, Radio, RadioGroup, Select, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import ButtonSelector from "./ButtonSelector.jsx";
import LogPlaytime from "./LogPlaytime.jsx";

function GameLog({userId, gameId, currentLog, setCurrentLog}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [logs, setLogs] = useState(null)
    const [error, setError] = useState(null)
    const [playtime, setPlaytime] = useState(0)
    const [currentLogIndex, setCurrentLogIndex] = useState(-1)
    const [currentPrivacyIndex, setCurrentPrivacyIndex] = useState(-1)
    const [selectedPlatform, setSelectedPlatform] = useState(-1)

    useEffect(() => {
        const fetchData = async () => {
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

        fetchData()
    }, [userId, gameId])


    const handleLogChange = (event) => {
        setCurrentLog(logs[event.target.value])
        setCurrentLogIndex(event.target.value)
        setCurrentPrivacyIndex(logs[event.target.value].privacy.privacy_setting_id)
        setSelectedPlatform(logs[event.target.value].platform.platform_id)
        setPlaytime(logs[event.target.value].time_played)
    };

    const handlePrivacyChange = (event) => {
        setCurrentPrivacyIndex(event.target.value)
    };

    return (
        <div style={styles.logInformationsContainer}>
            <FormControl style={styles.form}>
                <Select
                    style={{...styles.selector, ...styles.logSelector}}
                    id="log-selector"
                    value={currentLogIndex}
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
                            <MenuItem key={log.game_log_id} value={index}>
                                {`Journal ${index + 1}`}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

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

            <ButtonSelector
                selectedItem={selectedPlatform}
                setSelectedItem={setSelectedPlatform}
                fetchUrl={'http://localhost:8080/game-platforms'}
                idName={'platform_id'}
            />

            <LogPlaytime playtime={playtime}/>
        </div>
    )
}

const getStyles = (theme) => ({
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

export default GameLog