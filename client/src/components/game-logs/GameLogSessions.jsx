import React, {useState, useEffect, useContext} from "react"
import {useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"

function GameLogSessions({log}) {
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

    if (error) return <div>{error}</div>

    return (
        <div style={styles.container}>
            {
                sessions.map((session, index) => (
                    <div key={index}>
                        <h5>{session.title}</h5>
                        <p>{session.session_date}</p>
                    </div>
                ))
            }
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
})

export default GameLogSessions