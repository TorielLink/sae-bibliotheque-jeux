import React, {useState,useEffect, useContext} from "react"
import {Box, Button, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {KeyboardDoubleArrowLeft} from "@mui/icons-material";

function GameLogsTab({tabNumber, tabBackground, tabIcon, tabContent}) {
    const theme = useTheme();
    const styles = getStyles(theme, tabNumber, tabBackground);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const [isTabOpen, setIsTabOpen] = useState(true)

    const handleToggleTab = () => {
        setIsTabOpen(!isTabOpen);
    }

    return (
        <div style={{
            ...styles.container,
            zIndex: 10 - tabNumber
        }}>
            <div style={{
                ...styles.tabContainer,
                width: isTabOpen ? '17em' : '0',
            }}>
                <div style={styles.content}>
                    {tabContent}
                </div>
            </div>
            <button style={styles.tabCollapse} onClick={handleToggleTab}>
                {
                    isTabOpen ? (
                            <KeyboardDoubleArrowLeft style={styles.arrowIcon} sx={{
                                transition: 'transform 0.1s',
                                '&:hover': {
                                    transform: 'scale(1.2)',
                                },
                                '&:active': {
                                    transform: 'scale(1.1)',
                                }
                            }}/>
                        ) :
                        React.cloneElement(tabIcon, {
                            style: styles.customIcon,
                            sx: {
                                transition: 'transform 0.1s',
                                '&:hover': {
                                    transform: 'scale(1.2)',
                                },
                                '&:active': {
                                    transform: 'scale(1.1)',
                                }
                            }
                        })
                }
            </button>
        </div>
    )
}

const getStyles = (theme, tabNumber, tabBackground) => ({
    container: {
        width: 'auto',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
        position: 'relative',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    tabContainer: {
        height: '100%',
        background: theme.palette.transparentColors[`${tabBackground}-50`],
        boxShadow: `0.125em 0 0.125em ${theme.palette.text.secondary}`,
        borderRadius: '0 0 0.3em 0',
        overflow: 'hidden',
        transition: 'width 0.3s ease',
    },
    content: {
        height:'100%',
        overflowY:'auto'
    },
    tabCollapse: {
        border: 'none',
        width: '3em',
        height: '3em',
        padding: '0',
        background: theme.palette.transparentColors[`${tabBackground}-70`],
        boxShadow: `0.125em 0 0.125em ${theme.palette.text.secondary}`,
        borderRadius: '0 0.3em 0.3em 0',
        cursor: 'pointer',
        position: 'absolute',
        top: `${tabNumber * 4}em`,
        left: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    arrowIcon: {
        width: '100%',
        height: '100%',
        color: theme.palette.text.primary
    },
    customIcon: {
        padding: '10%',
        width: '100%',
        height: '100%',
        color: theme.palette.text.primary
    },
})

export default GameLogsTab