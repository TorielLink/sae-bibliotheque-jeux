import {createTheme} from '@mui/material/styles';


const colors = {
    blue: '#36A0FC',         // Bleu
    yellow: '#FFBB33',       // Jaune
    red: '#FF4436',          // Rouge
    green: '#2FC75A',        // Vert
    purple: '#9534D5',       // Violet
    lightGray: '#E6E6E6',    // Gris clair
    black: '#222222',        // Noir
    white: '#F5F5F5',        // Blanc
    teal: '#20C997',         // Bleu-vert (Teal)
    lightBlue: '#5CC6FF',    // Bleu clair
    orange: '#FF8C00',       // Orange
};


const generateTransparentColors = (colorMap, transparency) => {
    return Object.fromEntries(
        Object.entries(colorMap).map(([colorName, hexValue]) => [
            `${colorName}-${Math.round(transparency * 100)}`, // Exemple: 'yellow-50'
            `${hexValue}${Math.round(transparency * 255).toString(16).padStart(2, '0')}`, // Exemple: FFBB3380
        ])
    );
};

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
        logo: '/images/light-logo.png',
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
        logo: '/images/dark-logo.png',
    },
});