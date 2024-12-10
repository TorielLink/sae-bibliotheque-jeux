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
    //TODO : mettre la police de Scrib
  },
};


export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    ...baseTheme.palette,
    mode: 'light',
    background: {
      default: '#F5F5F5',
      paper: '#F4F6F8',
    },
    text: {
      primary: '#222', // Texte principal noir
      secondary: '#666', // Texte secondaire gris
      inverse: '#F5F5F5', // Texte blanc
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