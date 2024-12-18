import React, {useEffect, useState} from "react";
import {FormControl, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import {useTheme} from "@mui/material/styles"


function LogPlaytime({playtime}) {
    const theme = useTheme()
    const styles = getStyles(theme)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [timeCalculationMethod, setTimeCalculationMethod] = useState('0')

    const handleItemChange = (event) => {
        setTimeCalculationMethod(event.target.value)
    }

    useEffect(() => {
        setHours(Math.floor(playtime / 60))
        setMinutes(playtime % 60)
    })

    return (

        <div style={styles.container}>
            <FormControl style={styles.form}>
                <FormLabel id="playtime-label" style={{...styles.label, ...styles.formTitle}}>Temps de jeu</FormLabel>
                <RadioGroup
                    aria-labelledby="playtime-label"
                    value={timeCalculationMethod}
                    onChange={handleItemChange}
                >
                    <div style={styles.radios}>
                        <div style={styles.radio}>
                            <FormLabel id="manual-label" style={styles.label}>Manuel</FormLabel>
                            <Radio
                                aria-labelledby="manual-label"
                                value={0}
                                disableTouchRipple
                            />
                        </div>
                        <div style={styles.radio}>
                            <FormLabel id="sessions-label" style={styles.label}>Sessions</FormLabel>
                            <Radio
                                aria-labelledby="sessions-label"
                                value={1}
                                disableTouchRipple
                            />
                        </div>
                    </div>
                    <div style={styles.texts}>
                        <TextField
                            style={styles.text}
                            id="hours"
                            placeholder="HH"
                            value={hours}
                            size="small"
                            disabled={timeCalculationMethod === '1'}
                            slotProps={{
                                htmlInput: {
                                    pattern: "\\d*",
                                    onKeyDown: (e) => {
                                        if (!/^\d$/.test(e.key) && e.key !== 'Backspace' && e.key !== 'Delete' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
                                            e.preventDefault()
                                        }
                                    },
                                    style: {
                                        textAlign: 'center',
                                        padding: '0.25rem 0.5rem',
                                    }
                                },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                            }}
                        />
                        <TextField
                            style={styles.text}
                            id="minutes"
                            placeholder="MM"
                            value={minutes}
                            size="small"
                            disabled={timeCalculationMethod === '1'}
                            slotProps={{
                                htmlInput: {
                                    maxLength: 2,
                                    style: {
                                        textAlign: 'center',
                                        padding: '0.25rem 0.5rem',
                                    }
                                },
                            }}
                            sx={{
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 'none',
                                },
                            }}
                        />
                    </div>
                </RadioGroup>
            </FormControl>
        </div>
    )
}

const getStyles = (theme) => ({
    container: {
        marginBottom: '1.5rem',
        padding: '0 1.5rem',
        fontFamily: theme.typography.fontFamily,
        color: theme.palette.text.primary,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
    },
    formTitle: {
        fontSize: '1.25rem',
        fontWeight: 'bold'
    },
    label: {
        width: '100%',
        textAlign: 'center',
        color: theme.palette.text.primary,
    },
    radios: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },
    radio: {
        flex: '0 0 auto',
    },
    texts: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    text: {
        margin: '0.2rem 0.5rem',
        width: '5rem',
        boxShadow: `0 0 0.2em 0.05em ${theme.palette.text.primary}`,
        borderRadius: '0.3rem',
        background: theme.palette.background.default,
    }
})

export default LogPlaytime
