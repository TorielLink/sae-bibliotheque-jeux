import React, {useState, useContext, useEffect} from 'react';
import {AppBar, Toolbar, IconButton, Typography, Button, Box} from '@mui/material';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useTheme} from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import {ThemeContext} from '../theme/ThemeContext';
import {AuthContext} from './AuthContext';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchBar from './SearchBar';
// import UserMenu from "./UserMenu.jsx";

function Navbar() {
    const theme = useTheme();
    const {toggleTheme, mode} = useContext(ThemeContext);
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const location = useLocation();
    const navigate = useNavigate();

    const {isAuthenticated} = useContext(AuthContext); // Pour vérifier l'état de connexion

    const isCatalogue = location.pathname === '/catalogue';
    const isAvis = location.pathname === '/avis';

    const [isNavbarVisible, setIsNavbarVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isSearchActive, setSearchActive] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [, setSelectedGame] = useState(null);
    const [logoUrl, setLogoUrl] = useState('/images/light-logo.png')


    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > lastScrollY)
                // Si on défile vers le bas, cacher la barre
                setIsNavbarVisible(false);
            else
                // Si on défile vers le haut, afficher la barre
                setIsNavbarVisible(true);
            setLastScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);

    const handleSearchBack = () => {
        setSearchActive(false);
        setSearchText('');
        setSelectedGame(null);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        console.log('Recherche soumise :', searchText);
        setSearchActive(false);
        setSearchText('');
    };

    const handleGameSelect = (game) => {
        console.log('Jeu sélectionné :', game.name, game.id);

        navigate(`/details/${game.id}`);
        setSelectedGame(game);
        setSearchActive(false);
    };

    return (
        <AppBar
            position="sticky"
            sx={{
                backgroundColor: theme.palette.background.paper,
                boxShadow: isNavbarVisible ? '0px 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
                padding: isMobile ? '4px' : '8px',
                transition: 'top 0.3s',
                top: isNavbarVisible ? 0 : '-80px',
            }}
        >
            <Toolbar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'nowrap',
                    minHeight: isMobile ? '50px' : 'auto',
                }}
            >
                {/* Logo du site à gauche */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        flexShrink: 0,
                    }}
                >
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="logo"
                        component={Link}
                        to="/"
                        disableRipple
                        sx={{marginRight: isMobile ? 0.5 : 1}}
                    >
                        <img
                            src={logoUrl}
                            alt="logo"
                            style={{
                                width: isMobile ? '60px' : '120px',
                                height: 'auto',
                                objectFit: 'contain',
                            }}
                        />
                    </IconButton>
                </Box>

                {/* Spacer pour pousser les éléments suivants à droite */}
                <Box sx={{flexGrow: 1}}/>

                {/* Navigation links, Search Bar, Se connecter Button, and Theme Toggle */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isMobile ? '8px' : '16px', // Espacement entre les éléments
                    }}
                >
                    {/* Navigation Links */}
                    {!isSearchActive || !isMobile ? (
                        <>
                            <Typography
                                component={Link}
                                to="/catalogue"
                                sx={{
                                    textDecoration: 'none',
                                    color: isCatalogue
                                        ? theme.palette.colors.yellow
                                        : theme.palette.text.primary,
                                    fontSize: isMobile ? '0.75rem' : '1.1rem',
                                }}
                            >
                                Catalogue
                            </Typography>
                            <Typography
                                component={Link}
                                to="/avis"
                                sx={{
                                    textDecoration: 'none',
                                    color: isAvis
                                        ? theme.palette.colors.green
                                        : theme.palette.text.primary,
                                    fontSize: isMobile ? '0.75rem' : '1.1rem',
                                }}
                            >
                                Avis
                            </Typography>
                        </>
                    ) : null}

                    {/* Barre de recherche */}
                    <SearchBar
                        searchText={searchText}
                        setSearchText={setSearchText}
                        handleSearchBack={handleSearchBack}
                        handleSearchSubmit={handleSearchSubmit}
                        isSearchActive={isSearchActive}
                        setSearchActive={setSearchActive}
                        isMobile={isMobile}
                        onGameSelect={handleGameSelect}
                    />

                    {/* Bouton de connexion */}
                    {!isAuthenticated ? (
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            sx={{
                                fontSize: isMobile ? '0.5rem' : '1rem',
                                padding: isMobile ? '2px 4px' : '8px 16px',
                                minWidth: isMobile ? '60px' : '130px',
                                backgroundColor: theme.palette.colors.green,
                                color: theme.palette.background.default,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                flexShrink: 0,
                            }}
                        >
                            Se connecter
                        </Button>
                    ) : (
                        <></>
                        // <UserMenu/> // Affiche le menu utilisateur si connecté
                    )}

                    {/* Bouton de bascule de thème */}
                    <IconButton
                        onClick={toggleTheme}
                        color="inherit"
                        sx={{
                            padding: isMobile ? '0px' : '8px',
                            ml: isMobile ? '6px' : '8px',
                        }}
                    >
                        {mode === 'light' ? (
                            <DarkModeIcon
                                sx={{
                                    fontSize: isMobile ? '20px' : '32px',
                                    color: theme.palette.text.primary,
                                }}
                                onClick={() => {
                                    setLogoUrl('/images/dark-logo.png')
                                }}
                            />
                        ) : (
                            <LightModeIcon
                                sx={{
                                    fontSize: isMobile ? '20px' : '32px',
                                    color: theme.palette.colors.yellow,
                                }}
                                onClick={() => {
                                    setLogoUrl('/images/light-logo.png')
                                }}
                            />
                        )}
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar;
