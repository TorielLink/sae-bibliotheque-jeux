import React, { createContext, useState, useEffect } from 'react';
import { simulateLogin } from '../utils/authSimulator';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    } else if (process.env.NODE_ENV !== 'production') {
      simulateLogin();
      const simulatedUser = JSON.parse(localStorage.getItem('user'));
      const simulatedToken = localStorage.getItem('token');
      setIsAuthenticated(true);
      setUser(simulatedUser);
      setToken(simulatedToken);
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

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
