import { createTheme } from '@mui/material/styles';


const colors = {
  blue: '#36A0FC',
  yellow: '#FFBB33',
  red: '#FF4436',
  green: '#2FC75A',
  purple: '#9534D5',
};

const generateTransparentColors = (colorMap, transparency) => {
  const transparencySuffix = Math.round(transparency * 100);
  return Object.fromEntries(
      Object.entries(colorMap).map(([colorName, hexValue]) => [
        `${colorName}-${transparencySuffix}`,
        `${hexValue}${Math.round(transparency * 255).toString(16).padStart(2, '0')}`,
      ])
  );
};

export const baseTheme = {
  palette: {
    colors,
    ...generateTransparentColors(colors, 0.5), // Ajoute colors-50
    ...generateTransparentColors(colors, 0.7), // Ajoute colors-70
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
      default: '#FFF', // Fond principal
      paper: '#F5F5F5',   // Fond des cartes
    },
    text: {
      primary: '#000', // Texte principal noir
      secondary: '#666', // Texte secondaire gris
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
      paper: '#2C2C2C',   // Fond des cartes
    },
    text: {
      primary: '#FFF', // Texte principal blanc
      secondary: '#B3B3B3', // Texte secondaire gris clair
    },
  },
});