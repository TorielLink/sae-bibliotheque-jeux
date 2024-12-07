import { createTheme } from '@mui/material/styles';


const baseTheme = {
  palette: {
    colors: {
      blue: '#36A0FC',   // Bleu
      yellow: '#FFBB33', // Jaune
      red: '#FF4436',    // Rouge
      green: '#2FC75A',  // Vert
      purple: '#9534D5', // Violet
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
  },
};


export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: 'light',
    background: {
      default: '#ffffff', // Fond principal
      paper: '#f5f5f5',   // Fond des cartes
    },
    text: {
      primary: '#000000', // Texte principal noir
      secondary: '#666666', // Texte secondaire gris
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: 'dark',
    background: {
      default: '#222222', // Fond principal
      paper: '#2c2c2c',   // Fond des cartes
    },
    text: {
      primary: '#ffffff', // Texte principal blanc
      secondary: '#b3b3b3', // Texte secondaire gris clair
    },
  },
});
