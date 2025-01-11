import React, {useState} from "react"
import {Button, IconButton, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import DeleteIcon from '@mui/icons-material/Delete'
import {AddBox} from "@mui/icons-material"

function GameLogSessions({log, sessions, currentSession, setCurrentSession, createNewSession, deleteSession}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const [error, setError] = useState(null)

    const handleCurrentSessionChange = (newSession) => {
        setCurrentSession(newSession)
    }

    if (error) return <div>{error}</div>
    if (log === null) return (
        <div style={styles.noLog}>
            <p>Choisissez un journal</p>
        </div>
    )

    function formatDate(date) {
        const d = new Date(date)
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        return `${day}/${month}/${year}`
    }

    function handleNewSessionClick() {
        createNewSession()
    }

    function handleDeleteSessionClick(sessionId) {
        if (confirm('Voulez-vous vraiment supprime cette session ?'))
            deleteSession(sessionId)
    }

    return (
        <div style={styles.container}>
            <Button
                variant="outlined"
                size="large"
                startIcon={<AddBox/>}
                style={styles.newSession}
                onClick={handleNewSessionClick}
            >
                Nouvelle session
            </Button>
            <div style={styles.sessionsContainer}>
                {
                    sessions.map((session, index) => (
                        <div key={index} onClick={() => {
                            handleCurrentSessionChange(session)
                        }} style={{
                            ...styles.session,
                            ...(currentSession && currentSession.game_session_id === session.game_session_id ? styles.selectedSession : {})
                        }}>
                            <div style={styles.informations}>
                                <p style={styles.date}>{formatDate(session.session_date)}</p>
                                <h4 style={styles.title}>{session.title}</h4>
                            </div>
                            <div style={styles.actions}>
                                <IconButton
                                    size="medium"
                                    sx={{
                                        padding: '0',
                                        transition: 'transform 0.1s',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            color: theme.palette.colors.red
                                        },
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDeleteSessionClick(session.game_session_id)
                                    }}
                                >
                                    <DeleteIcon fontSize="inherit"/>
                                </IconButton>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

const getStyles = (theme) => ({
    noLog: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
        justifyContent: 'center',
        padding: '1.5rem 0',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        maxHeight: '100%',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    newSession: {
        margin: '0',
        borderWidth: '0.1rem 0',
        borderRadius: '0',
        borderColor: theme.palette.text.primary,
        background: theme.palette.background.default,
        width: '100%',
        height: '3rem',
        marginTop: '4rem',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    sessionsContainer: {
        borderColor: theme.palette.text.primary,
        padding: '0',
        width: '100%',
        borderWidth: '0.1rem 0',
        borderStyle: 'solid',
        borderRadius: '0',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'scroll',
    },
    session: {
        margin: '0',
        borderWidth: '0.1rem 0',
        borderColor: theme.palette.text.primary,
        borderStyle: 'solid',
        background: theme.palette.background.default,
        position: 'relative',
        cursor: 'pointer',
    },
    selectedSession: {
        position: 'relative',
        zIndex: 10,
        width: '100%',
        background: theme.palette.background.paper,
        boxShadow: `0 0 0.25rem ${theme.palette.text.primary}`,
        cursor: 'auto',
    },
    informations: {
        padding: '0.5rem 1rem',
    },
    date: {
        fontSize: '0.8rem',
        margin: '0',
        opacity: '70%'
    },
    title: {
        margin: '0.2rem 0 0 0',
        width: '100%'
    },
    actions: {
        display: 'flex',
        position: 'absolute',
        top: '5%',
        right: '5%',
        zIndex: 5,
    }
})

export default GameLogSessions