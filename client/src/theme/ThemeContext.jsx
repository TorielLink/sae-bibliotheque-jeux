import React, { createContext, useMemo, useState } from 'react';
import { lightTheme, darkTheme } from './themes'; // Import des thèmes

export const ThemeContext = createContext();

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState('light'); // État pour gérer le mode (clair ou sombre)

  const theme = useMemo(() => (mode === 'light' ? lightTheme : darkTheme), [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light')); // Bascule entre clair et sombre
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
