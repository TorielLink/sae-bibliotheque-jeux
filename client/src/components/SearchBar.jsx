import React from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

function SearchBar({
  searchText,
  setSearchText,
  handleSearchBack,
  handleSearchSubmit,
  isSearchActive,
  setSearchActive,
  isMobile,
}) {
  const theme = useTheme();

  const handleSearchClick = () => {
    setSearchActive(true);
  };

  return (
    <>
      {isSearchActive ? (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            marginLeft: isMobile ? 0 : '8px', // Keep it full-width for mobile
            padding: isMobile ? '4px 8px' : 0,
          }}
        >
          {/* Back arrow to exit search */}
          <IconButton
            onClick={handleSearchBack}
            sx={{
              marginRight: '8px',
              color: theme.palette.text.primary,
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          {/* Search input */}
          <Box
            component="form"
            onSubmit={handleSearchSubmit}
            sx={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <TextField
              variant="outlined"
              size="small"
              placeholder="Rechercher..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
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
        <IconButton
          onClick={handleSearchClick}
          color="inherit"
          sx={{
            padding: isMobile ? '4px' : '8px',
          }}
        >
          <SearchIcon
            sx={{
              fontSize: isMobile ? '20px' : '32px',
              color: theme.palette.text.primary,
            }}
          />
        </IconButton>
      )}
    </>
  );
}

export default SearchBar;
