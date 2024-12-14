
import { createTheme } from '@mui/material';

const greenBtn = createTheme({
  palette: {
    primary: {
    main: '#2FC75A',       // Couleur principale pour le bouton
    contrastText: '#ffffff', // Texte en blanc
    }
},
});

const purpleBtn = createTheme({
palette: {
    primary: {
    main: '#9534D5',       // Couleur principale pour le bouton
    contrastText: '#ffffff', // Texte en blanc
    }
},
});

const blueBtn = createTheme({
palette: {
    primary: {
    main: '#36A0FC',       // Couleur principale pour le bouton
    contrastText: '#ffffff', // Texte en blanc
    }
},
});

const yellowBtn = createTheme({
palette: {
    primary: {
    main: '#FFBB33',       // Couleur principale pour le bouton
    contrastText: '#ffffff', // Texte en blanc
    }
},
});

export {greenBtn,purpleBtn,blueBtn,yellowBtn};