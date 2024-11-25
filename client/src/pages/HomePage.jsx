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
  const [games, setGames] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ limit: 200, sort: 'first_release_date desc' }); // Ajout des filtres
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const tabTitles = ['Sorties récentes', 'Jeux populaires', 'Avis récents'];

const fetchGames = async () => {
    setLoading(true);
    setError('');
    try {
        const isRecent = selectedTab === 0; // Vérifiez si l'onglet "Sorties récentes" est actif
        const queryParams = new URLSearchParams({
            ...filters,
            recent: isRecent, // Inclut le paramètre `recent` pour les jeux récents
        }).toString();

        const response = await fetch(`http://localhost:8080/games?${queryParams}`);
        if (!response.ok) {
            throw new Error('Erreur lors de la récupération des données');
        }

        const data = await response.json();
        console.log('Données reçues du serveur :', data);

        const formattedGames = data.map((game) => ({
            id: game.id,
            image: game.cover || 'https://via.placeholder.com/250x350',
            title: game.name,
            rating: game.aggregatedRating?.toFixed(1) || 'N/A',
            releaseDate: game.releaseDate
                ? new Date(game.releaseDate).toLocaleDateString()
                : 'Date inconnue',
            categories: game.genres || ['Non spécifié'],
        }));

        setGames(formattedGames);
    } catch (err) {
        console.error('Erreur lors de la récupération des jeux :', err);
        setError('Impossible de charger les jeux. Veuillez réessayer plus tard.');
    } finally {
        setLoading(false);
    }
};


  // Mise à jour des filtres lors du changement d'onglet
  useEffect(() => {
    const sortOption =
      selectedTab === 0
        ? 'first_release_date desc'
        : selectedTab === 1
        ? 'aggregated_rating desc'
        : 'created_at desc';

    setFilters((prevFilters) => ({
      ...prevFilters,
      sort: sortOption,
    }));
  }, [selectedTab]);

  // Recharger les jeux lorsque les filtres changent
  useEffect(() => {
    fetchGames();
  }, [filters]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ padding: isMobile ? '10px' : '10px 0px' }}>
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
          {isMobile ? (
            <>
              <GameSection
                games={games}
                sortBy={selectedTab === 1 ? 'rating' : 'releaseDate'}
                order="desc"
                isMobileView={true}
              />
            </>
          ) : (
            <>
              <Box sx={{ marginBottom: '40px' }}>
                <GameSection
                  title="Sorties récentes"
                  games={games}
                  sortBy="releaseDate"
                  order="desc"
                  isMobileView={false}
                />
              </Box>

              <Box sx={{ marginBottom: '40px' }}>
                <GameSection
                  title="Jeux populaires"
                  games={games}
                  sortBy="rating"
                  order="desc"
                  isMobileView={false}
                />
              </Box>

              <SectionTitle title="Avis récents" />
              <Box
                sx={{
                  padding: '20px',
                  textAlign: 'center',
                  color: theme.palette.text.secondary,
                }}
              >
                Section "Avis récents" à venir...
              </Box>
            </>
          )}
        </>
      )}
    </Box>
  );
}

export default HomePage;
