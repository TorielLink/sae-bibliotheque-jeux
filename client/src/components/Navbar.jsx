import React, { useState, useContext } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
} from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeContext } from '../theme/ThemeContext';
import SearchBar from './SearchBar';

function Navbar() {
  const theme = useTheme();
  const { toggleTheme, mode } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const isCatalogue = location.pathname === '/catalogue';
  const isAvis = location.pathname === '/avis';

  const [isSearchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);

  const handleSearchBack = () => {
    setSearchActive(false);
    setSearchText('');
    setSelectedGame(null);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Recherche soumise :', searchText);
    setSearchActive(false);
    setSearchText('');
  };

  const handleGameSelect = (game) => {
    console.log('Jeu sélectionné :', game.name, game.id);
    setSelectedGame(game);
    setSearchActive(false);
  };

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: theme.palette.background.default,
        padding: isMobile ? '4px' : '8px',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'nowrap',
          minHeight: isMobile ? '50px' : 'auto',
        }}
      >
        {/* Logo et texte SCRIB à gauche */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="logo"
            component={Link}
            to="/"
            sx={{ marginRight: 1 }}
          >
            <img
              src="/logo.png"
              alt="logo"
              style={{
                width: isMobile ? 20 : 50,
                height: isMobile ? 20 : 50,
              }}
            />
          </IconButton>
          {!isSearchActive && (
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontFamily: '"Roboto", sans-serif',
                fontWeight: 700,
                color: theme.palette.text.primary,
                fontSize: isMobile ? '1rem' : '1.8rem',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
              }}
            >
              SCRIB
            </Typography>
          )}
        </Box>

        {/* Navigation links and Search Bar */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isMobile && isSearchActive ? 'flex-start' : 'flex-end',
            flexGrow: 1,
          }}
        >
          {!isSearchActive || !isMobile ? (
            <>
              <Typography
                component={Link}
                to="/catalogue"
                sx={{
                  textDecoration: 'none',
                  color: isCatalogue
                    ? theme.palette.jaune.main
                    : theme.palette.text.primary,
                  fontSize: isMobile ? '0.75rem' : '1.1rem',
                  marginRight: '16px',
                }}
              >
                Catalogue
              </Typography>
              <Typography
                component={Link}
                to="/avis"
                sx={{
                  textDecoration: 'none',
                  color: isAvis
                    ? theme.palette.info.main
                    : theme.palette.text.primary,
                  fontSize: isMobile ? '0.75rem' : '1.1rem',
                }}
              >
                Avis
              </Typography>
            </>
          ) : null}

          <SearchBar
            searchText={searchText}
            setSearchText={setSearchText}
            handleSearchBack={handleSearchBack}
            handleSearchSubmit={handleSearchSubmit}
            isSearchActive={isSearchActive}
            setSearchActive={setSearchActive}
            isMobile={isMobile}
            onGameSelect={handleGameSelect} // Ajout de la fonction ici
          />
        </Box>

        {/* Bouton de connexion */}
        {!isSearchActive || !isMobile ? (
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{
              fontSize: isMobile ? '0.75rem' : '1rem',
              padding: isMobile ? '4px 8px' : '8px 16px',
              backgroundColor: theme.palette.green.main,
              color: theme.palette.white.main,
              marginLeft: '16px',
            }}
          >
            Se connecter
          </Button>
        ) : null}

        {/* Bouton de bascule de thème */}
        <IconButton
          onClick={toggleTheme}
          color="inherit"
          sx={{
            padding: isMobile ? '4px' : '8px',
            ml: isMobile ? '4px' : '8px',
          }}
        >
          {mode === 'light' ? (
            <DarkModeIcon
              sx={{
                fontSize: isMobile ? '20px' : '32px',
                color: theme.palette.text.primary,
              }}
            />
          ) : (
            <LightModeIcon
              sx={{
                fontSize: isMobile ? '20px' : '32px',
                color: theme.palette.text.primary,
              }}
            />
          )}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
