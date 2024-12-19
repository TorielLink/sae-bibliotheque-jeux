import React, {useState, useEffect, useContext} from "react"
import {
    Button,
    FormControl,
    FormControlLabel,
    Grid2,
    IconButton,
    Radio,
    RadioGroup,
    Tooltip,
    useMediaQuery
} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import * as Io5Icons from "react-icons/io5";
import * as PiIcons from "react-icons/pi";
import DeleteIcon from '@mui/icons-material/Delete';
import {AddBox, Edit, ModeEdit} from "@mui/icons-material";

function GameLogSessions({log, currentSession, setCurrentSession}) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [error, setError] = useState(null);
    const [sessions, setSessions] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/game-sessions/log/${log.game_log_id}`)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

                const data = await response.json()
                setSessions(data.data)
            } catch (err) {
                console.error('Erreur lors de la r�cup�ration des donn�es du jeu :', err)
                setError('Impossible de charger les donn�es du jeu.')
            }
        }

        fetchData()
    }, [log])

    const handleCurrentSessionChange = (newSession) => {
        setCurrentSession(newSession)
    }

    if (error) return <div>{error}</div>
    if (log === -1) return (
        <div style={styles.noLog}>
            <p>Veuillez choisir un journal</p>
        </div>
    )

    return (
        <div style={styles.container}>
            <div style={styles.sessionsContainer}>
                <Button variant="outlined" size="large" startIcon={<AddBox/>} style={styles.newSession}>
                    Nouveau journal
                </Button>
                {
                    sessions.map((session, index) => (
                        <div key={index} onClick={() => {
                            handleCurrentSessionChange(session)
                        }} style={{
                            ...styles.session,
                            ...(currentSession === session ? styles.selectedSession : {})
                        }}>
                            <div style={styles.informations}>
                                <p style={styles.date}>{session.session_date}</p>
                                <h4 style={styles.title}>{session.title}</h4>
                            </div>
                            <div style={styles.actions}>
                                <IconButton size="medium" sx={{
                                    padding: '0',
                                    transition: 'transform 0.1s',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        color: theme.palette.colors.blue
                                    },
                                }}>
                                    <Edit fontSize="inherit"/>
                                </IconButton>
                                <IconButton size="medium" sx={{
                                    padding: '0',
                                    transition: 'transform 0.1s',
                                    '&:hover': {
                                        transform: 'scale(1.1)',
                                        color: theme.palette.colors.red
                                    },
                                }}>
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
        justifyContent: 'center',
        padding: '1.5rem 0',
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
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    sessionsContainer: {
        borderColor: theme.palette.text.primary,
        marginTop: '4rem',
        padding: '0',
        width: '100%',
        borderWidth: '0.1rem 0',
        borderStyle: 'solid',
        borderRadius: '0',
        display: 'flex',
        flexDirection: 'column',
    },
    session: {
        margin: '0',
        borderWidth: '0.1rem 0',
        borderColor: theme.palette.text.primary,
        borderStyle: 'solid',
        background: theme.palette.background.default,
        position: 'relative',
        cursor:'pointer'
    },
    selectedSession: {
        position: 'relative',
        zIndex: 10,
        width: '102.5%',
        alignSelf: 'flex-start',
        borderRadius: '0 0.5rem 0.5rem 0',
        boxShadow: `0 0 0.5rem ${theme.palette.text.primary}`,
        cursor:'auto'
    },
    informations: {
        padding: '0.5rem 1rem',
    },
    date: {
        fontSize: '0.8rem',
        margin: '0',
        color: theme.palette.transparentColors[`black-70`]
    },
    title: {
        margin: '0.2rem 0 0 0',
        width: '100%'
    },
    actions: {
        display: 'flex',
        position: 'absolute',
        top: '5%',
        right: '5%'
    }
})

export default GameLogSessions