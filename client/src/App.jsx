import React, { useContext } from 'react';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeContext } from './theme/ThemeContext.jsx';
import Navbar from './components/Navbar.jsx';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import CataloguePage from './pages/CataloguePage.jsx';
import OpinionPage from './pages/OpinionPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import GameDetailsPage from './pages/GamesDetailsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import StatsPage from './pages/StatsPage.jsx';
import ListsPage from './pages/ListsPage.jsx';
import JournalsPage from './pages/JournalsPage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import CustomListsPage from './pages/CustomListsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import ProtectedRoute from './utils/ProtectedRoute.jsx';

function App() {
  const { theme } = useContext(ThemeContext);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Routes>
          {/* Routes accessibles à tous */}
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogue" element={<CataloguePage />} />
          <Route path="/avis" element={<OpinionPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/details/:id" element={<GameDetailsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
          {/* Routes protégées */}
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
    </ThemeProvider>
  );
}

export default App;
