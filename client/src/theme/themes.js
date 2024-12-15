import { createTheme } from '@mui/material/styles';


const colors = {
  blue: '#36A0FC',
  yellow: '#FFBB33',
  red: '#FF4436',
  green: '#2FC75A',
  purple: '#9534D5',
};

const generateTransparentColors = (colorMap, transparency) => {
  return Object.fromEntries(
      Object.entries(colorMap).map(([colorName, hexValue]) => [
        `${colorName}-${Math.round(transparency * 100)}`, // Exemple: 'yellow-50'
        `${hexValue}${Math.round(transparency * 255).toString(16).padStart(2, '0')}`, // Exemple: FFBB3380
      ])
  );
};

// TODO : ne fonctionne pas
const loadGoogleFont = (fontName) => {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};
loadGoogleFont('Jacquard');

export const baseTheme = {
  palette: {
    colors,
    transparentColors: {
      ...generateTransparentColors(colors, 1),
      ...generateTransparentColors(colors, 0.5), // Ajoute colors-50
      ...generateTransparentColors(colors, 0.7), // Ajoute colors-70
    },
  },
  typography: {
    fontFamily: 'Inter, Arial, sans-serif',
    titleFontFamily: 'Jacquard, Arial, sans-serif',
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: 'light',
    background: {
      default: '#F5F5F5',
      paper: '#FFF',
    },
    text: {
      primary: '#222', // Texte principal noir
      secondary: '#666', // Texte secondaire gris
      contrast: '#F5F5F5', // Texte blanc
    },
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: 'dark',
    background: {
      default: '#222',
      paper: '#333',
    },
    text: {
      primary: '#FFF',
      secondary: '#B3B3B3', // Texte secondaire gris clair
    },
  },
});