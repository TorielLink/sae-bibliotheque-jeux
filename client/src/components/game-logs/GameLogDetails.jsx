import React, {useState, useEffect} from "react"
import {RadioGroup, Radio, FormControl, useMediaQuery, FormLabel, IconButton} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import ButtonSelector from "./log-details-content/ButtonSelector.jsx";
import HorizontalSelector from "./log-details-content/HorizontalSelector.jsx";
import PlaytimeSetter from "./log-details-content/PlaytimeSetter.jsx";
import {Add, AddBox, Delete, Edit, PlusOne} from "@mui/icons-material";

function GameLogDetails({
                            userId,
                            gameId,
                            gameName, gameCoverImage,
                            currentStatus, setCurrentStatus,
                            logs, setLogs,
                            sessions,
                            currentLog, setCurrentLog,
                            privacySettings,
                            currentPrivacySetting, setCurrentPrivacySetting,
                            currentPlatform, setCurrentPlatform,
                            playtime, setPlaytime, savePlaytime,
                            timeCalculationMethod, setTimeCalculationMethod
                        }) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const handleLogChange = (event) => {
        setCurrentLog(logs.find((log) => log.game_log_id === Number(event.target.value)))
    }

    const handlePrivacyChange = (event) => {
        setCurrentPrivacySetting(Number(event.target.value))
    }

    const [hours, setHours] = useState('')
    const handleHoursChange = (event) => {
        const time = Number(event.target.value)
        setHours(time !== 0 ? Number(event.target.value) : '')
        setPlaytime(Number(event.target.value) * 60 + minutes)
    }

    const [minutes, setMinutes] = useState('')
    const handleMinutesChange = (event) => {
        setMinutes(Number(event.target.value))
        setPlaytime(Number(event.target.value) + 60 * hours)
    }

    const handleTimeCalculationMethodChange = (event) => {
        setTimeCalculationMethod(Number(event.target.value))
    }

    useEffect(() => {
        if (playtime !== 0) {
            setHours(playtime >= 60 ? Math.floor(playtime / 60) : '')
            setMinutes(playtime % 60)
        } else {
            setHours('')
            setMinutes('')
        }
    }, [playtime])

    const saveNewPlaytime = (event) => {
        const newPlaytime = Number(hours) * 60 + Number(minutes)
        savePlaytime(newPlaytime)
    }

    const handleDeleteLog = () => {
        if (confirm(`Voulez-vous vraiment supprimer ce journal ?`)) {
            deleteLog(currentLog.game_log_id)
        }
    }

    const deleteLog = async (logId) => {
        try {
            const response = await fetch(`http://localhost:8080/game-logs/delete/${logId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error(`Failed to delete log: ${response.statusText}`)
            }

            const result = await response.json()
            const newLogs = logs.filter((log) => log.game_log_id !== logId)
            setLogs(newLogs)
            setCurrentLog(null)
            console.log('Log deleted successfully:', result)
        } catch (error) {
            console.error('Error deleting log:', error)
        }
    }

    const handleCreateLog = () => {
        createLog(userId, gameId)
    }

    const createLog = async (userId, gameId) => {
        try {
            const response = await fetch(`http://localhost:8080/game-logs/create/user/${userId}/game/${gameId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            })

            if (!response.ok) {
                throw new Error(`Failed to create log: ${response.statusText}`)
            }

            const result = await response.json()
            const newLogs = [...logs, result.data]
            setLogs(newLogs)
            setCurrentLog(result.data)
            console.log('Log created successfully:', result)
        } catch (error) {
            console.error('Error creating log:', error)
        }
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

                <div style={styles.horizontalContainers}>
                    <div style={styles.logActionsContainer}>
                        <HorizontalSelector label={"Journal"}
                                            items={logs}
                                            itemId={"game_log_id"}
                                            selectedItem={currentLog}
                                            setSelectedItem={handleLogChange}
                                            defaultValue={-1}
                                            size={"small"}
                                            fontSize={"large"}
                        />

                        <IconButton
                            disableTouchRipple
                            onClick={handleCreateLog}
                            style={styles.actionButton}
                            sx={{
                                color: theme.palette.colors.green,
                                '&:hover': {
                                    background: 'none',
                                    transform: 'scale(1.2)',
                                },
                                '&:active': {
                                    transform: 'scale(1)',
                                },
                            }}>
                            <AddBox fontSize="large"/>
                        </IconButton>

                        <IconButton
                            disableTouchRipple
                            onClick={handleDeleteLog}
                            style={styles.actionButton}
                            sx={{
                                color: theme.palette.colors.red,
                                '&:hover': {
                                    background: 'none',
                                    transform: 'scale(1.2)',
                                },
                                '&:active': {
                                    transform: 'scale(1)',
                                },
                            }}>
                            <Delete fontSize="large"/>
                        </IconButton>
                    </div>

                    <HorizontalSelector label={"Visibilité"}
                                        items={privacySettings}
                                        itemId={"privacy_setting_id"}
                                        selectedItem={currentPrivacySetting}
                                        setSelectedItem={handlePrivacyChange}
                                        isIndex={true}
                                        defaultValue={1}
                                        size={"small"}
                                        value={"name"}
                    />
                </div>
                <ButtonSelector
                    selectedItem={currentPlatform}
                    setSelectedItem={setCurrentPlatform}
                    fetchUrl={'http://localhost:8080/game-platforms'}
                    idName={'platform_id'}
                />

                <div style={styles.playtime.container}>
                    <FormControl style={styles.playtime.form}>

                        <FormLabel id="playtime-label"
                                   style={{...styles.playtime.label, ...styles.playtime.formTitle}}>
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
                                    <FormLabel id="sessions-label"
                                               style={styles.playtime.label}>Sessions</FormLabel>
                                    <Radio
                                        aria-labelledby="sessions-label"
                                        value={1}
                                        disableTouchRipple
                                    />
                                </div>
                            </div>
                        </RadioGroup>

                        <div style={styles.playtime.texts}>
                            <PlaytimeSetter
                                hours={hours}
                                setHours={handleHoursChange}
                                minutes={minutes}
                                setMinutes={handleMinutesChange}
                                savePlaytime={saveNewPlaytime}
                                timeCalculationMethod={timeCalculationMethod} // autre chose que 1 ou 0 pour le playtime dans la session
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
    horizontalContainers: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        marginBottom: '0.5rem',
    },
    logActionsContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '0.5rem'
    },
    actionButton: {
        height: '100%',
        padding: '0',
        transition: 'transform 0.1s',
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