// SearchBar.jsx
import React, { useState } from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
  Paper,
  Divider, // Importer Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';
import Collapse from '@mui/material/Collapse';

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
        position: 'relative', // Position relative pour le positionnement absolu des suggestions
        width: isMobile ? '100%' : 'auto',
        margin: 0, // Suppression des marges externes
        padding: 0, // Suppression des paddings
      }}
    >
      {/* Bouton de recherche ou de fermeture */}
      <IconButton
        onClick={() => setSearchActive(!isSearchActive)}
        sx={{
          padding: '2px', // Réduction du padding du bouton
          marginRight: '4px', // Espacement minimal entre les éléments
        }}
        aria-label={isSearchActive ? 'Fermer la recherche' : 'Ouvrir la recherche'}
      >
        {isSearchActive ? <CloseIcon /> : <SearchIcon />}
      </IconButton>

      {/* Conteneur relatif pour le champ de recherche et les suggestions */}
      <Box
        sx={{
          position: 'relative',
          width: isSearchActive ? (isMobile ? '100%' : '200px') : '0px', // Ajustez la largeur selon vos besoins
          transition: 'width 300ms ease-in-out',
          overflow: 'visible', // Assure que les suggestions ne sont pas cachées
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
              variant="outlined"
              size="small"
              placeholder="Rechercher..."
              value={searchText}
              onChange={handleInputChange}
              autoFocus
              sx={{
                width: '100%',
                input: {
                  padding: '6px 12px', // Ajustement pour éviter un champ trop grand
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: theme.palette.divider,
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
              }}
            />
            {loading && (
              <CircularProgress
                size={20}
                sx={{
                  marginLeft: '8px',
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
              position: 'absolute', // Position absolue par rapport au conteneur relatif
              top: '100%', // Directement sous la boîte de recherche
              left: '0', // Aligné à gauche du champ de recherche
              width: '100%', // Assurer que la largeur est de 100%
              maxHeight: '200px',
              overflowY: 'auto',
              backgroundColor: theme.palette.background.paper,
              zIndex: 10,
              boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
              borderRadius: '4px',
              marginTop: '4px', // Réduction du margin-top pour un meilleur alignement
            }}
          >
            <List>
              {suggestions.map((suggestion, index) => (
                <React.Fragment key={suggestion.id}>
                  <ListItem
                    button
                    onClick={() => handleSuggestionClick(suggestion)}
                    divider={index < suggestions.length - 1} // Ajouter un séparateur sauf pour le dernier élément
                    sx={{
                      '&:hover': { backgroundColor: theme.palette.action.hover },
                    }}
                  >
                    <ListItemText primary={suggestion.name} />
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
