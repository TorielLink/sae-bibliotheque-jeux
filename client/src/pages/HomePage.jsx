// HomePage.jsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  useMediaQuery,
} from '@mui/material';
import GameSection from '../components/GameSection.jsx';
import { useTheme } from '@mui/material/styles';
import SectionTitle from '../components/SectionTitle.jsx';

function HomePage() {
  const [games, setGames] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Gère la pagination
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Récupération des jeux depuis le serveur avec pagination
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/games`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      console.log('Données reçues du serveur :', data);

      // Vérifiez que les données sont au bon format
      const formattedGames = data.map((game) => ({
        id: game.id,
        image: game.cover || 'https://via.placeholder.com/250x350',
        title: game.name,
        rating: game.aggregatedRating || (Math.random() * 10).toFixed(1),
        releaseDate: new Date(game.releaseDate * 1000),
        categories: game.genres || ['Non spécifié'],
      }));

      setGames(formattedGames);
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux :', error);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    console.log('Jeux chargés :', games);
  }, [games]);

  // Chargement initial et à chaque changement de page
  useEffect(() => {
    fetchGames();
  }, [page]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabTitles = ['Sorties récentes', 'Jeux populaires', 'Avis récents'];

  return (
    <Box sx={{ padding: isMobile ? '10px' : '10px 0px' }}>
      {/* En-tête */}
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

      {isMobile ? (
        <>
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

          {selectedTab === 0 && (
            <GameSection
              games={games}
              sortBy="releaseDate"
              order="desc"
              isMobileView={true}
            />
          )}
          {selectedTab === 1 && (
            <GameSection
              games={games}
              sortBy="rating"
              order="desc"
              isMobileView={true}
            />
          )}
          {selectedTab === 2 && (
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                padding: '20px',
                textAlign: 'center',
              }}
            >
              Section "Avis récents" à venir...
            </Typography>
          )}
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
    </Box>
  );
}

export default HomePage;
