import React, {useContext, useEffect, useState} from "react"
import {useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import GameLogsTab from "./log-details-content/GameLogsTab.jsx"
import {FormatListBulleted, Info} from "@mui/icons-material"
import GameLogDetails from "./GameLogDetails.jsx"
import {AuthContext} from "../../AuthContext.jsx"
import GameLogSessions from "./GameLogSessions.jsx"
import SessionEditor from "./SessionEditor.jsx"
import GameDetailsNavBar from "../GameDetailsNavBar.jsx"

function GameLogs({game}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const {isAuthenticated, user} = useContext(AuthContext)
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
            setData(null)
            return null
        }
    }

    useEffect(() => {
        console.log('Game changed')
        fetchData(
            `${import.meta.env.VITE_BACKEND_URL}/game-status/user/${user.id}/game/${game.id}`,
            handleStatusChange,
            "game_status_id"
        );
        fetchData(
            `${import.meta.env.VITE_BACKEND_URL}/game-logs/user/${user.id}/game/${game.id}`,
            handleLogsChange
        );
        handleCurrentLogChange(null);
        fetchData(
            `${import.meta.env.VITE_BACKEND_URL}/privacy-settings`,
            setPrivacySettings
        );
    }, [game]);


    const [currentStatus, setCurrentStatus] = useState(0)
    const handleStatusChange = (status) => {
        setCurrentStatus(status || 0)
        if (status) {
            saveStatusChange(
                user.id,
                game.id,
                {
                    game_status_id: status
                }
            )
        }
    }

    const saveStatusChange = async (userId, gameId, body) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game-status/update/${userId}/${gameId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            })

            if (!response.ok) {
                throw new Error(`Failed to update game status: ${response.statusText}`)
            }

            await response.json()
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
            handlePlaytimeChange(0)
            handleCurrentSessionChange(-1)
        } else {
            setCurrentPrivacySetting(log.privacy_setting_id)
            setCurrentPlatform(log.platform_id)
            fetchData(`${import.meta.env.VITE_BACKEND_URL}/game-sessions/log/${log.game_log_id}`, setSessions).then(() => {
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
        setCurrentLog({
            ...currentLog,
            privacy_setting_id: privacySettingId,
        })
    }

    const [currentPlatform, setCurrentPlatform] = useState(0)
    const handlePlatformChange = (platformId) => {
        setCurrentPlatform(platformId)
        savePlatformChange(platformId)
    }

    const savePlatformChange = (platformId) => {
        setCurrentLog({
            ...currentLog,
            platform_id: platformId,
        })
    }

    const [playtime, setPlaytime] = useState('')
    const handlePlaytimeChange = (playtime) => {
        setPlaytime(playtime)
    }

    const savePlaytime = (playtime) => {
        setCurrentLog({
            ...currentLog,
            time_played: playtime,
        })
    }

    const saveLogChanges = async (logId, updatedData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game-logs/update/${logId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })

            if (!response.ok) {
                throw new Error(`Failed to update game log: ${response.statusText}`)
            }

            await response.json()
            console.log("Log updated successfully")
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
    }, [currentLog])

    const [sessions, setSessions] = useState([])
    const handleSessionsChange = (newSessions) => {
        const sortedSessions = newSessions.sort((a, b) => new Date(b.session_date) - new Date(a.session_date))
        setSessions(sortedSessions)
    }

    const [sessionsPlaytime, setSessionsPlaytime] = useState(0)

    const saveSessionPlaytime = (newPlaytime) => {
        setCurrentSession({...currentSession, time_played: newPlaytime})
    }

    const [currentSession, setCurrentSession] = useState(-1)
    const handleCurrentSessionChange = (newSession) => {
        setCurrentSession(newSession)

        if (newSession !== -1) {
            handleSessionContentChange(newSession.content)
        } else {
            handleSessionContentChange('')
        }
    }

    const [sessionContent, setSessionContent] = useState(currentSession?.content || '')
    const handleSessionContentChange = (newContent) => {
        setSessionContent(newContent)
    }

    const saveSessionContent = () => {
        setCurrentSession({...currentSession, content: sessionContent})
    }

    const [sessionTitle, setSessionTitle] = useState(currentSession?.title || '')
    const handleSessionTitleChange = (newTitle) => {
        setSessionTitle(newTitle)
    }

    const saveSessionTitle = () => {
        setCurrentSession({...currentSession, title: sessionTitle})
    }

    const displayPlaytime = (method, journal) => {
        if (method === 1) {
            handlePlaytimeChange(sessionsPlaytime)
        } else {
            handlePlaytimeChange(journal?.time_played || 0)
        }
    }

    function getSessionsPlaytime() {
        let time = 0
        sessions.map(session => {
            time += session.time_played
        })
        setSessionsPlaytime(time)
    }

    const [timeCalculationMethod, setTimeCalculationMethod] = useState(0)
    const handleTimeCalculationMethodChange = (value) => {
        setTimeCalculationMethod(value)
        displayPlaytime(value, currentLog)
    }

    useEffect(() => {
        getSessionsPlaytime()
    }, [sessions])

    useEffect(() => {
        displayPlaytime(timeCalculationMethod, currentLog)
    }, [sessionsPlaytime])

    useEffect(() => {
        if (currentSession !== -1) {
            const updatedSessions = sessions.map((session) => {
                if (session.game_session_id === currentSession.game_session_id) {
                    return {...session, ...currentSession}
                }
                return session
            })

            if (JSON.stringify(updatedSessions) !== JSON.stringify(sessions)) {

                setSessions(updatedSessions)

                saveSessionChanges(
                    currentSession.game_session_id,
                    {
                        title: currentSession.title,
                        content: currentSession.content,
                        time_played: currentSession.time_played
                    }
                )
            }
        }

    }, [currentSession])

    const saveSessionChanges = async (sessionId, updatedData) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game-sessions/update/${sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            })

            if (!response.ok) {
                throw new Error(`Failed to update game session: ${response.statusText}`)
            }

            await response.json()
        } catch (error) {
            console.error('Error updating game session:', error)
        }
    }

    const createNewSession = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game-sessions/create/${currentLog.game_log_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            })


            if (!response.ok) {
                throw new Error(`Failed to create session: ${response.statusText}`)
            }

            const result = await response.json()
            const newSessions = [...sessions, result.data]
            handleSessionsChange(newSessions)
            handleCurrentSessionChange(result.data)
            console.log('Session created successfully:', result)

        } catch (error) {
            console.error('Unexpected error:', error)
        }
    }

    const deleteSession = async (sessionId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game-sessions/delete/${sessionId}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                throw new Error(`Failed to delete session: ${response.statusText}`)
            }

            const result = await response.json()
            const newSessions = sessions.filter((session) => session.game_session_id !== sessionId)
            handleSessionsChange(newSessions)
            if (currentSession?.game_session_id === sessionId)
                setCurrentSession(-1)
            console.log('Session deleted successfully:', result)
        } catch (error) {
            console.error('Error deleting log:', error)
        }
    }

    return (
        <div style={{
            ...styles.container,
            ...(isMobile ? styles.mobile.container : {})
        }}>
            {!isMobile && (
                <div style={styles.navContainer}>
                    <GameDetailsNavBar activeSection={"logs"}/>
                </div>
            )}

            <div style={{
                ...styles.logsContainer,
                ...(isMobile ? styles.mobile.logsContainer : {})
            }}>
                <GameLogsTab
                    collapseButtonSize={collapseButtonSize}
                    tabNumber={0}
                    tabBackground={'yellow'}
                    tabIcon={<Info/>}
                    tabContent={
                        <GameLogDetails
                            userId={user.id}
                            gameId={game.id}

                            gameName={game.name}
                            gameCoverImage={game.cover.url}

                            logs={logs}
                            setLogs={handleLogsChange}

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
                            setCurrentSession={handleCurrentSessionChange}
                            createNewSession={createNewSession}
                            deleteSession={deleteSession}
                        />
                    }
                    additionalStyles={{
                        overflow: 'visible',
                    }}
                />

                <div style={{
                    ...styles.editor,
                    ...(isMobile ? styles.mobile.editor : {})
                }}>
                    <SessionEditor session={currentSession}

                                   sessionContent={sessionContent}
                                   setSessionContent={handleSessionContentChange}
                                   saveSessionContent={saveSessionContent}

                                   sessionTitle={sessionTitle}
                                   setSessionTitle={handleSessionTitleChange}
                                   saveSessionTitle={saveSessionTitle}

                                   saveSessionPlaytime={saveSessionPlaytime}

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
        flexDirection: 'column',
        justifyContent: 'center',
        paddingBlock: '0rem',
        paddingInline: '5rem',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    navContainer: {
        alignSelf: 'flex-end',
        marginBottom: '2%',
        marginTop: '2%'
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
        width: '100%',
    },
    mobile: {
        container: {
            paddingInline: '1rem',
        },
        navContainer: {},
        logsContainer: {},
        editor: {}
    },
})

export default GameLogs