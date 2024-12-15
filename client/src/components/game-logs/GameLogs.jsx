import React from "react"
import {useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import GameLogsTab from "./GameLogsTab.jsx";
import {Info, FormatListBulleted} from "@mui/icons-material";
import GameLogDetails from "./GameLogDetails.jsx";

function GameLogs({name, coverImage}) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    return (
        <div style={styles.container}>
            <div style={styles.logsContainer}>
                <GameLogsTab
                    tabNumber={0}
                    tabBackground={'yellow'}
                    tabIcon={<Info/>}
                    tabContent={<GameLogDetails name={name} coverImage={coverImage}/>}
                />
                <GameLogsTab
                    tabNumber={1}
                    tabBackground={'blue'}
                    tabIcon={<FormatListBulleted/>}
                />
            </div>
        </div>
    )
}

const getStyles = (theme) => ({
    container: {
        width: '100%',
        height: 'auto',
        display: 'flex',
        paddingBlock: '0em',
        paddingInline: '3em',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    logsContainer: {
        width: '100%',
        height: '85vh',
        background: theme.palette.background,
        boxShadow: `0 0 0.5em ${theme.palette.text.primary}`,
        borderRadius: '0.625em',
        overflow: "hidden",
        display: 'flex',
        position: 'relative',
    },
})

export default GameLogs