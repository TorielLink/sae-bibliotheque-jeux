import React from 'react';
import { AppBar, Toolbar, IconButton, Typography, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function Navbar() {
  const theme = useTheme();

  // isMobile est une variable booléenne qui devient vraie lorsque la taille de l'écran est inférieure
  // au point de rupture défini par Material-UI pour les petits écrans (en dessous de 600px).
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default, padding: isMobile ? '4px' : '8px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '50px', padding: isMobile ? '0 8px' : '0 16px' }}>

        {/* Le logo redirige maintenant vers la page d'accueil */}
        <IconButton edge="start" color="inherit" aria-label="logo" component={Link} to="/" sx={{ mr: isMobile ? 0.5 : 2 }}>
          <img src="/logo.png" alt="logo" style={{ width: isMobile ? 20 : 30, height: isMobile ? 20 : 30 }} />
        </IconButton>

        {/* Les liens vers nos pages avec un texte plus grand */}
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: isMobile ? '8px' : '24px', flexGrow: 1 }}>
          <Typography
            variant="body2"
            component={Link}
            to="/catalogue"
            sx={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              fontSize: isMobile ? '1rem' : '1.4rem'  // Augmentation de la taille du texte
            }}>
            Catalogue
          </Typography>
          <Typography
            variant="body2"
            component={Link}
            to="/avis"
            sx={{
              textDecoration: 'none',
              color: theme.palette.text.primary,
              fontSize: isMobile ? '1rem' : '1.4rem'  // Augmentation de la taille du texte
            }}>
            Avis
          </Typography>
          <IconButton color="inherit">
            <SearchIcon sx={{ fontSize: isMobile ? '24px' : '32px', color: theme.palette.text.primary }} />
          </IconButton>
        </Box>

        {/* Bouton Se connecter */}
        <Button
          component={Link}
          to="/login"
          variant="contained"
          sx={{
            fontSize: isMobile ? '0.85rem' : '1.1rem',  // Augmentation de la taille du texte du bouton
            padding: isMobile ? '4px 12px' : '8px 16px',
            minWidth: isMobile ? '90px' : '130px',
            backgroundColor: theme.palette.green.main,
            color: theme.palette.white.main
          }}>
          Se connecter
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
