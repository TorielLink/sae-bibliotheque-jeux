import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, useMediaQuery } from '@mui/material';
import axios from 'axios';
import GameCard from '../components/GameCard.jsx';
import { useTheme } from '@mui/material/styles';

function HomePage() {
  const [games, setGames] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('https://picsum.photos/v2/list?page=1&limit=10');
        const gameData = response.data.map((item, index) => ({
          id: item.id || index,  // Utilise l'id fourni par Picsum ou un id basé sur l'index
          image: item.download_url,
          title: item.author,
          rating: (Math.random() * 2 + 3).toFixed(1),
          categories: ["Action", "Aventure"]
        }));
        setGames(gameData);
      } catch (error) {
        console.error("Erreur lors de la récupération des données de jeux:", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <Box sx={{ padding: '20px' }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>Jeux populaires</Typography>

      {/* Mode Mobile : Grille de 2 cartes, Mode PC : Slider horizontal */}
      {isMobile ? (
        // Grille pour mobile
        <Grid container spacing={2}>
          {games.map((game) => (
            <Grid
              item
              key={game.id}
              xs={6} // 50% de largeur sur les écrans mobiles
            >
              <GameCard
                image={game.image}
                title={game.title}
                rating={game.rating}
                categories={game.categories}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        // Slider horizontal pour PC
        <Box
          sx={{
            display: 'flex',
            overflowX: 'auto',
            gap: '16px', // Espacement entre les cartes
            padding: '10px',
            '&::-webkit-scrollbar': { height: '8px' }, // Personnalisation de la scrollbar pour WebKit
            '&::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' },
            '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
          }}
        >
          {games.map((game) => (
            <Box key={game.id} sx={{ flex: '0 0 auto', width: '250px' }}> {/* Empêche le redimensionnement */}
              <GameCard
                image={game.image}
                title={game.title}
                rating={game.rating}
                categories={game.categories}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default HomePage;
