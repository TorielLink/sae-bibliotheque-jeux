import React, {useEffect, useContext, useState} from "react"
import {useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import GameLogsTab from "./log-details-content/GameLogsTab.jsx";
import {Info, FormatListBulleted} from "@mui/icons-material";
import GameLogDetails from "./GameLogDetails.jsx";
import {AuthContext} from "../AuthContext.jsx";
import GameLogSessions from "./GameLogSessions.jsx";
import SessionEditor from "./SessionEditor.jsx";

function GameLogs({gameId, gameName, gameCoverImage}) {
    const theme = useTheme();
    const styles = getStyles(theme);
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


    const fetchData = async (url, setData) => {
        try {
            const response = await fetch(url)
            if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

            const data = await response.json()
            setData(data.data)
        } catch (err) {
            console.error('Erreur lors de la récupération des données du status :', err)
            setError('Impossible de charger le status.')
        }
    }

    useEffect(() => {
        fetchData(`http://localhost:8080/game-status/user/${user.id}/game/${gameId}`, handleStatusChange)
        fetchData(`http://localhost:8080/game-logs/user/${user.id}/game/${gameId}`, setLogs)
        fetchData(`http://localhost:8080/privacy-settings`, setPrivacySettings)
    }, [])

    const [currentStatus, setCurrentStatus] = useState(0)
    const handleStatusChange = (status) => {
        setCurrentStatus(status)
    }

    const [logs, setLogs] = useState([])
    const [currentLog, setCurrentLog] = useState(null)
    const handleCurrentLogChange = (log) => {
        setCurrentLog(log)
        handleCurrentPrivacySettingChange(log.privacy)
        handleCurrentPlatform(log.platform)
        handlePlaytimeChange(log.time_played)
        fetchData(`http://localhost:8080/game-sessions/log/${log.game_log_id}`, setSessions)
        handleCurrentSessionChange(-1)
    }

    const [privacySettings, setPrivacySettings] = useState([])
    const [currentPrivacySetting, setCurrentPrivacySetting] = useState(null)
    const handleCurrentPrivacySettingChange = (privacySetting) => {
        setCurrentPrivacySetting(privacySetting)
    }

    const [currentPlatform, setCurrentPlatform] = useState(0)
    const handleCurrentPlatform = (platform) => {
        setCurrentPlatform(platform)
    }

    const [playtime, setPlaytime] = useState(0)
    const handlePlaytimeChange = (playtime) => {
        setPlaytime(playtime)
    }

    const [sessions, setSessions] = useState([])

    const [currentSession, setCurrentSession] = useState(-1)
    const handleCurrentSessionChange = (newSession) => {
        setCurrentSession(newSession)

        if (newSession !== -1) {
            handleSessionContentChange(newSession.content)
            handlePlaytimeChange(newSession.playtime)
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

                            currentStatus={currentStatus}
                            setCurrentStatus={handleStatusChange}

                            logs={logs}
                            currentLog={currentLog}
                            setCurrentLog={handleCurrentLogChange}

                            privacySettings={privacySettings}
                            currentPrivacySetting={currentPrivacySetting}
                            setCurrentPrivacySetting={handleCurrentPrivacySettingChange}

                            currentPlatform={currentPlatform}
                            setCurrentPlatform={handleCurrentPlatform}

                            playtime={playtime}
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