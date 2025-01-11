import React, {useState, useEffect, useRef} from "react"
import {Tooltip, Icon, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {IoGameController} from "react-icons/io5";
import {AccessTime, CalendarMonth, Lock, LockOpen, OpenInBrowser} from "@mui/icons-material";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import * as Io5Icons from "react-icons/io5";
import * as PiIcons from "react-icons/pi";
import LogSessions from "./LogSessions.jsx";
import {useNavigate} from "react-router-dom";


function LogCard({logData}) {
    const theme = useTheme()
    const styles = getStyles(theme, logData)
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    const textRef = useRef(null);
    const [isNameHidden, setIsNameHidden] = useState(false);

    useEffect(() => {
        if (textRef.current) {
            const element = textRef.current;
            setIsNameHidden(element.scrollWidth > element.clientWidth);
        }
    }, []);

    const [isCardHovered, setIsCardHovered] = useState(false);

    function handleNavigation() {
        navigate(`/details/${logData.igdb_game_id}/#logs`)
    }

    const [isIconHovered, setIsIconHovered] = useState(false);

    function getFormattedTime() {
        const hours = Math.floor(logData?.time_played / 60) || 0
        const minutes = logData?.time_played % 60 || 0
        return String(hours).padStart(2, '0') + "h" + String(minutes).padStart(2, '0')
    }

    function getPlatformIcon() {
        const IconComponent =
            FaIcons[logData.platform.icon] ||
            SiIcons[logData.platform.icon] ||
            BsIcons[logData.platform.icon] ||
            Io5Icons[logData.platform.icon] ||
            PiIcons[logData.platform.icon] ||
            FaIcons.FaQuestionCircle

        return <IconComponent style={styles.icon.inside}/>
    }

    return (
        <div style={styles.container}
             onMouseEnter={() => setIsCardHovered(true)}
             onMouseLeave={() => setIsCardHovered(false)}
             onClick={() => isMobile ? handleNavigation() : undefined}
        >
            <div style={styles.background}></div>

            <div style={styles.informations}>
                <div onClick={handleNavigation}
                     onMouseEnter={() => setIsIconHovered(true)}
                     onMouseLeave={() => setIsIconHovered(false)}
                     style={{
                         ...styles.logInformations,
                         display: isCardHovered ? (isMobile ? 'none' : 'flex') : 'none',
                         alignItems: 'center',
                         justifyContent: 'center',
                         cursor: 'pointer',
                         transform: isIconHovered ? 'scale(1.05)' : 'scale(1)',
                         transition: 'transform 0.1s',
                     }}>
                    <Icon style={styles.icon}>
                        <OpenInBrowser/>
                    </Icon>
                    <p style={styles.label}>Aller au jeu</p>
                </div>

                <div style={styles.logInformations}>
                    <Icon style={styles.icon}>
                        <IoGameController style={styles.icon.inside}/>
                    </Icon>
                    {isNameHidden ? (
                        <Tooltip title={logData.game_name} arrow>
                            <p ref={textRef} style={styles.label}>{logData.game_name}</p>
                        </Tooltip>
                    ) : (
                        <p ref={textRef} style={styles.label}>{logData.game_name}</p>
                    )}
                </div>
                <div style={styles.doubleContainer}>
                    <div style={styles.logInformations}>
                        <Icon style={styles.icon}>
                            <AccessTime style={styles.icon.inside}/>
                        </Icon>
                        <p style={styles.label}>{getFormattedTime()}</p>
                    </div>
                    <div style={styles.logInformations}>
                        <Icon style={styles.icon}>
                            {
                                logData.privacy.privacy_setting_id === 1 ? (

                                    <Lock style={styles.icon.inside}/>
                                ) : (
                                    <LockOpen style={styles.icon.inside}/>
                                )
                            }
                        </Icon>
                    </div>
                </div>
                <div style={styles.doubleContainer}>
                    <div style={styles.logInformations}>
                        <Icon style={styles.icon}>
                            <CalendarMonth style={styles.icon.inside}/>
                        </Icon>
                        <p style={styles.label}>{logData.sessions.length} sessions</p>
                    </div>

                    <div style={styles.logInformations}>
                        <Icon style={styles.icon}>
                            {getPlatformIcon()}
                        </Icon>
                    </div>
                </div>
                <LogSessions
                    sessions={logData.sessions}
                />
            </div>
        </div>
    )
}

const getStyles = (theme, logData) => ({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        background: theme.palette.background.paper,
        boxShadow: `0 0 0.5rem ${theme.palette.colors.black}`,
        borderRadius: '1rem',
        height: '33rem',
        width: '25rem',
        overflow: 'hidden'
    },
    background: {
        position: 'absolute',
        backgroundImage: `url(${logData.game_cover})`,
        height: '33rem',
        width: '25rem',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(4px)',
    },
    image: {
        position: 'relative',
        width: '16rem',
        boxShadow: `0 0 0.25rem ${theme.palette.colors.black}`,
    },
    informations: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        padding: '1rem',
        gap: '1rem',
    },
    fixedInformations: {
        zIndex: '11',
        position: 'absolute',
        display: 'flex',
        gap: '1rem'
    },
    logInformations: {
        zIndex: '10',
        background: theme.palette.background.default,
        height: '2.75rem',
        width: 'fit-content',
        maxWidth: '100%',
        display: 'flex',
        padding: '0.5rem 0.5rem',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: `0 0 0.5rem ${theme.palette.colors.black}`,
        borderRadius: '0.25rem',
    },
    icon: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '2rem',
        width: '2rem',
        inside: {
            height: '100%',
            width: '100%',
        },
    },
    label: {
        width: '100%',
        height: 'fit-content',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: 'block',
    },
    doubleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
})

export default LogCard