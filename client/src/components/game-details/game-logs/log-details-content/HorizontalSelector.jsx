import React from "react"
import {FormControl, Select, MenuItem} from "@mui/material"
import {useTheme} from "@mui/material/styles"

function HorizontalSelector({
                                disabled,
                                label,
                                items,
                                itemId,
                                selectedItem, setSelectedItem,
                                isIndex,
                                defaultValue,
                                size,
                                value,
                                fontSize
                            }) {
    const theme = useTheme()
    const styles = getStyles(theme, fontSize)

    return (
        <div style={styles.selectorContainer}>
            <FormControl style={styles.form}>
                <Select
                    style={{...styles.selector}}
                    id="log-selector"
                    value={isIndex ? selectedItem : (selectedItem ? selectedItem[itemId] : defaultValue)}
                    size={size}
                    label={label}
                    variant="outlined"
                    onChange={setSelectedItem}
                    disabled={disabled}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    }}
                >
                    <MenuItem disabled value={-1}>
                        <em>{label}</em>
                    </MenuItem>
                    {
                        items && items.map((item, index) => (
                            <MenuItem key={index} value={item[itemId]}>
                                {item[value] ?? `${label} ${index + 1}`}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
        </div>
    )
}

const getStyles = (theme, fontSize) => ({
    form: {
        display: 'flex',
        alignItems: 'center',
    },
    selector: {
        boxShadow: `0 0 0.2em 0.05em ${theme.palette.text.primary}`,
        borderRadius: '0.3rem',
        background: theme.palette.background.default,
        fontSize: fontSize
    },
})

export default HorizontalSelector