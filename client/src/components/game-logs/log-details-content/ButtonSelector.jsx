import React, {useState, useEffect} from "react"
import {RadioGroup, Radio, FormControl, FormControlLabel, useMediaQuery} from "@mui/material"
import {useTheme} from "@mui/material/styles"

import {Grid, IconButton} from "@mui/material"
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io';
import * as PiIcons from 'react-icons/pi';
import * as SiIcons from 'react-icons/si';
import * as BsIcons from 'react-icons/bs';

function ButtonSelector({selectedItem, setSelectedItem, fetchUrl}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const [error, setError] = useState(null)

    const [data, setData] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(fetchUrl)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

                const data = await response.json()
                setData(data.data)
            } catch (err) {
                console.error('Erreur lors de la récupération des données :', err)
                setError('Impossible de charger les données.')
            }
        }

        fetchData()
    }, [])


    const handleItemChange = (event) => {
        // La property value est par convention une String. NE SURTOUT PAS ENLEVER LA CONVERSION
        setSelectedItem(Number(event.target.value))
    }


    return (

        <div style={styles.platformsContainer}>
            <RadioGroup
                row
                value={selectedPlatform}
                onChange={handleItemChange}
            >
                <FormControl fullWidth>
                    {/*Utiliser le margin des FormControlLabel pour changer l'espacement*/}
                    <Grid container spacing={0} justifyContent="center">
                        {data.map(({platform_id, name, icon}) => {

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
                                                    <IconComponent size={'1.5rem'}/>
                                                }
                                                icon={
                                                    <IconComponent size={'1.5rem'}/>
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
                                                    '&.Mui-checked': {
                                                        color: 'none',
                                                        transform: 'scale(1.2)',
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
        marginBottom: '1.5rem',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    controlLabel: {
        //Pour controler l'espacement des icon et maintenir l'alignement entre les Grid item et les FormControlLabel
        margin: '0.5rem',
    },
    icon: {
        color: theme.palette.text.primary
    },
})

export default ButtonSelector