import React, { useState } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTheme } from '@mui/material/styles';

function SearchBar({
  searchText,
  setSearchText,
  handleSearchBack,
  handleSearchSubmit,
  isSearchActive,
  setSearchActive,
  isMobile,
  onGameSelect,
}) {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

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
    fetchSuggestions(query);
  };

  const handleSuggestionClick = (suggestion) => {
    console.log('Sélection :', suggestion);
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
      }}
    >
      {isSearchActive ? (
        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
          <IconButton onClick={handleSearchBack} sx={{ marginRight: '8px' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', maxWidth: '400px' }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Rechercher..."
              value={searchText}
              onChange={handleInputChange}
              autoFocus
              sx={{
                width: '100%',
                backgroundColor: theme.palette.background.paper,
                borderRadius: '4px',
                input: {
                  padding: '6px 10px',
                },
              }}
            />
          </Box>
        </Box>
      ) : (
        <IconButton onClick={() => setSearchActive(true)}>
          <SearchIcon />
        </IconButton>
      )}
      {/* Liste des suggestions */}
      {isSearchActive && suggestions.length > 0 && (
        <List
          sx={{
            position: 'absolute',
            top: '40px',
            left: 0,
            maxWidth: '400px',
            width: '100%',
            maxHeight: '300px',
            overflowY: 'auto',
            backgroundColor: theme.palette.background.paper,
            zIndex: 10,
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            borderRadius: '4px',
          }}
        >
          {suggestions.map((suggestion) => (
            <ListItem
              button
              key={suggestion.id}
              onClick={() => handleSuggestionClick(suggestion)}
              sx={{
                '&:hover': { backgroundColor: theme.palette.action.hover },
              }}
            >
              <ListItemText primary={suggestion.name} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}

export default SearchBar;
