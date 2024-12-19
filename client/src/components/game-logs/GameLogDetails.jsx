import React, {useState, useEffect} from "react"
import {RadioGroup, Radio, FormControl, useMediaQuery, Select, MenuItem, FormLabel, TextField} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import ButtonSelector from "./log-details-content/ButtonSelector.jsx";

function GameLogDetails({
                            gameName, gameCoverImage,
                            currentStatus, setCurrentStatus,
                            logs,
                            currentLog, setCurrentLog,
                            privacySettings,
                            currentPrivacySetting, setCurrentPrivacySetting,
                            currentPlatform, setCurrentPlatform,
                            playtime
                        }) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const handleLogChange = (event) => {
        setCurrentLog(logs.find((log) => log.game_log_id === Number(event.target.value)))
    }

    const handlePrivacyChange = (event) => {
        setCurrentPrivacySetting(privacySettings.find((privacySetting) => privacySetting.privacy_setting_id === Number(event.target.value)))
    }

    const [hours, setHours] = useState('')
    const handleHoursChange = (event) => {
        setHours(Number(event.target.value))
    }

    const [minutes, setMinutes] = useState('')
    const handleMinutesChange = (event) => {
        setMinutes(Number(event.target.value))
    }
    const formatMinutes = () => {
        setMinutes(minutes.toString().padStart(2, '0'))
    }

    const [timeCalculationMethod, setTimeCalculationMethod] = useState(0)
    const handleTimeCalculationMethodChange = (event) => {
        setTimeCalculationMethod(Number(event.target.value))
    }

    useEffect(() => {
        if (playtime !== 0) {
            setHours(Math.floor(playtime / 60))
            setMinutes(playtime % 60)
            formatMinutes()
        } else {
            setHours('')
            setMinutes('')
        }
    }, [playtime])

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
                <FormControl style={styles.horizontalSelector.form}>
                    <Select
                        style={{...styles.horizontalSelector.selector, ...styles.horizontalSelector.logSelector}}
                        id="log-selector"
                        value={currentLog?.game_log_id || -1}
                        size="small"
                        label="Journal"
                        variant="outlined"
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

                <FormControl style={styles.horizontalSelector.form}>
                    <Select
                        style={{...styles.horizontalSelector.selector, ...styles.horizontalSelector.privacySelector}}
                        id="log-selector"
                        value={currentPrivacySetting?.privacy_setting_id || 1}
                        label="Visibilité"
                        size="small"
                        variant="outlined"
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
                        {
                            privacySettings && privacySettings.map((privacy, index) => {
                                return (
                                    <MenuItem key={index} value={privacy.privacy_setting_id}>
                                        {privacy.name}
                                    </MenuItem>
                                )
                            })
                        }
                    </Select>
                </FormControl>

                <ButtonSelector
                    selectedItem={currentPlatform}
                    setSelectedItem={setCurrentPlatform}
                    fetchUrl={'http://localhost:8080/game-platforms'}
                    idName={'platform_id'}
                />

                <div style={styles.playtime.container}>
                    <FormControl style={styles.playtime.form}>

                        <FormLabel id="playtime-label" style={{...styles.playtime.label, ...styles.playtime.formTitle}}>
                            Temps de jeu
                        </FormLabel>

                        <RadioGroup
                            aria-labelledby="playtime-label"
                            value={timeCalculationMethod}
                            onChange={handleTimeCalculationMethodChange}
                        >
                            <div style={styles.playtime.radios}>
                                <div style={styles.playtime.radio}>
                                    <FormLabel id="manual-label" style={styles.playtime.label}>Manuel</FormLabel>
                                    <Radio
                                        aria-labelledby="manual-label"
                                        value={0}
                                        disableTouchRipple
                                    />
                                </div>
                                <div style={styles.playtime.radio}>
                                    <FormLabel id="sessions-label" style={styles.playtime.label}>Sessions</FormLabel>
                                    <Radio
                                        aria-labelledby="sessions-label"
                                        value={1}
                                        disableTouchRipple
                                    />
                                </div>
                            </div>
                        </RadioGroup>

                        <div style={styles.playtime.texts}>
                            <TextField
                                style={styles.playtime.text}
                                id="hours"
                                value={hours}
                                onChange={handleHoursChange}
                                placeholder="HH"
                                size="small"
                                disabled={timeCalculationMethod === 1}
                                slotProps={{
                                    htmlInput: {
                                        pattern: "\\d*",
                                        onKeyDown: (e) => {
                                            if (!/^\d$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                                e.preventDefault()
                                            }
                                        },
                                        style: {
                                            textAlign: 'center',
                                            padding: '0.25rem 0.5rem',
                                        }
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                            />
                            <TextField
                                style={styles.playtime.text}
                                id="minutes"
                                placeholder="MM"
                                value={minutes}
                                onChange={handleMinutesChange}
                                onBlur={formatMinutes}
                                size="small"
                                disabled={timeCalculationMethod === 1}
                                slotProps={{
                                    htmlInput: {
                                        maxLength: 2,
                                        style: {
                                            textAlign: 'center',
                                            padding: '0.25rem 0.5rem',
                                        }
                                    },
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                            />
                        </div>
                    </FormControl>
                </div>

            </div>

            {/*<hr style={styles.separator}/>*/}

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
    horizontalSelector: {
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
    },
    playtime: {
        container: {
            marginBottom: '1.5rem',
            padding: '0 1.5rem',
            fontFamily: theme.typography.fontFamily,
            color: theme.palette.text.primary,
        },
        form: {
            display: 'flex',
            flexDirection: 'column',
        },
        formTitle: {
            fontSize: '1.25rem',
            fontWeight: 'bold'
        },
        label: {
            width: '100%',
            textAlign: 'center',
            color: theme.palette.text.primary,
        },
        radios: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%'
        },
        radio: {
            flex: '0 0 auto',
        },
        texts: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
        },
        text: {
            margin: '0.2rem 0.5rem',
            width: '5rem',
            boxShadow: `0 0 0.2em 0.05em ${theme.palette.text.primary}`,
            borderRadius: '0.3rem',
            background: theme.palette.background.default,
        }
    }
})

export default GameLogDetails