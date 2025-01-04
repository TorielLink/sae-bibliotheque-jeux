import React, {useState, useEffect} from "react"
import {RadioGroup, Radio, FormControl, FormControlLabel, Tooltip} from "@mui/material"
import {useTheme} from "@mui/material/styles"

import {Grid2} from "@mui/material"
import * as FaIcons from 'react-icons/fa'
import * as SiIcons from 'react-icons/si'
import * as BsIcons from 'react-icons/bs'
import * as Io5Icons from 'react-icons/io5'
import * as PiIcons from 'react-icons/pi'

function ButtonSelector({disabled, selectedItem, setSelectedItem, fetchUrl, idName}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const [error, setError] = useState(null)

    const [data, setData] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(fetchUrl)
                if (!response.ok) throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)

                const data = await response.json()
                setData(data.data)
            } catch (err) {
                console.error('Erreur lors de la récupération des données :', err)
                setError('Impossible de charger les données.')
            }
        })()
    }, [fetchUrl])

    if (error) return <div>{error}</div>

    const handleItemChange = (event) => {
        setSelectedItem(Number(event.target.value))
    }

    return (

        <div style={styles.selectorContainer}>
            <RadioGroup
                row
                value={selectedItem[idName] ?? 0}
                onChange={handleItemChange}
            >
                <FormControl fullWidth>
                    {/*Utiliser le margin des FormControlLabel pour changer l'espacement*/}
                    <Grid2 container spacing={0} justifyContent="center">
                        {data.map((item, index) => {
                            const IconComponent =
                                FaIcons[item.icon] ||
                                SiIcons[item.icon] ||
                                BsIcons[item.icon] ||
                                Io5Icons[item.icon] ||
                                PiIcons[item.icon] ||
                                FaIcons.FaQuestionCircle

                            return (
                                <Grid2 key={index}>
                                    <Tooltip title={item.name} placement="top" arrow>
                                        <FormControlLabel
                                            value={item[idName] ?? 0}
                                            style={styles.controlLabel}
                                            control={
                                                <Radio
                                                    checkedIcon={
                                                        <IconComponent size={'2rem'}/>
                                                    }
                                                    icon={
                                                        <IconComponent size={'2rem'}/>
                                                    }
                                                    value={item[idName]}
                                                    checked={selectedItem === item[idName]}
                                                    disableTouchRipple
                                                    disabled={disabled}
                                                    style={styles.icon}
                                                    sx={{
                                                        transition: 'transform 0.1s',
                                                        '&:hover': {
                                                            transform: 'scale(1.2)',
                                                        },
                                                        '&.Mui-checked': {
                                                            color: 'none',
                                                            transform: 'scale(1.2)',
                                                            borderRadius: '0.5rem',
                                                            background: theme.palette.background.default,
                                                            boxShadow: '0 0 2px 1px #000000',
                                                        }
                                                    }}
                                                />
                                            }
                                            label=""
                                        />
                                    </Tooltip>
                                </Grid2>
                            )
                        })}
                    </Grid2>
                </FormControl>
            </RadioGroup>
        </div>
    )
}

const getStyles = (theme) => ({
    selectorContainer: {
        padding: '1rem 0',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    controlLabel: {
        //Pour controler l'espacement des icon et maintenir l'alignement entre les Grid item et les FormControlLabel
        margin: '0.25rem 0.5rem',
    },
    icon: {
        padding: '0.25rem',
        color: theme.palette.text.primary
    },
})

export default ButtonSelector