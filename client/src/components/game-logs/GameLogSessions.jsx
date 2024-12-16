import React, {useState, useEffect, useContext} from "react"
import {useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"

function GameLogSessions({log}) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    return (
        <div style={styles.container}>
            <p>{log.game_log_id}</p>
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