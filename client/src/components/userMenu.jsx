import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import { AuthContext } from './AuthContext';
import { ThemeContext } from '../theme/ThemeContext';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext); // Extraction correcte de `theme` depuis ThemeContext
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Informations utilisateur récupérées :', user);
    }
  }, [isAuthenticated, user]);

  // Ouvrir et fermer le menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  if (!isAuthenticated) return null; // Ne rien afficher si l'utilisateur n'est pas connecté

  return (
    <>
      {/* Avatar utilisateur */}
      <IconButton onClick={handleMenuOpen} sx={{ p: 0, width: 50, height: 50, flexGrow: 1 }}>
        <Avatar
          alt={user.username}
          src={user.profile_picture ? `http://localhost:8080${user.profile_picture}` : null}
          sx={{ width: 40, height: 40 }}
        />
      </IconButton>

      {/* Menu déroulant */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        sx={{ mt: 2 }}
      >
        <MenuItem
          component={Link}
          to="/profile"
          onClick={handleMenuClose}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.purple.main,
            },
          }}
        >
          Profil
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          to="/stats"
          onClick={handleMenuClose}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.purple.main,
            },
          }}
        >
          Mes statistiques
        </MenuItem>
        <MenuItem
          component={Link}
          to="/lists"
          onClick={handleMenuClose}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.purple.main,
            },
          }}
        >
          Mes listes
        </MenuItem>
        <MenuItem
          component={Link}
          to="/journals"
          onClick={handleMenuClose}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.purple.main,
            },
          }}
        >
          Mes journaux
        </MenuItem>
        <MenuItem
          component={Link}
          to="/reviews"
          onClick={handleMenuClose}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.purple.main,
            },
          }}
        >
          Mes avis
        </MenuItem>
        <MenuItem
          component={Link}
          to="/custom-lists"
          onClick={handleMenuClose}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.purple.main,
            },
          }}
        >
          Listes personnalisées
        </MenuItem>
        <Divider />
        <MenuItem
          component={Link}
          to="/settings"
          onClick={handleMenuClose}
          sx={{
            '&:hover': {
              backgroundColor: theme.palette.purple.main,
            },
          }}
        >
          Paramètres
        </MenuItem>
        <MenuItem
          onClick={handleLogout}
          sx={{
            color: 'red',
            '&:hover': {
              backgroundColor: theme.palette.purple.main,
            },
          }}
        >
          Me déconnecter
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
