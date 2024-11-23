import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#36A0FC', // Bleu clair
    },
    white: {
      main: '#ffffff', // Fond principal
    },
    jaune: {
      main: '#FFBB33', // Jaune
    },
    green: {
      main: '#2FC75A', // Vert
    },
    red: {
      main: '#FF4436', // Rouge
    },
    purple: {
      main: '#9534D5', // Violet
    },
    blue: {
      main: '#36A0FC', // Bleu clair
    },
    orange: {
      main: '#FFBB33', // Orange ou Jaune
    },
    background: {
      default: '#ffffff', // Fond principal pour clair
      paper: '#f5f5f5', // Fond des cartes
    },
    text: {
      primary: '#000000', // Noir pour le texte
      secondary: '#666666', // Gris pour le texte secondaire
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#36A0FC', // Bleu clair
    },
    white: {
      main: '#ffffff', // Pour le contraste sur fond sombre
    },
    jaune: {
      main: '#FFBB33', // Jaune
    },
    green: {
      main: '#2FC75A', // Vert
    },
    red: {
      main: '#FF4436', // Rouge
    },
    purple: {
      main: '#9534D5', // Violet
    },
    blue: {
      main: '#36A0FC', // Bleu clair
    },
    orange: {
      main: '#FFBB33', // Jaune orangé
    },
    background: {
      default: '#222222', // Fond principal pour sombre
      paper: '#2c2c2c', // Fond des cartes
    },
    text: {
      primary: '#ffffff', // Blanc pour le texte principal
      secondary: '#b3b3b3', // Gris clair pour le texte secondaire
    },
  },
});
