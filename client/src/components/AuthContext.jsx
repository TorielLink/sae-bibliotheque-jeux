import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUser(parsedUser);
      setToken(storedToken);
    } else {
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    }
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  // Fonction de mise à jour qui fusionne les nouvelles données avec l'utilisateur existant
  // en conservant la propriété "id" du précédent utilisateur.
  const updateUserContext = (newData) => {
    setUser((prevUser) => {
        if (!prevUser) return newData;
        return {
            ...prevUser,   // Conserve les anciennes valeurs
            ...newData,     // Met à jour uniquement les champs modifiés
            id: prevUser.id // S'assure que `userId` ne soit jamais perdu
        };
    });

    // Mise à jour du localStorage pour rester en synchro
    setUser((prevUser) => {
        const updatedUser = {
            ...prevUser,
            ...newData,
            id: prevUser?.id,  // Conserve l'ID existant
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
    });
};


  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        setUser,
        updateUserContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
