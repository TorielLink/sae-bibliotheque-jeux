import React, {useContext} from 'react';
import {CssBaseline} from '@mui/material';
import {ThemeProvider} from '@mui/material/styles';
import {ThemeContext} from './theme/ThemeContext.jsx';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
// Pages
import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import CataloguePage from './pages/CataloguePage.jsx';
import ReviewsPage from './pages/ReviewsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import GameDetailsPage from "./pages/GamesDetailsPage.jsx";
// Pied de page
import Footer from "./components/Footer.jsx";
import Team from './pages/footer/TeamPage.jsx';
import Establishment from './pages/footer/InstitutionPage.jsx';
import Project from './pages/footer/ProjectPage.jsx';
import Mentorship from './pages/footer/MentorshipPage.jsx';
import Terms from './pages/footer/TermsPage.jsx';
import PrivacyPolicy from './pages/footer/PrivacyPolicyPage.jsx';
import Contacts from './pages/footer/ContactsPage.jsx';
// Profil utilisateur
import ProtectedRoute from './utils/ProtectedRoute.jsx';
import ProfilePage from './pages/profil/ProfilePage.jsx';
import MyStatsPage from './pages/profil/MyStatsPage.jsx';
import MyListsPage from './pages/profil/MyListsPage.jsx';
import MyLogsPage from './pages/profil/MyLogsPage.jsx';
import MyReviewsPage from './pages/profil/MyReviewsPage.jsx';
import MyCollectionsPage from './pages/profil/MyCollectionsPage.jsx';
import SettingsPage from './pages/profil/SettingsPage.jsx';


function App() {
    const {theme} = useContext(ThemeContext);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <Router>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                }}>
                    <Navbar/>
                    {/* Définition des routes pour les pages */}
                    <Routes>
                        <Route path="/" element={<HomePage/>}/> {/* Route pour la page d'accueil */}
                        <Route path="/catalogue" element={<CataloguePage/>}/> {/* Route pour la page "Catalogue" */}
                        <Route path="/avis" element={<ReviewsPage/>}/> {/* Route pour la page "Avis" */}
                        <Route path="/login" element={<LoginPage/>}/> {/* Route pour la page "Se connecter" */}
                        <Route path="/details/:id" element={<GameDetailsPage/>}/> {/* Route dynamique */}

                        {/*-- Pages du pied de page --*/}
                        <Route path="/team" element={<Team/>}/>
                        <Route path="/institution" element={<Establishment/>}/>
                        <Route path="/project" element={<Project/>}/>
                        <Route path="/mentorship" element={<Mentorship/>}/>
                        <Route path="/terms" element={<Terms/>}/>
                        <Route path="/privacy-policy" element={<PrivacyPolicy/>}/>
                        <Route path="/contact" element={<Contacts/>}/>

                        {/*-- Pages du profil utilisateur --*/}
                        <Route path="/profile" element={
                            <ProtectedRoute>
                                <ProfilePage/>
                            </ProtectedRoute>
                        }
                        />
                        <Route path="/stats" element={
                            <ProtectedRoute>
                                <MyStatsPage/>
                            </ProtectedRoute>
                        }
                        />
                        <Route path="/lists" element={
                            <ProtectedRoute>
                                <MyListsPage/>
                            </ProtectedRoute>
                        }
                        />
                        <Route path="/journals" element={
                            <ProtectedRoute>
                                <MyLogsPage/>
                            </ProtectedRoute>
                        }
                        />
                        <Route path="/reviews" element={
                            <ProtectedRoute>
                                <MyReviewsPage/>
                            </ProtectedRoute>
                        }
                        />
                        <Route path="/custom-lists" element={
                            <ProtectedRoute>
                                <MyCollectionsPage/>
                            </ProtectedRoute>
                        }
                        />
                        <Route path="/settings" element={
                            <ProtectedRoute>
                                <SettingsPage/>
                            </ProtectedRoute>
                        }
                        />
                    </Routes>
                    <Footer/>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
