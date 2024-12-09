import React, { useState, useContext, useEffect } from 'react';
import { Avatar, Menu, MenuItem, IconButton, Divider } from '@mui/material';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

const UserMenu = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      console.log('Informations utilisateur récupérées :', user);
    }
  }, [isAuthenticated, user]); // Log les informations utilisateur lorsqu'elles changent

  // Ouvrir et fermer le menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); // Appeler la déconnexion du contexte
    handleMenuClose();
  };

  if (!isAuthenticated) return null; // Si l'utilisateur n'est pas connecté

  return (
    <>
      {/* Avatar utilisateur */}
      <IconButton onClick={handleMenuOpen} sx={{ p: 0,
      width: 50,
    height: 50,
        flexGrow: 1,

      }}>
        <Avatar
          alt={user.username}
          src={user.profile_picture ? `http://localhost:8080${user.profile_picture}` : null} // Utilise le chemin de l'image si disponible
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
        <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
          Profil
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/stats" onClick={handleMenuClose}>
          Mes statistiques
        </MenuItem>
        <MenuItem component={Link} to="/lists" onClick={handleMenuClose}>
          Mes listes
        </MenuItem>
        <MenuItem component={Link} to="/journals" onClick={handleMenuClose}>
          Mes journaux
        </MenuItem>
        <MenuItem component={Link} to="/reviews" onClick={handleMenuClose}>
          Mes avis
        </MenuItem>
        <MenuItem component={Link} to="/custom-lists" onClick={handleMenuClose}>
          Listes personnalisées
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/settings" onClick={handleMenuClose}>
          Paramètres
        </MenuItem>
        <MenuItem onClick={handleLogout} sx={{ color: 'red' }}>
          Me déconnecter
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
