import React, { useContext, useState } from 'react';
import { AuthContext } from '../components/AuthContext';
import {
  Typography,
  Box,
  Button,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

// On importe la carte overlay
import { OverlayGameCard } from '../components/GameCard'; // ajustez le chemin au besoin

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

  // Jeux factices
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
        lastSessionDate: '2023-10-05',
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
        lastSessionDate: '2023-11-10',
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
        lastSessionDate: '2023-12-01',
      },
    ],
    en_cours: [
      {
        id: 4,
        cover: 'https://via.placeholder.com/150',
        name: 'Elden Ring',
        aggregated_rating: 95,
        genres: ['Action', 'RPG'],
        sessions: 10,
        playTime: 1200,
        platform: 'PC',
        lastSessionDate: '2024-01-02',
      },
      {
        id: 5,
        cover: 'https://via.placeholder.com/150',
        name: 'Hades',
        aggregated_rating: 93,
        genres: ['Rogue-like', 'Action'],
        sessions: 15,
        playTime: 800,
        platform: 'Switch',
        lastSessionDate: '2023-08-20',
      },
      {
        id: 6,
        cover: 'https://via.placeholder.com/150',
        name: 'Ratchet & Clank: Rift Apart',
        aggregated_rating: 88,
        genres: ['Platformer', 'Shooter'],
        sessions: 8,
        playTime: 420,
        platform: 'PS5',
        lastSessionDate: '2023-09-15',
      },
    ],
    a_jouer: [
      {
        id: 7,
        cover: 'https://via.placeholder.com/150',
        name: 'Final Fantasy XVI',
        aggregated_rating: 92,
        genres: ['RPG'],
        sessions: 0,
        playTime: 0,
        platform: 'PS5',
      },
      {
        id: 8,
        cover: 'https://via.placeholder.com/150',
        name: "Assassin's Creed Mirage",
        aggregated_rating: 85,
        genres: ['Action', 'Adventure'],
        sessions: 0,
        playTime: 0,
        platform: 'PC',
      },
      {
        id: 9,
        cover: 'https://via.placeholder.com/150',
        name: 'Diablo IV',
        aggregated_rating: 88,
        genres: ['Hack and slash', 'Action', 'RPG'],
        sessions: 0,
        playTime: 0,
        platform: 'PC',
      },
    ],
    liste_de_souhaits: [
      {
        id: 10,
        cover: 'https://via.placeholder.com/150',
        name: 'Starfield',
        aggregated_rating: 0,
        genres: ['RPG', 'Sci-Fi'],
        sessions: 0,
        playTime: 0,
        platform: 'Xbox Series',
      },
      {
        id: 11,
        cover: 'https://via.placeholder.com/150',
        name: 'Spider-Man 2',
        aggregated_rating: 0,
        genres: ['Action', 'Adventure'],
        sessions: 0,
        playTime: 0,
        platform: 'PS5',
      },
      {
        id: 12,
        cover: 'https://via.placeholder.com/150',
        name: 'Hollow Knight: Silksong',
        aggregated_rating: 0,
        genres: ['Metroidvania', 'Platformer'],
        sessions: 0,
        playTime: 0,
        platform: 'Switch',
      },
    ],
    en_pause: [
      {
        id: 13,
        cover: 'https://via.placeholder.com/150',
        name: 'The Witcher 3: Wild Hunt',
        aggregated_rating: 95,
        genres: ['RPG', 'Open World'],
        sessions: 20,
        playTime: 2000,
        platform: 'PC',
        lastSessionDate: '2024-01-10',
      },
      {
        id: 14,
        cover: 'https://via.placeholder.com/150',
        name: 'Genshin Impact',
        aggregated_rating: 84,
        genres: ['Action', 'RPG'],
        sessions: 25,
        playTime: 3000,
        platform: 'PC',
        lastSessionDate: '2023-12-05',
      },
      {
        id: 15,
        cover: 'https://via.placeholder.com/150',
        name: 'Returnal',
        aggregated_rating: 86,
        genres: ['Rogue-like', 'Action'],
        sessions: 14,
        playTime: 900,
        platform: 'PS5',
        lastSessionDate: '2023-12-14',
      },
    ],
    abandonnes: [
      {
        id: 16,
        cover: 'https://via.placeholder.com/150',
        name: 'Anthem',
        aggregated_rating: 65,
        genres: ['Action', 'RPG'],
        sessions: 5,
        playTime: 300,
        platform: 'PC',
      },
      {
        id: 17,
        cover: 'https://via.placeholder.com/150',
        name: "Marvel's Avengers",
        aggregated_rating: 67,
        genres: ['Action', 'Adventure'],
        sessions: 6,
        playTime: 350,
        platform: 'PS4',
      },
      {
        id: 18,
        cover: 'https://via.placeholder.com/150',
        name: 'Fallout 76',
        aggregated_rating: 51,
        genres: ['RPG', 'Open World'],
        sessions: 4,
        playTime: 200,
        platform: 'Xbox One',
      },
    ],
  };

  const formatPlayTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} h ${mins} min`;
  };

  const isGenreFilter =
    selectedFilter === 'a_jouer' || selectedFilter === 'liste_de_souhaits';

  const isSessionDateFilter =
    selectedFilter === 'termines' || selectedFilter === 'en_cours' || selectedFilter === 'en_pause';

  const games = fakeGames[selectedFilter] || [];

  return (
    <Box style={{ padding: '2px' }}>
      {/* Conteneur principal */}
        <Grid container sx={{m:1}}  alignItems='flex-start' columnSpacing={2} >
          <Grid item md={8} >
            <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#F5F5F5',
            boxShadow: '0px 0px 7px #000000',
            borderRadius: '5px',
            padding: '0 10px',
            height :'45px'
          }}
        >
          {/* Barre de filtres alignée horizontalement */}
          <Box
            sx  ={{
              display: 'flex',
              flex: 1,
              alignItems: 'center',
              justifyContent: 'space-around',
            }}
          >
            {filters.map((filter) => (
              <Box
                key={filter.id}
                sx={{
                  width: '100%',
                  margin: '0 auto',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  backgroundColor: selectedFilter === filter.id ? '#D6BBFB' : 'transparent',
                  color: selectedFilter === filter.id ? '#000' : '#555',
                  textAlign: 'center',
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

          </Grid>
          <Grid item md={4}  >
            {/* Box pour les boutons de gestion d'affichage*/}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
              width: '150px',
              backgroundColor: 'D9D9D9',
              borderRadius: '5px',
              height :'45px',
              boxShadow: '0px 0px 7px #000000',
            }}
          >
            {/* Bouton 1 : Liste */}
            <Button
              variant="text"
              onClick={() => setViewMode('list')}
              sx={{
                backgroundColor: viewMode === 'list' ? '#e0e0e0' : 'transparent',
                color: '#000',
                borderRadius: 90,
                minWidth: 0,
                padding: '0 8px',
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                },
              }}
            >
              <FormatListBulletedIcon />
            </Button>

            {/* Bouton 2 : Grid */}
            <Button
              variant="text"
              onClick={() => setViewMode('grid')}
              sx={{
                backgroundColor: viewMode === 'grid' ? '#e0e0e0' : 'transparent',
                color: '#000',
                borderRadius: 0,
                minWidth: 0,
                padding: '0 8px',
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                },
              }}
            >
              <GridViewIcon />
            </Button>

            {/* Bouton 3 : Table */}
            <Button
              variant="text"
              onClick={() => setViewMode('table')}
              sx={{
                backgroundColor: viewMode === 'table' ? '#e0e0e0' : 'transparent',
                color: '#000',
                borderRadius: 0,
                minWidth: 0,
                padding: '0 8px',
                '&:hover': {
                  backgroundColor: '#d0d0d0',
                },
              }}
            >
              <ViewColumnIcon />
            </Button>
          </Box>
        </Box>

          </Grid>

        </Grid>
        {/* Box pour les filtres */}




      {/* Affichage des jeux */}
      {viewMode === 'grid' && (
        <Box
          sx={{
            padding: '0.75em',
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            mt: '30px',
          }}
        >
          {games.map((game) => (
            <OverlayGameCard
              key={game.id}
              id={game.id}
              // On utilise "cover" comme image
              image={game.cover}
              // Titre = nom du jeu
              title={game.name}
              // On passe la note
              rating={game.aggregated_rating}
            />
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

                {isGenreFilter && game.genres && (
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>
                    Genres: {game.genres.join(', ')}
                  </p>
                )}

                {isSessionDateFilter && game.lastSessionDate && (
                  <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>
                    Dernière session: {game.lastSessionDate}
                  </p>
                )}
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>
                  Sessions: {game.sessions}
                </p>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>
                  Temps de jeu: {formatPlayTime(game.playTime)}
                </p>
                <p style={{ margin: '5px 0', fontSize: '12px', color: '#555' }}>
                  Plateforme: {game.platform}
                </p>
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
                {isGenreFilter && (
                  <TableCell sx={{ borderRight: '1px solid #000' }}>Genres</TableCell>
                )}
                {isSessionDateFilter && (
                  <TableCell sx={{ borderRight: '1px solid #000' }}>Date de session</TableCell>
                )}
                <TableCell sx={{ borderRight: '1px solid #000' }}>Sessions</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>Temps de jeu</TableCell>
                <TableCell sx={{ borderRight: '1px solid #000' }}>Plateforme</TableCell>
                <TableCell>Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell sx={{ borderRight: '1px solid #000' }}>
                    {game.name}
                  </TableCell>
                  {isGenreFilter && (
                    <TableCell sx={{ borderRight: '1px solid #000' }}>
                      {game.genres?.join(', ') || 'N/A'}
                    </TableCell>
                  )}
                  {isSessionDateFilter && (
                    <TableCell sx={{ borderRight: '1px solid #000' }}>
                      {game.lastSessionDate || '—'}
                    </TableCell>
                  )}
                  <TableCell sx={{ borderRight: '1px solid #000' }}>
                    {game.sessions}
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #000' }}>
                    {formatPlayTime(game.playTime)}
                  </TableCell>
                  <TableCell sx={{ borderRight: '1px solid #000' }}>
                    {game.platform}
                  </TableCell>
                  <TableCell>{game.aggregated_rating}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ListsPage;
