import React, {useState} from 'react'
import {
    Box,
    TextField,
    List,
    CircularProgress,
    Typography
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import useMediaQuery from "@mui/material/useMediaQuery"

function GameSearch({
                        onSelect,
                        fontSize,
                        textPadding,
                        searchWidth,
                        searchHeight,
                        placeholder,
                        resultsHeight,
                    }) {
    const [loading, setLoading] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

    const [searchValue, setSearchValue] = useState()
    const [suggestions, setSuggestions] = useState([])
    const [displaySuggestions, setDisplaySuggestions] = useState(true)

    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([])
            return
        }
        setLoading(true)
        try {
            const response = await fetch(`http://localhost:8080/search?query=${query}`)
            if (!response.ok) {
                throw new Error(`Erreur API : ${response.status}`)
            }
            const data = await response.json()
            setSuggestions(data)
        } catch (error) {
            console.error('Erreur lors de la récupération des suggestions :', error.message)
            setSuggestions([])
        } finally {
            setLoading(false)
        }
    }

    const handleInputChange = (e) => {
        const query = e.target.value
        setSearchValue(query)
        fetchSuggestions(query)
    }

    const handleSuggestionClick = (gameId) => {
        console.log(gameId)
        onSelect(gameId)
        setSearchValue('')
        setDisplaySuggestions(false)
    }

    return (

        <Box
            tabIndex={0}
            sx={{
                position: 'relative',
                width: searchWidth,
                height: searchHeight,
                zIndex: 10,
            }}
            onFocus={() => setDisplaySuggestions(true)}
            onBlur={() => setDisplaySuggestions(false)}
        >
            <Box
                sx={{
                    display: 'flex',
                    position: 'relative',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                }}
            >
                <TextField
                    id="search-input"
                    variant="outlined"
                    size="small"
                    placeholder={placeholder}
                    value={searchValue}
                    fullWidth
                    onChange={handleInputChange}
                    sx={{
                        input: {
                            fontSize: fontSize,
                            height: searchHeight,
                            padding: textPadding,
                            borderRadius: '0.5rem',
                            border: 'none',
                            boxShadow: `0 0 0.2rem ${theme.palette.text.primary}`,
                        },
                        '& .Mui-focused': {
                            background: theme.palette.background.paper,
                        },
                        '& .MuiOutlinedInput-root': {
                            'fieldset': {
                                border: 'none'
                            },
                        },
                    }}
                />
                {loading && (
                    <CircularProgress
                        sx={{
                            width: searchHeight,
                            height: searchHeight,
                            marginLeft: '0.5em',
                        }}
                    />
                )}
            </Box>
            {displaySuggestions && suggestions.length > 0 && (
                <List
                    sx={{
                        position: 'absolute',
                        top: '100%',
                        width: '100%',
                        height: 'fit-content',
                        maxHeight: resultsHeight,
                        background: theme.palette.background.paper,
                        overflowY: 'auto',
                        boxShadow: `0 0 0.2rem ${theme.palette.text.primary}`,
                        zIndex: 10,
                        borderRadius: '0.5rem',
                        marginTop: '0.5rem',
                    }}
                >
                    {suggestions.map((result, index) => (
                        <Box key={result.id} onClick={() => handleSuggestionClick(result.id)}>
                            <ListItem
                                button
                                divider={index < suggestions.length - 1}
                                sx={{
                                    cursor: 'pointer',
                                    width: '100%',
                                    '&:hover': {
                                        background: theme.palette.background.primary
                                    },
                                }}>
                                <Typography sx={{display: 'inline', cursor: 'text'}}
                                            onClick={(e) => e.stopPropagation()}>
                                    {result.name}
                                </Typography>
                            </ListItem>
                        </Box>
                    ))}
                </List>
            )}
        </Box>
    )
}

export default GameSearch
