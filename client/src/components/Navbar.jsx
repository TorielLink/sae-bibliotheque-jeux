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
import SearchBar from './SearchBar'; // Assurez-vous que le chemin est correct

function Navbar() {
  const theme = useTheme();
  const { toggleTheme, mode } = useContext(ThemeContext);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const isCatalogue = location.pathname === '/catalogue';
  const isAvis = location.pathname === '/avis';

  // État pour la zone de recherche
  const [isSearchActive, setSearchActive] = useState(false);
  const [searchText, setSearchText] = useState('');

  const handleSearchBack = () => {
    setSearchActive(false); // Désactive la recherche
    setSearchText(''); // Réinitialise le texte de recherche
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Recherche:', searchText);
    setSearchActive(false); // Ferme la boîte de recherche après la soumission
    setSearchText(''); // Réinitialise le champ après la recherche
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
                letterSpacing: '1px',
                fontSize: isMobile ? '1rem' : '1.8rem',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                marginRight: '16px', // Add spacing after the site name
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
            flexGrow: 1,
            justifyContent: isMobile && isSearchActive ? 'flex-start' : 'flex-end',
            transition: 'all 0.3s ease',
          }}
        >
          {!isSearchActive || !isMobile ? (
            <>
              <Typography
                variant="body2"
                component={Link}
                to="/catalogue"
                sx={{
                  textDecoration: 'none',
                  color: isCatalogue
                    ? theme.palette.jaune.main
                    : theme.palette.text.primary,
                  fontSize: isMobile ? '0.75rem' : '1.1rem',
                  fontWeight: isCatalogue ? '700' : '600',
                  whiteSpace: 'nowrap',
                  marginRight: '16px', // Space between Catalogue and Avis
                }}
              >
                Catalogue
              </Typography>
              <Typography
                variant="body2"
                component={Link}
                to="/avis"
                sx={{
                  textDecoration: 'none',
                  color: isAvis
                    ? theme.palette.info.main
                    : theme.palette.text.primary,
                  fontSize: isMobile ? '0.75rem' : '1.1rem',
                  fontWeight: isAvis ? '700' : '600',
                  whiteSpace: 'nowrap',
                }}
              >
                Avis
              </Typography>
            </>
          ) : null}

          {/* Search Bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              marginRight: isSearchActive && !isMobile ? '8px' : 0,
              flexGrow: isSearchActive && isMobile ? 1 : 0,
              transition: 'all 0.3s ease',
            }}
          >
            <SearchBar
              searchText={searchText}
              setSearchText={setSearchText}
              handleSearchBack={handleSearchBack}
              handleSearchSubmit={handleSearchSubmit}
              isSearchActive={isSearchActive}
              setSearchActive={setSearchActive}
              isMobile={isMobile}
            />
          </Box>

          {/* Bouton de connexion */}
          {!isSearchActive || !isMobile ? (
            <Button
              component={Link}
              to="/login"
              variant="contained"
              sx={{
                fontSize: isMobile ? '0.5rem' : '1rem', // Smaller text for mobile
                padding: isMobile ? '2px 4px' : '8px 16px',
                minWidth: isMobile ? '60px' : '130px',
                backgroundColor: theme.palette.green.main,
                color: theme.palette.white.main,
              }}
            >
              Se connecter
            </Button>
          ) : null}
        </Box>

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
