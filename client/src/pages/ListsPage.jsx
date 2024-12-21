import React, { useContext, useState } from 'react';
import { AuthContext } from '../components/AuthContext';
import { Card, CardMedia, Typography, Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
import { useTheme } from '@mui/material/styles';

const ListsPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id; // Stocker l'ID de l'utilisateur dans une variable

  const [selectedFilter, setSelectedFilter] = useState('termines');
  const [viewMode, setViewMode] = useState('grid'); // Mode d'affichage par défaut : grid

  // Options de tri
  const filters = [
    { id: 'termines', label: 'Terminés' },
    { id: 'en_cours', label: 'En cours' },
    { id: 'a_jouer', label: 'À jouer' },
    { id: 'liste_de_souhaits', label: 'Liste de souhaits' },
    { id: 'en_pause', label: 'En pause' },
    { id: 'abandonnes', label: 'Abandonnés' },
  ];

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const fakeGames = {
    termines: [
      {
        id: 1,
        cover: 'https://via.placeholder.com/150',
        name: 'Cyberpunk 2077',
        aggregated_rating: 85,
        genres: ['RPG', 'Action'],
        sessions: 26,
        playTime: 3012,
        platform: 'PS5',
      },
      {
        id: 2,
        cover: 'https://via.placeholder.com/150',
        name: 'Astro Bot',
        aggregated_rating: 90,
        genres: ['Platformer'],
        sessions: 12,
        playTime: 730,
        platform: 'PS5',
      },
      {
        id: 3,
        cover: 'https://via.placeholder.com/150',
        name: 'Zelda: Breath of the Wild',
        aggregated_rating: 97,
        genres: ['Adventure', 'RPG'],
        sessions: 45,
        playTime: 2829,
        platform: 'Switch',
      },
    ],
    // Autres catégories de jeux similaires...
  };

  const formatPlayTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} h ${mins} min`;
  };

  const games = fakeGames[selectedFilter] || [];

  return (
    <div style={{ padding: '2px' }}>
      {/* Conteneur principal */}
      <Box sx={{ position: 'relative', mb: 2 }}>
        {/* Box pour les filtres */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F5F5F5',
            boxShadow: '0px 0px 7px #000000',
            borderRadius: '5px',
            height: '45px', // Réduction de la hauteur de la barre de filtres
            padding: '0 10px',
          }}
        >
          {/* Barre de filtres alignée horizontalement */}
          <Box
            sx={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-around', // Espacement égal entre les filtres
            }}
          >
            {filters.map((filter) => (
              <Box
                key={filter.id}
                sx={{
                  padding: '8px 16px', // Réduction du padding pour un aspect plus compact
                  cursor: 'pointer',
                  backgroundColor: selectedFilter === filter.id ? '#D6BBFB' : 'transparent',
                  color: selectedFilter === filter.id ? '#000' : '#555',
                  textAlign: 'center',
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRight: '1px solid #E0E0E0',
                  '&:last-child': {
                    borderRight: 'none',
                  },
                }}
                onClick={() => handleFilterChange(filter.id)}
              >
                {filter.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Box pour les boutons de gestion d'affichage (alignés à droite et sous les filtres) */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            position: 'absolute',
            top: '50px', // Positionné juste sous la barre de filtres
            right: '10px', // Aligné à droite
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '150px',
              background: '#FFFFFF',
              borderRadius: '5px',
              boxShadow: '0px 0px 7px #000000',
              height: '35px', // Réduction de la hauteur des boutons
            }}
          >
            <Button
              variant={viewMode === 'list' ? 'contained' : 'text'}
              onClick={() => setViewMode('list')}
            >
              <FormatListBulletedIcon />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'contained' : 'text'}
              onClick={() => setViewMode('grid')}
            >
              <GridViewIcon />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'contained' : 'text'}
              onClick={() => setViewMode('table')}
            >
              <ViewColumnIcon />
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Affichage des jeux */}
      {viewMode === 'grid' && (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            mt: '30px',
          }}
        >
          {games.map((game) => (
            <Box
              key={game.id}
              sx={{
                width: '150px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxShadow: '0px 0px 7px #000000',
                borderRadius: '5px',
                overflow: 'hidden',
                textAlign: 'center',
              }}
            >
              <CardMedia
                component="img"
                image={game.cover}
                alt={game.name}
                sx={{
                  objectFit: 'cover',
                  width: '100%',
                  height: '200px',
                }}
              />
              <Box sx={{ padding: '10px' }}>
                <Typography variant="h6" sx={{ fontSize: '14px', fontWeight: 'bold' }}>
                  {game.name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#555', fontSize: '12px' }}>
                  ⭐ {game.aggregated_rating}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {viewMode === 'list' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: '80px' }}>
          {games.map((game) => (
            <Box
              key={game.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: 2,
              }}
            >
              <img
                src={game.cover}
                alt={game.name}
                style={{ width: '80px', height: '80px', marginRight: '10px' }}
              />
              <Box>
                <h3 style={{ margin: '0', fontSize: '14px' }}>{game.name}</h3>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>{game.genres.join(', ')}</p>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>Sessions: {game.sessions}</p>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>Temps de jeu: {formatPlayTime(game.playTime)}</p>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>Plateforme: {game.platform}</p>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {viewMode === 'table' && (
        <TableContainer component={Paper} sx={{ boxShadow: '0px 0px 7px #000000', mt: '80px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderRight: '1px solid #000' }}>Nom</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>Genres</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>Sessions</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>Temps de jeu</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>Plateforme</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell sx={{ borderRight: '1px solid #000' }}>{game.name}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #000' }}>{game.genres.join(', ')}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #000' }}>{game.sessions}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #000' }}>{formatPlayTime(game.playTime)}</TableCell>
                  <TableCell sx={{ borderRight: '1px solid #000' }}>{game.platform}</TableCell>
                  <TableCell>{game.aggregated_rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default ListsPage;
