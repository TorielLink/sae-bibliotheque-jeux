import React, { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid, useMediaQuery, Button, CircularProgress } from '@mui/material';
import GameCard from '../components/GameCard.jsx';
import GameSorter from '../components/GameSorter.jsx';
import { useTheme } from '@mui/material/styles';

function HomePage() {
  const [games, setGames] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1); // Gère la pagination
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Fetch games from the server with pagination
  const fetchGames = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/games?page=${page}`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
        console.log(data);
      // Format the data for GameCard
      const formattedGames = data.map((game) => ({
        id: game.id,
        image: game.cover || 'https://via.placeholder.com/250x350',
        title: game.name,
        rating: game.aggregatedRating || (Math.random() * 10).toFixed(1),
        releaseDate: new Date(game.releaseDate * 1000),
        categories: game.genres || ['Non spécifié'],
      }));

      // Append the new games to the existing list and avoid duplicates
      setGames((prevGames) => {
        const newGames = [...prevGames, ...formattedGames];
        // Remove duplicates by game id
        const uniqueGames = Array.from(new Map(newGames.map((game) => [game.id, game])).values());
        return uniqueGames;
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des jeux :', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load and whenever the page changes
  useEffect(() => {
    fetchGames();
  }, [page]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabTitles = ['Sorties récentes', 'Jeux populaires', 'Avis récents'];

  const SectionTitle = ({ title }) => (
    <Box sx={{ marginBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }}>
      <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontWeight: 'bold' }}>
        {title}
      </Typography>
      <Box sx={{ width: '100%', height: '3px', backgroundColor: theme.palette.green.main, marginTop: '8px' }} />
    </Box>
  );

  const renderGames = (sortBy, isMobileView) => (
    <GameSorter games={games} sortBy={sortBy} order="desc">
      {(sortedGames) =>
        isMobileView ? (
          <Grid container spacing={0.2}>
            {sortedGames.map((game) => (
              <Grid item xs={6} key={game.id}>
                <GameCard image={game.image} title={game.title} rating={game.rating} categories={game.categories} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ display: 'flex', overflowX: 'auto', gap: '8px', padding: '10px 20px' }}> {/* Réduit le gap de 16px à 8px */}
            {sortedGames.map((game) => (
              <Box key={game.id} sx={{ flex: '0 0 auto', width: '250px' }}>
                <GameCard image={game.image} title={game.title} rating={game.rating} categories={game.categories} />
              </Box>
            ))}
          </Box>
        )
      }
    </GameSorter>
  );

  return (
    <Box sx={{ padding: isMobile ? '10px' : '20px' }}>
      {/* Header */}
      <Box sx={{ display: 'inline-block', marginBottom: '8px' }}>
        <Typography variant="subtitle2" sx={{ color: theme.palette.text.secondary, fontSize: isMobile ? '0.9rem' : '1rem', display: 'inline' }}>
          Accueil &gt;
        </Typography>
        <Typography variant="subtitle2" sx={{ color: isMobile ? theme.palette.red.main : theme.palette.text.primary, fontWeight: 'bold', display: 'inline', marginLeft: '8px' }}>
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

          {selectedTab === 0 && renderGames('releaseDate', true)}
          {selectedTab === 1 && renderGames('rating', true)}
          {selectedTab === 2 && (
            <Typography variant="body2" sx={{ color: theme.palette.text.secondary, padding: '20px', textAlign: 'center' }}>
              Section "Avis récents" à venir...
            </Typography>
          )}
        </>
      ) : (
        <>
          <SectionTitle title="Sorties récentes" />
          {renderGames('releaseDate', false)}

          <SectionTitle title="Jeux populaires" />
          {renderGames('rating', false)}

          <SectionTitle title="Avis récents" />
          <Box sx={{ padding: '20px', textAlign: 'center', color: theme.palette.text.secondary }}>
            Section "Avis récents" à venir...
          </Box>
        </>
      )}

      {/* Load more button */}
      <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
        <Button variant="contained" color="primary" onClick={() => setPage((prevPage) => prevPage + 1)} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Charger plus'}
        </Button>
      </Box>
    </Box>
  );
}

export default HomePage;
