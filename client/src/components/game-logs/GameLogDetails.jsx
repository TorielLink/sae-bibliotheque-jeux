import React, {useState} from "react"
import {RadioGroup, Radio, FormControl, FormControlLabel, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"
import {
    PlayCircleOutlined as Playing,
    SportsEsports as Played,
    PauseCircleOutlined as Paused,
    StopCircleOutlined as Stopped
} from "@mui/icons-material"
import Library from '../../assets/library-icon.svg?react'
import Wishlist from '../../assets/wishlist-icon.svg?react'
import {Grid, IconButton} from "@mui/material"; // Import necessary components

function GameLogDetails({name, coverImage}) {
    const theme = useTheme();
    const styles = getStyles(theme);
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [selectedStatus, setSelectedStatus] = useState('');

    const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    return (
        <div style={styles.container}>
            <img
                src={coverImage}
                alt={`${name} cover`}
                style={styles.coverImage}
            />
            <hr style={styles.separator}/>

            <div style={styles.statusContainer}>
                <RadioGroup
                    row
                    value={selectedStatus}
                    onChange={handleStatusChange}
                >
                    <FormControl fullWidth>
                        <Grid container spacing={1} justifyContent="center">
                            {[
                                {
                                    value: 'played',
                                    Icon: Played,
                                    baseStyle: styles.icon,
                                    selectedStyle: styles.icon.played
                                },
                                {
                                    value: 'playing',
                                    Icon: Playing,
                                    baseStyle: styles.icon,
                                    selectedStyle: styles.icon.playing
                                },
                                {
                                    value: 'library',
                                    Icon: Library,
                                    baseStyle: styles.iconImg,
                                    selectedStyle: styles.iconImg.library
                                },
                                {
                                    value: 'wishlist',
                                    Icon: Wishlist,
                                    baseStyle: styles.iconImg,
                                    selectedStyle: styles.iconImg.wishlist
                                },
                                {
                                    value: 'paused',
                                    Icon: Paused,
                                    baseStyle: styles.icon,
                                    selectedStyle: styles.icon.paused
                                },
                                {
                                    value: 'stopped',
                                    Icon: Stopped,
                                    baseStyle: styles.icon,
                                    selectedStyle: styles.icon.stopped
                                }
                            ].map(({value, Icon, baseStyle, selectedStyle}) => (
                                <Grid item key={value}>
                                    <FormControlLabel
                                        value={value}
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
            <hr style={styles.separator}/>

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
    coverImage: {
        maxWidth: '80%',
        height: 'auto',
        maxHeight: '20%',
        margin: '0',
        borderRadius: '0.625em',
        boxShadow: '0 0.25em 0.5em rgba(0, 0, 0, 0.1)',
    },
    separator: {
        height: '0.15em',
        width: '100%',
        margin: '1em 0',
        border: 'none',
        backgroundColor: theme.palette.text.primary,
        color: theme.palette.text.primary
    },
    statusContainer: {
        padding: '0 1.5em'
    },
    icon: {
        fontSize: 40,
        color: theme.palette.text.primary,
        played: {
            color: theme.palette.colors.purple
        },
        playing: {
            color: theme.palette.colors.green
        },
        paused: {
            color: theme.palette.text.secondary
        },
        stopped: {
            color: theme.palette.colors.red
        },
    },
    iconImg: {
        width: '2.5rem',
        height: 'auto',
        fill: theme.palette.text.primary,
        library: {
            fill: theme.palette.colors.blue
        },
        wishlist: {
            fill: theme.palette.text.contrast
        },
    }
})

export default GameLogDetails