import React from "react"
import {TextField} from "@mui/material"
import {useTheme} from "@mui/material/styles"

function PlaytimeSetter({hours, setHours, minutes, setMinutes, timeCalculationMethod}) {
    const theme = useTheme()
    const styles = getStyles(theme)

    return (
        <div style={styles.inputContainer}>

            <TextField
                style={styles.input}
                id="hours"
                value={hours}
                onChange={setHours}
                placeholder="HH"
                size="small"
                disabled={timeCalculationMethod === 1}
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
                style={styles.input}
                id="minutes"
                placeholder="MM"
                value={minutes}
                onChange={setMinutes}
                size="small"
                disabled={timeCalculationMethod === 1}
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
    )
}

const getStyles = (theme) => ({
    inputContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },
    input: {
        margin: '0.2rem 0.5rem',
        width: '5rem',
        boxShadow: `0 0 0.2em 0.05em ${theme.palette.text.primary}`,
        borderRadius: '0.3rem',
        background: theme.palette.background.default,
    }
})

export default PlaytimeSetter