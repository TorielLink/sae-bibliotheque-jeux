import React, {useState, useEffect} from "react"
import {RadioGroup, Radio, FormControl, FormControlLabel, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {
    PlayCircleOutlined as Playing,
    SportsEsports as Played,
    PauseCircleOutlined as Paused,
    StopCircleOutlined as Stopped,
} from "@mui/icons-material"
import Library from '../../../assets/library-icon.svg?react'
import Wishlist from '../../../assets/wishlist-icon.svg?react'
import {Grid} from "@mui/material"

function GameStatus({userId, gameId}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [error, setError] = useState(null)

    const [selectedStatus, setSelectedStatus] = useState('')

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value)
    }

    useEffect(() => {
        const fetchGameStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8080/game-status/user/${userId}/game/${gameId}`)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

                const data = await response.json()
                setSelectedStatus(data.data[0].status.name)
                console.log(data)
            } catch (err) {
                console.error('Erreur lors de la récupération des données du status :', err)
                setError('Impossible de charger le status.')
            }
        }

        fetchGameStatus()
    }, [])

    const status = [
        {
            value: 'Played',
            Icon: Played,
            baseStyle: styles.icon,
            selectedStyle: styles.icon.played
        },
        {
            value: 'Playing',
            Icon: Playing,
            baseStyle: styles.icon,
            selectedStyle: styles.icon.playing
        },
        {
            value: 'Library',
            Icon: Library,
            baseStyle: styles.iconImg,
            selectedStyle: styles.iconImg.library
        },
        {
            value: 'Wishlist',
            Icon: Wishlist,
            baseStyle: styles.iconImg,
            selectedStyle: styles.iconImg.wishlist
        },
        {
            value: 'Paused',
            Icon: Paused,
            baseStyle: styles.icon,
            selectedStyle: styles.icon.paused
        },
        {
            value: 'Stopped',
            Icon: Stopped,
            baseStyle: styles.icon,
            selectedStyle: styles.icon.stopped
        }
    ]


    return (
        <div style={styles.statusContainer}>
            <RadioGroup
                row
                value={selectedStatus}
                onChange={handleStatusChange}
            >
                <FormControl fullWidth>
                    {/*Utiliser le margin des FormControlLabel pour changer l'espacement*/}
                    <Grid container spacing={0} justifyContent="center">
                        {status.map(({value, Icon, baseStyle, selectedStyle}) => (
                            <Grid item key={value} style={styles.gridItem}>
                        <FormControlLabel
                            value={value}
                            style={styles.controlLabel}
                            control={
                                <Radio
                                    checkedIcon={
                                        <Icon style={{
                                            ...baseStyle,
                                            ...selectedStyle
                                        }}/>}
                                    icon={<Icon style={baseStyle}/>}
                                    value={value}
                                    checked={selectedStatus === value}
                                    onChange={handleStatusChange}
                                    disableTouchRipple
                                    sx={{
                                        transition: 'transform 0.1s',
                                        '&:hover': {
                                            background: 'none',
                                            transform: 'scale(1.2)',
                                        },
                                        '&:active': {
                                            transform: 'scale(1.1)',
                                        }
                                    }}
                                />
                            }
                            label=""
                        />
                    </Grid>
                    ))}
                </Grid>
            </FormControl>
        </RadioGroup>
</div>
)
}

const getStyles = (theme) => ({
    controlLabel: {
        //Pour controler l'espacement des icon et maintenir l'alignement entre les Grid item et les FormControlLabel
        margin: '0em',
    },
    statusContainer: {
        padding: '0 0.5em',
        fontFamily:
        theme.typography.fontFamily,
        color:
        theme.palette.text.primary,
    },
    iconSelected: {
        fontSize: 40,
        color:
        theme.palette.colors.blue,
    },
    icon: {
        fontSize: 40,
        color:
        theme.palette.text.primary,
        played:
            {
                color: theme.palette.colors.purple
            }
        ,
        playing: {
            color: theme.palette.colors.green
        }
        ,
        paused: {
            color: theme.palette.text.secondary
        }
        ,
        stopped: {
            color: theme.palette.colors.red
        }
        ,
    }
    ,
    iconImg: {
        width: '2.5rem',
        height:
            'auto',
        fill:
        theme.palette.text.primary,
        library:
            {
                fill: theme.palette.colors.blue
            }
        ,
        wishlist: {
            fill: theme.palette.text.contrast
        }
        ,
    }
})

export default GameStatus