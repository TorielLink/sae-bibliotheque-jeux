import React, {useState, useEffect, useContext} from "react"
import {FormControl, InputLabel, MenuItem, OutlinedInput, Select, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {PowerInput} from "@mui/icons-material";

function GameLog({userId, gameId}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [currentLog, setCurrentLog] = useState(undefined)
    const [logs, setLogs] = useState(null)
    const [error, setError] = useState(null)


    useEffect(() => {
        const fetchLogData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/game-logs/user/${userId}/game/${gameId}`)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

                const data = await response.json()
                setLogs(data.data)
                if (logs)
                    setCurrentLog(logs[0])
            } catch (err) {
                console.error('Erreur lors de la récupération des données du status :', err)
                setError('Impossible de charger le status.')
            }
        }

        fetchLogData()
    }, [])


    const handleChange = (event) => {
        setCurrentLog(logs[event.target.value]);
        console.log('currentLog is : ', currentLog)
    };

    return (
        <div style={styles.container}>
            <FormControl style={styles.journalSelectorForm}>
                <Select
                    style={styles.journalSelector}
                    labelId="log-selector-label"
                    id="log-selector"
                    value={currentLog}
                    label="Journal"
                    input={<OutlinedInput/>}
                    onChange={handleChange}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    }}
                >
                    <MenuItem disabled value={-1}>
                        <em>Journal</em>
                    </MenuItem>
                    <MenuItem value={0}>Journal 1</MenuItem>
                    <MenuItem value={1}>Journal 2</MenuItem>
                </Select>
            </FormControl>
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
    journalSelectorForm: {},
    journalSelector: {
        boxShadow: `0 0 0.2em 0.05em ${theme.palette.text.primary}`,
        borderRadius: '0.3rem',
        background: theme.palette.background.default,
    },

})

export default GameLog