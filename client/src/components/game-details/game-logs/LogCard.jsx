import React, {useState, useEffect, useRef} from "react"
import {RadioGroup, Radio, FormControl, FormControlLabel, Tooltip, Icon} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {BsController, BsJournal, BsJournalText} from "react-icons/bs";
import {IoGameController} from "react-icons/io5";
import {AccessTime, FormatListBulleted, Lock, LockOpen, OpenInBrowser} from "@mui/icons-material";
import * as FaIcons from "react-icons/fa";
import * as SiIcons from "react-icons/si";
import * as BsIcons from "react-icons/bs";
import * as Io5Icons from "react-icons/io5";
import * as PiIcons from "react-icons/pi";
import LockIcon from "@mui/icons-material/Lock";
import LogSessions from "./LogSessions.jsx";
import {useNavigate} from "react-router-dom";


function LogCard({gameData, logData, logIndex}) {
    const theme = useTheme()
    const styles = getStyles(theme, gameData)
    const navigate = useNavigate();
    const [error, setError] = useState(null)

    const [data, setData] = useState([])
    if (error) return <div>{error}</div>

    const textRef = useRef(null);
    const [isNameHidden, setIsNameHidden] = useState(false);
    useEffect(() => {
        if (textRef.current) {
            const element = textRef.current;
            setIsNameHidden(element.scrollWidth > element.clientWidth);
        }
    }, [gameData.name]);

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
        >
            <img src={gameData.cover} style={styles.image}/>
            <div style={{
                ...styles.fixedInformations,
                top: '1rem',
                left: '1rem',
            }}>
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
                <div onClick={handleNavigation}
                     onMouseEnter={() => setIsIconHovered(true)}
                     onMouseLeave={() => setIsIconHovered(false)}
                     style={{
                         ...styles.logInformations,
                         top: '1rem',
                         right: '1rem',
                         display: isCardHovered ? 'block' : 'none',
                         cursor: 'pointer',
                         transform: isIconHovered ? 'scale(1.2)' : 'scale(1)',
                         transition: 'transform 0.1s',
                     }}>
                    <Icon style={{...styles.icon, transform: "rotate(90deg)"}}>
                        <OpenInBrowser/>
                    </Icon>
                </div>
            </div>
            <div style={styles.informations}>
                <div style={styles.logInformations}>
                    <Icon style={styles.icon}>
                        <IoGameController style={styles.icon.inside}/>
                    </Icon>
                    {isNameHidden ? (
                        <Tooltip title={gameData.name} arrow>
                            <p ref={textRef} style={styles.label}>{gameData.name}</p>
                        </Tooltip>
                    ) : (
                        <p ref={textRef} style={styles.label}>{gameData.name}</p>
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
                            {getPlatformIcon()}
                        </Icon>
                    </div>
                </div>
                <LogSessions
                    logData={logData}
                />
            </div>
        </div>
    )
}

const getStyles = (theme, gameData) => ({
    container: {
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        background: theme.palette.background.paper,
        boxShadow: `0 0 0.5rem ${theme.palette.colors.black}`,
        borderRadius: '1rem',
        width: '35rem',
        height: '20rem',
        overflow: 'hidden'
    },
    image: {
        position: 'relative',
        width: '16rem',
        boxShadow: `0 0 0.25rem ${theme.palette.colors.black}`,
    },
    informations: {
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
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
    sessionContainer: {
        border: 'solid 1px red',
    },
})

export default LogCard