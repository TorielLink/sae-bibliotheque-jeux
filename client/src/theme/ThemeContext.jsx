import React, { createContext, useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles'; // Importer ThemeProvider de MUI
import { lightTheme, darkTheme } from './themes'; // Import des thèmes

export const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState('light'); // État pour gérer le mode (clair ou sombre)

  // Calculer le thème en fonction du mode
  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  // Fonction pour basculer entre les modes clair et sombre
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
