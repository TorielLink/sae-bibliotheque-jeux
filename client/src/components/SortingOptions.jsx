import React from 'react';
import {FormControl, IconButton, MenuItem, Select, Typography} from "@mui/material";
import {VerticalAlignBottom, VerticalAlignTop} from "@mui/icons-material";
import {useTheme} from "@mui/material/styles";

function SortingOptions({
                            sortingOptions,
                            sortingOption,
                            handleSortingOptionChange,
                            sortingOrder,
                            handleSortingOrderChange
                        }) {


    const theme = useTheme()
    const styles = getStyles(theme)

    return (
        <div style={styles.sortingOptions}>
            <Typography fontSize={"large"}>Trier par</Typography>
            <FormControl style={styles.sortingOptionForm}>
                <Select
                    style={styles.sortingOptionSelector}
                    id="sort-selector"
                    value={sortingOption}
                    size={"small"}
                    variant="outlined"
                    onChange={(e) => handleSortingOptionChange(Number(e.target.value))}
                    sx={{
                        '& .MuiOutlinedInput-notchedOutline': {
                            border: 'none',
                        },
                    }}
                >
                    {
                        sortingOptions && sortingOptions.map((item, index) => (
                            <MenuItem key={index} value={index}>
                                {item.label}
                            </MenuItem>
                        ))
                    }
                </Select>
            </FormControl>
            <IconButton
                disableTouchRipple
                onClick={() => handleSortingOrderChange(!sortingOrder)}
                style={styles.sortingButton}
                sx={{
                    '&:hover': {
                        background: 'none',
                        transform: 'scale(1.2)',
                    },
                    '&:active': {
                        transform: 'scale(1)',
                    },
                }}
            >
                {sortingOrder ? (
                    <VerticalAlignBottom fontSize="large"></VerticalAlignBottom>
                ) : (
                    <VerticalAlignTop fontSize="large"></VerticalAlignTop>
                )}
            </IconButton>
        </div>
    )
}

const getStyles = (theme) => {
    return {
        sortingOptions: {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '100%',
            gap: '1rem',
        },
        sortingOptionForm: {
            display: 'flex',
            alignItems: 'center',
        },
        sortingOptionSelector: {
            boxShadow: `0 0 0.25em${theme.palette.colors.black}`,
            borderRadius: '1rem',
            background: theme.palette.background.paper,
            fontSize: "large"
        },
        sortingButton: {
            height: '100%',
            padding: '0',
            fontSize: "large",
            transition: 'transform 0.1s',
        },
    }
}

export default SortingOptions;