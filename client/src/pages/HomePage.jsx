import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  useMediaQuery,
} from '@mui/material';
import GameSection from '../components/GameSection.jsx';
import { useTheme } from '@mui/material/styles';
import SectionTitle from '../components/SectionTitle.jsx';

function HomePage() {
  const [recentGames, setRecentGames] = useState([]);
  const [popularGames, setPopularGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tabTitles = ['Sorties récentes', 'Jeux populaires', 'Avis récents'];

  // Fonction pour charger les jeux en fonction des filtres
  const fetchGamesByFilter = async (filter) => {
    const queryParams = new URLSearchParams(filter).toString();
    const response = await fetch(`http://localhost:8080/games?${queryParams}`);
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des données');
    }
    return response.json();
  };

  // Chargement des données pour les sections
  const fetchAllGames = async () => {
    setLoading(true);
    setError('');
    try {
      const [recent, popular] = await Promise.all([
        fetchGamesByFilter({ limit: 20, sort: 'first_release_date desc' }),
        fetchGamesByFilter({ limit: 20, sort: 'aggregated_rating desc' }),
      ]);

      const formatGameData = (games) =>
        games.map((game) => ({
          id: game.id,
          image: game.cover  || null,
          title: game.name,
            rating: game.aggregatedRating?.toFixed(1) || 'N/A',
          releaseDate: game.releaseDate
            ? new Date(game.releaseDate).toLocaleDateString()
            : 'Date inconnue',
          categories: game.genres || [],
        }));

      setRecentGames(formatGameData(recent));
      setPopularGames(formatGameData(popular));
    } catch (err) {
      console.error('Erreur lors de la récupération des jeux :', err);
      setError('Impossible de charger les jeux. Veuillez réessayer plus tard.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllGames();
  }, []);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const currentGames =
    selectedTab === 0 ? recentGames : selectedTab === 1 ? popularGames : [];

  return (
    <Box sx={{ padding: isMobile ? '10px' : '10px 20px' }}>
      {/* Breadcrumb */}
      <Box sx={{ display: 'inline-block', marginBottom: '8px' }}>
        <Typography
          variant="subtitle2"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: isMobile ? '0.9rem' : '1rem',
            display: 'inline',
          }}
        >
          Accueil &gt;
        </Typography>
        <Typography
          variant="subtitle2"
          sx={{
            color: isMobile ? theme.palette.red.main : theme.palette.text.primary,
            fontWeight: 'bold',
            display: 'inline',
            marginLeft: '8px',
          }}
        >
          {isMobile ? tabTitles[selectedTab] : ''}
        </Typography>
      </Box>

      {/* Mobile Tabs */}
      {isMobile && (
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
          sx={{
            marginBottom: '8px',
            minHeight: '36px',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 'bold',
              fontSize: '0.8rem',
              padding: '6px 8px',
              minHeight: 'auto',
              color: theme.palette.text.primary,
            },
            '& .Mui-selected': {
              color: theme.palette.red.main,
              fontWeight: 'bold',
            },
          }}
        >
          <Tab label="Sorties récentes" />
          <Tab label="Jeux populaires" />
          <Tab label="Avis récents" />
        </Tabs>
      )}

      {/* Loading or Error */}
      {loading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '50vh',
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Box
          sx={{
            textAlign: 'center',
            color: theme.palette.error.main,
            marginTop: '20px',
          }}
        >
          <Typography variant="h6">{error}</Typography>
        </Box>
      ) : (
        <>
          {/* Mobile View */}
          {isMobile ? (
            <GameSection
              games={currentGames}
              sortBy={selectedTab === 1 ? 'rating' : 'releaseDate'}
              order="desc"
              isMobileView={true}
            />
          ) : (
            /* Desktop View */
            <>
              <Box sx={{ marginBottom: '40px' }}>
                <GameSection
                  title="Sorties récentes"
                  games={recentGames}
                  sortBy="releaseDate"
                  order="desc"
                  isMobileView={false}
                />
              </Box>

              <Box sx={{ marginBottom: '40px' }}>
                <GameSection
                  title="Jeux populaires"
                  games={popularGames}
                  sortBy="rating"
                  order="desc"
                  isMobileView={false}
                />
              </Box>

              <SectionTitle title="Avis récents" />
              <Box
                sx={{
                  textAlign: 'center',
                  color: theme.palette.text.secondary,
                  marginTop: '20px',
                  marginBottom: '40px',
                }}
              >
                <Typography variant="body1">
                  Les avis récents seront bientôt disponibles !
                </Typography>
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default HomePage;
