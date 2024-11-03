import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3', // Obligatoire pour primary
    },
    white: {
      main: '#ffffff', // Obligatoire si vous utilisez white.main
    },
    green: {
      main: '#4caf50', // Obligatoire si vous utilisez green.main
    },
    background: {
      default: '#ffffff',
      paper: '#f4f6f8',
    },
    text: {
      primary: '#333333', // Obligatoire si vous utilisez text.primary
      secondary: '#666666',
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // Obligatoire pour primary
    },
    white: {
      main: '#ffffff', // Obligatoire si vous utilisez white.main
    },
    green: {
      main: '#4caf50', // Obligatoire si vous utilisez green.main
    },
    background: {
      default: '#121212', // Fond sombre
      paper: '#1d1d1d',
    },
    text: {
      primary: '#ffffff', // Obligatoire si vous utilisez text.primary
      secondary: '#b3b3b3',
    },
  },
});
