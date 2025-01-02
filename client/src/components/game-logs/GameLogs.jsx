import React, {useContext, useEffect, useState} from "react"
import {useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import GameLogsTab from "./log-details-content/GameLogsTab.jsx"
import {FormatListBulleted, Info} from "@mui/icons-material"
import GameLogDetails from "./GameLogDetails.jsx"
import {AuthContext} from "../AuthContext.jsx"
import GameLogSessions from "./GameLogSessions.jsx"
import SessionEditor from "./SessionEditor.jsx"

function GameLogs({gameId, gameName, gameCoverImage}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const {isAuthenticated, user} = useContext(AuthContext)
    const [error, setError] = useState(null)
    const collapseButtonSize = 3

    if (!isAuthenticated) return (
        <div style={{
            textAlign: 'center'
        }}>
            <h1>Connectez-vous pour accéder à cette section</h1>
        </div>
    )


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
            console.error('Erreur lors de la récupération des données du status :', err)
            setError('Impossible de charger le status.')
        }
    }

    useEffect(() => {
        fetchData(`http://localhost:8080/game-status/user/${user.id}/game/${gameId}`, handleStatusChange, "game_status_id")
        fetchData(`http://localhost:8080/game-logs/user/${user.id}/game/${gameId}`, setLogs)
        fetchData(`http://localhost:8080/privacy-settings`, setPrivacySettings)
    }, [])

    const [currentStatus, setCurrentStatus] = useState(0)
    const handleStatusChange = (status) => {
        setCurrentStatus(status)
        saveStatusChange(
            user.id,
            gameId,
            {
                game_status_id: status
            }
        )
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

            const result = await response.json()
        } catch (error) {
            console.error('Error updating game status:', error)
        }
    }

    const [logs, setLogs] = useState([])
    const handleLogsChange = (newLogs) => {
        setLogs(newLogs)
    }

    const [currentLog, setCurrentLog] = useState(null)
    const handleCurrentLogChange = (log) => {
        setCurrentLog(log)
        if (!log) {
            setCurrentPrivacySetting(1)
            setCurrentPlatform(-1)
            handleCurrentSessionChange(-1)
        } else {
            setCurrentPrivacySetting(log.privacy_setting_id)
            setCurrentPlatform(log.platform_id)
            fetchData(`http://localhost:8080/game-sessions/log/${log.game_log_id}`, setSessions).then(newSessions => {
                handleCurrentSessionChange(-1)
            })
        }
    }

    const [privacySettings, setPrivacySettings] = useState([])
    const [currentPrivacySetting, setCurrentPrivacySetting] = useState(1)
    const handleCurrentPrivacySettingChange = (privacySettingId) => {
        setCurrentPrivacySetting(privacySettingId)
        savePrivacyChange(privacySettingId)
    }

    const savePrivacyChange = (privacySettingId) => {
        currentLog.privacy_setting_id = privacySettingId
    }

    const [currentPlatform, setCurrentPlatform] = useState(0)
    const handlePlatformChange = (platformId) => {
        setCurrentPlatform(platformId)
        savePlatformChange(platformId)
    }

    const savePlatformChange = (platformId) => {
        currentLog.platform_id = platformId
    }

    const [playtime, setPlaytime] = useState('')
    const handlePlaytimeChange = (playtime) => {
        setPlaytime(playtime)
    }

    const savePlaytime = (playtime) => {
        currentLog.time_played = playtime
    }

    const saveLogChanges = async (logId, updatedData) => {
        try {
            const response = await fetch(`http://localhost:8080/game-logs/update/${logId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })

            if (!response.ok) {
                throw new Error(`Failed to update game log: ${response.statusText}`)
            }

            const result = await response.json()
            // console.log('Game log updated successfully:', result)
        } catch (error) {
            console.error('Error updating game log:', error)
        }
    }


    useEffect(() => {
        if (currentLog) {

            logs.forEach((log) => {
                if (log.game_log_id === currentLog.game_log_id) {
                    log = currentLog
                }
            })

            saveLogChanges(
                currentLog.game_log_id,
                {
                    privacy_setting_id: currentLog.privacy_setting_id,
                    platform_id: currentLog.platform_id,
                    time_played: currentLog.time_played
                }
            )
        }

    }, [JSON.stringify(currentLog)])

    //------------------------------Changements sauvegardés------------------------------\\

    const [sessions, setSessions] = useState([])

    const [sessionsPlaytime, setSessionsPlaytime] = useState(0)
    const handleSessionsPlaytimeChange = (playtime) => {
        setSessionsPlaytime(playtime)
    }

    const [updatedSession, setUpdatedSession] = useState(false)
    const handleSessionUpdate = (value) => {
        setUpdatedSession(value)
        getSessionsPlaytime()
    }

    const [currentSession, setCurrentSession] = useState(-1)
    const handleCurrentSessionChange = (newSession) => {
        setCurrentSession(newSession)

        if (newSession !== -1) {
            handleSessionContentChange(newSession.content)
        }
    }

    const [sessionContent, setSessionContent] = useState(currentSession.content)
    const handleSessionContentChange = (newContent) => {
        setSessionContent(newContent)
    }

    const [sessionTitle, setSessionTitle] = useState(currentSession.title)
    const handleSessionTitleChange = (newTitle) => {
        setSessionTitle(newTitle)
    }

    const [timeCalculationMethod, setTimeCalculationMethod] = useState(0)
    const handleTimeCalculationMethodChange = (value) => {
        setTimeCalculationMethod(value)
        displayPlaytime(value, currentLog)
    }

    const displayPlaytime = (method, journal) => {
        if (method === 1) {
            handlePlaytimeChange(sessionsPlaytime)
        } else {
            handlePlaytimeChange(journal?.time_played || 0)
        }
    }

    useEffect(() => {
        getSessionsPlaytime()
    }, [sessions])

    function getSessionsPlaytime() {
        let time = 0
        sessions.map(session => {
            time += session.time_played
        })
        setSessionsPlaytime(time)
    }

    useEffect(() => {
        displayPlaytime(timeCalculationMethod, currentLog)
    }, [sessionsPlaytime])

    return (
        <div style={styles.container}>
            <div style={styles.logsContainer}>
                <GameLogsTab
                    collapseButtonSize={collapseButtonSize}
                    tabNumber={0}
                    tabBackground={'yellow'}
                    tabIcon={<Info/>}
                    tabContent={
                        <GameLogDetails
                            gameName={gameName}
                            gameCoverImage={gameCoverImage}

                            logs={logs}
                            setLogs={handleLogsChange}
                            sessions={sessions}

                            currentStatus={currentStatus}
                            setCurrentStatus={handleStatusChange}

                            currentLog={currentLog}
                            setCurrentLog={handleCurrentLogChange}

                            privacySettings={privacySettings}
                            currentPrivacySetting={currentPrivacySetting}
                            setCurrentPrivacySetting={handleCurrentPrivacySettingChange}

                            currentPlatform={currentPlatform}
                            setCurrentPlatform={handlePlatformChange}

                            playtime={playtime}
                            setPlaytime={setPlaytime}
                            savePlaytime={savePlaytime}

                            timeCalculationMethod={timeCalculationMethod}
                            setTimeCalculationMethod={handleTimeCalculationMethodChange}
                        />
                    }
                    additionalStyles={{
                        overflowY: 'auto',
                    }}
                />

                <GameLogsTab
                    collapseButtonSize={collapseButtonSize}
                    tabNumber={1}
                    tabBackground={'green'}
                    tabIcon={<FormatListBulleted/>}
                    tabContent={
                        <GameLogSessions
                            log={currentLog}
                            sessions={sessions}
                            currentSession={currentSession}
                            setCurrentSession={handleCurrentSessionChange}/>
                    }
                    additionalStyles={{
                        overflow: 'visible',
                    }}
                />

                <div style={styles.editor}>
                    <SessionEditor session={currentSession}

                                   updatedSession={updatedSession}
                                   setUpdatedSession={handleSessionUpdate}

                                   sessionContent={sessionContent}
                                   setSessionContent={handleSessionContentChange}

                                   sessionTitle={sessionTitle}
                                   setSessionTitle={handleSessionTitleChange}

                                   collapseButtonSize={collapseButtonSize}
                    />
                </div>
            </div>
        </div>
    )
}

const getStyles = (theme) => ({
    container: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        justifyContent: 'center',
        paddingBlock: '0rem',
        paddingInline: '5rem',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    logsContainer: {
        width: '100%',
        maxWidth: '200rem',
        height: '80vh',
        maxHeight: '75rem',
        background: theme.palette.background,
        boxShadow: `0 0 0.5em ${theme.palette.text.primary}`,
        borderRadius: '0.625em',
        overflow: 'hidden',
        display: 'flex',
        position: 'relative',
    },
    editor: {
        width: '100%'
    }
})

export default GameLogs