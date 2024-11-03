import React, { useContext } from 'react';
import { CssBaseline, Button, Grid } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeContext } from './theme/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CataloguePage from './pages/CataloguePage.jsx';
import OpinionPage from './pages/OpinionPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

function App() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        {/* Définition des routes pour les pages */}
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Route pour la page d'accueil */}
          <Route path="/catalogue" element={<CataloguePage />} /> {/* Route pour la page "Catalogue" */}
          <Route path="/avis" element={<OpinionPage />} />  {/* Route pour la page "Avis" */}
          <Route path="/login" element={<LoginPage />} />  {/* Route pour la page "Se connecter" */}
        </Routes>

        {/* le bouton pour changer de thème */}
        <Grid item sx={{ textAlign: 'center', padding: '20px' }}>
          <Button
            onClick={toggleTheme}
            variant="contained"
            sx={{ backgroundColor: theme.palette.text.primary, color: theme.palette.background.default }}
          >
            Changer de thème
          </Button>
        </Grid>
      </Router>
    </ThemeProvider>
  );
}

export default App;
