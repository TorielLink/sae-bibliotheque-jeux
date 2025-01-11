import React, {useState, useEffect} from "react"
import {RadioGroup, Radio, FormControl, FormControlLabel, Tooltip, Icon, IconButton} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import DeleteIcon from "@mui/icons-material/Delete";


function LogSessions({sessions}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const [error, setError] = useState(null)

    if (error) return <div>{error}</div>


    function formatDate(date) {
        const d = new Date(date)
        const day = String(d.getDate()).padStart(2, '0')
        const month = String(d.getMonth() + 1).padStart(2, '0')
        const year = d.getFullYear()
        return `${day}/${month}/${year}`
    }

    return (
        <div style={styles.container}>
            {
                sessions.map((session, index) => (
                    <div key={index} style={{
                        ...styles.session,
                        borderTopWidth: index === 0 ? '0px' : '0.1rem',
                        borderBottomWidth: index === sessions.length - 1 ? '0px' : '0.1rem'
                    }}>
                        <p style={styles.date}>{formatDate(session.session_date)}</p>
                        <h4 style={styles.title}>{session.title}</h4>
                    </div>
                ))
            }
        </div>
    )
}

const getStyles = (theme) => ({
    container: {
        boxShadow: `0 0 0.5rem ${theme.palette.colors.black}`,
        borderRadius: '0.25rem',
        background: theme.palette.background.default,
        overflow: 'hidden',
        overflowY: 'scroll',
    },
    session: {
        margin: '0',
        padding: '0.2rem',
        borderWidth: '0.1rem 0',
        borderColor: theme.palette.text.primary,
        borderStyle: 'solid',
        background: theme.palette.background.default,
        position: 'relative',
    },
    date: {
        fontSize: '0.8rem',
        margin: '0',
        opacity: '70%'
    },
    title: {
        margin: '0.2rem 0 0 0',
        width: '100%',
        fontWeight:'normal'
    },
})

export default LogSessions