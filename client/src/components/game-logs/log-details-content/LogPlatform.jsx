import React, {useState, useEffect, useContext} from "react"
import {RadioGroup, Radio, FormControl, FormControlLabel, useMediaQuery, Tooltip} from "@mui/material"
import {useTheme} from "@mui/material/styles"

import {Grid, IconButton} from "@mui/material"
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import * as BsIcons from 'react-icons/bs';

function LogPlatform({selectedPlatform, setSelectedPlatform}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [error, setError] = useState(null)

    const [platforms, setPlatforms] = useState([])

    useEffect(() => {
        const fetchGameStatus = async () => {
            try {
                const response = await fetch(`http://localhost:8080/game-platforms`)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

                const data = await response.json()
                setPlatforms(data.data)
            } catch (err) {
                console.error('Erreur lors de la récupération des données du status :', err)
                setError('Impossible de charger le status.')
            }
        }

        fetchGameStatus()
    }, [])


    const handlePlatformChange = (event) => {
        // La property value est par convention une String. NE SURTOUT PAS ENLEVER LA CONVERSION
        setSelectedPlatform(Number(event.target.value))
    }


    return (

        <div style={styles.platformsContainer}>
            <RadioGroup
                row
                value={selectedPlatform}
                onChange={handlePlatformChange}
            >
                <FormControl fullWidth>
                    {/*Utiliser le margin des FormControlLabel pour changer l'espacement*/}
                    <Grid container spacing={0} justifyContent="center">
                        {platforms.map(({platform_id, name, icon}) => {

                            const IconComponent =
                                FaIcons[icon] ||
                                SiIcons[icon] ||
                                BsIcons[icon] ||
                                FaIcons.FaQuestionCircle
                            return (
                                <Grid item key={platform_id}>

                                    <FormControlLabel
                                        value={platform_id}
                                        style={styles.controlLabel}
                                        control={
                                            <Radio
                                                checkedIcon={
                                                    <IconComponent size={'2em'}/>
                                                }
                                                icon={
                                                    <IconComponent size={'2em'}/>
                                                }
                                                value={platform_id}
                                                checked={selectedPlatform === platform_id}
                                                disableTouchRipple
                                                style={styles.icon}
                                                sx={{
                                                    transition: 'transform 0.1s',
                                                    '&:hover': {
                                                        transform: 'scale(1.2)',
                                                    },
                                                    '&:active': {
                                                        transform: 'scale(1.1)',
                                                    },
                                                    '&.Mui-checked': {
                                                        color: 'none',
                                                        background: theme.palette.background.default,
                                                        boxShadow: '0 0 2px 1px #000000',
                                                    }
                                                }}
                                            />
                                        }
                                        label=""
                                    />
                                </Grid>
                            )
                        })}
                    </Grid>
                </FormControl>
            </RadioGroup>
        </div>
    )
}

const getStyles = (theme) => ({
    platformsContainer: {
        padding: '0',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    controlLabel: {
        //Pour controler l'espacement des icon et maintenir l'alignement entre les Grid item et les FormControlLabel
        margin: '0.1rem',
    },
    icon: {
        color: theme.palette.text.primary
    },
})

export default LogPlatform