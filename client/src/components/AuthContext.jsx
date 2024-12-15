// src/components/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Ajout du state pour le token

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      console.log('Utilisateur chargé depuis le stockage local :', storedUser);
      setIsAuthenticated(true);
      setUser(storedUser);
      setToken(storedToken); // Initialisation du token
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setToken(token); // Mise à jour du token
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null); // Réinitialisation du token
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Fonctions de simulation de login et logout
export const simulateLogin = () => {
  const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsInVzZXJuYW1lIjoiSGVsbG8iLCJlbWFpbCI6Im5pY29sYXNlc3Rlcm1hbm4xMUBsaXZlLmZyIiwicHJvZmlsZV9waWN0dXJlIjoiL3VwbG9hZHMvcHJvZmlsZV9waWN0dXJlcy9wcm9maWxlX3BpY3R1cmUtcjE3MzM5MjQ5OTAxOTY1NzI4NDY0LmpwZyJ9.Ef1AlgYkKDhuTSAQEV9ZQ1mbtc1lUSK8EN7GTp3jAuM'; // Remplacez par un token JWT valide si possible
  const mockUser = {
    id: 22,
    username: 'Hello',
    email: 'nicolasestermann11@live.fr',
    profile_picture: '/uploads/profile_pictures/profile_picture-1733924990419-56578464.jpg',
  };

  // Stockez le token et l'utilisateur dans localStorage
  localStorage.setItem('token', mockToken);
  localStorage.setItem('user', JSON.stringify(mockUser));

  console.log('Utilisateur connecté simulé. Token ajouté à localStorage.');
};

export const simulateLogout = () => {
  // Supprimez les données de localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');

  console.log('Utilisateur déconnecté simulé. localStorage réinitialisé.');
};
