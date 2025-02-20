import React, {useState} from 'react';
import {
    Box,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    CircularProgress,
    Paper,
    Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import {useTheme} from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';
import useMediaQuery from "@mui/material/useMediaQuery";
import '../i18n';
import {useTranslation} from "react-i18next";

function SearchBar({
                       searchText, setSearchText, handleSearchBack, handleSearchSubmit, isSearchActive, setSearchActive,
                       onGameSelect,
                   }) {
    const {t} = useTranslation();
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Fonction de récupération des suggestions
    const fetchSuggestions = async (query) => {
        if (!query) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/search?query=${query}`);
            if (!response.ok) {
                throw new Error(`Erreur API : ${response.status}`);
            }
            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            console.error('Erreur lors de la récupération des suggestions :', error.message);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const query = e.target.value;
        setSearchText(query);
        fetchSuggestions(query); // Appel direct sans debounce
    };

    const handleSuggestionClick = (suggestion) => {
        onGameSelect(suggestion);
        setSearchActive(false); // Ferme la barre de recherche
        setSearchText(''); // Réinitialise le texte de recherche
    };

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                width: isMobile ? '100%' : 'auto',
                margin: 0,
                padding: 0,
            }}
        >
            {/* Bouton de recherche ou de fermeture */}
            <IconButton
                onClick={() => {
                    setSearchActive(!isSearchActive)
                    if (!isSearchActive) {
                        setTimeout(() => {
                            document.getElementById("search-input")?.focus();
                        }, 0);
                    }
                }}
                sx={{
                    padding: '2px',
                    marginRight: '4px',
                }}
                aria-label={isSearchActive ? 'Fermer la recherche' : 'Ouvrir la recherche'}
            >
                {isSearchActive ? <CloseIcon/> : <SearchIcon/>}
            </IconButton>

            {/* Conteneur relatif pour le champ de recherche et les suggestions */}
            <Box
                sx={{
                    position: 'relative',
                    width: isSearchActive ? (isMobile ? '100%' : '200px') : '0px',
                    transition: 'width 300ms ease-in-out',
                    overflow: 'visible',
                }}
            >
                {/* Champ de recherche avec animation Collapse */}
                <Collapse
                    in={isSearchActive}
                    orientation="horizontal"
                    sx={{
                        width: '100%',
                        transition: 'width 300ms ease-in-out',
                    }}
                >
                    <Box
                        component="form"
                        onSubmit={handleSearchSubmit}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        <TextField
                            id="search-input"
                            variant="outlined"
                            size="small"
                            placeholder={t("search")}
                            value={searchText}
                            onChange={handleInputChange}
                            autoFocus
                            sx={{
                                width: '100%',
                                input: {
                                    padding: '6px 12px',
                                },
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: theme.palette.colors.yellow,
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: theme.palette.colors.yellow,
                                    },
                                },
                            }}
                        />
                        {loading && (
                            <CircularProgress
                                size={20}
                                sx={{
                                    marginLeft: '0.5em',
                                }}
                            />
                        )}
                    </Box>
                </Collapse>

                {/* Liste des suggestions */}
                {isSearchActive && suggestions.length > 0 && (
                    <Paper
                        elevation={3}
                        sx={{
                            position: 'absolute',
                            top: '100%',
                            left: '0',
                            width: '100%',
                            maxHeight: '200px',
                            overflowY: 'auto',
                            backgroundColor: theme.palette.background.paper,
                            zIndex: 10,
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            borderRadius: '4px',
                            marginTop: '4px',
                        }}
                    >
                        <List>
                            {suggestions.map((suggestion, index) => (
                                <React.Fragment key={suggestion.id}>
                                    <ListItem
                                        button
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        divider={index < suggestions.length - 1}
                                        sx={{
                                            '&:hover': {backgroundColor: theme.palette.colors.yellow},
                                        }}
                                    >
                                        <ListItemText primary={suggestion.name}/>
                                    </ListItem>
                                </React.Fragment>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>
        </Box>
    );
}

export default SearchBar;
