import React, { useContext } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeContext } from './theme/ThemeContext.jsx';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Pages
import Navbar from './components/Navbar.jsx';
import Footer from "./components/Footer.jsx";
import HomePage from './pages/HomePage.jsx';
import CataloguePage from './pages/CataloguePage.jsx';
import OpinionPage from './pages/OpinionPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import GameDetailsPage from "./pages/GamesDetailsPage.jsx";
// Pied de page
import Team from './pages/TeamPage.jsx';
import Establishment from './pages/InstitutionPage.jsx';
import Project from './pages/ProjectPage.jsx';
import Mentorship from './pages/MentorshipPage.jsx';
import Terms from './pages/TermsPage.jsx';
import PrivacyPolicy from './pages/PrivacyPolicyPage.jsx';
import Contacts from './pages/ContactsPage.jsx';
// Profil utilisateur
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import ListsPage from './pages/ListsPage.jsx';
import JournalsPage from './pages/JournalsPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import CustomListsPage from './pages/CustomListsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Route pour la page d'accueil */}
          <Route path="/catalogue" element={<CataloguePage />} /> {/* Route pour la page "Catalogue" */}
          <Route path="/avis" element={<OpinionPage />} />  {/* Route pour la page "Avis" */}
          <Route path="/login" element={<LoginPage />} />  {/* Route pour la page "Se connecter" */}
          <Route path="/details/:id" element={<GameDetailsPage />} /> {/* Route dynamique */}

          {/*-- Pages du pied de page --*/}
          <Route path="/team" element={<Team />} />
          <Route path="/institution" element={<Establishment />} />
          <Route path="/project" element={<Project />} />
          <Route path="/mentorship" element={<Mentorship />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contacts />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/stats"
            element={
              <ProtectedRoute>
                <StatsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/lists"
            element={
              <ProtectedRoute>
                <ListsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/journals"
            element={
              <ProtectedRoute>
                <JournalsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reviews"
            element={
              <ProtectedRoute>
                <ReviewsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/custom-lists"
            element={
              <ProtectedRoute>
                <CustomListsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      <Footer/>
    </ThemeProvider>
  );
}

export default App;
