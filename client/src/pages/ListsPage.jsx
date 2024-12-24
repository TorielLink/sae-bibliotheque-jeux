import React, {useContext, useState} from 'react';
import {AuthContext} from '../components/AuthContext';
import {
    Box,
    Button,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewColumnIcon from '@mui/icons-material/ViewColumn';
// On importe la carte overlay
import {OverlayGameCard} from '../components/GameCard';
import StarRating from "../components/StarRating.jsx";

const ListsPage = () => {
    const {user} = useContext(AuthContext);
    const userId = user?.id;

    const [selectedFilter, setSelectedFilter] = useState('termines');
    const [viewMode, setViewMode] = useState('grid');

    // Options de tri
    const filters = [
        {id: 'termines', label: 'Terminés'},
        {id: 'en_cours', label: 'En cours'},
        {id: 'a_jouer', label: 'À jouer'},
        {id: 'liste_de_souhaits', label: 'Liste de souhaits'},
        {id: 'en_pause', label: 'En pause'},
        {id: 'abandonnes', label: 'Abandonnés'},
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
                sessions: 26,
                playTime: 3012,
                platform: 'PS5',
                rating: 4.5,
            },
            {
                id: 2,
                cover: 'https://via.placeholder.com/150',
                name: 'Astro Bot',
                sessions: 12,
                playTime: 730,
                platform: 'PS5',
                rating: 4,
            }
        ],
        en_cours: [
            {
                id: 4,
                cover: 'https://via.placeholder.com/150',
                name: 'Elden Ring',
                lastSessionDate: '2024-01-02',
                sessions: 10,
                playTime: 1200,
                platform: 'PC',
                rating: 4,
            },
            {
                id: 5,
                cover: 'https://via.placeholder.com/150',
                name: 'Hades',
                lastSessionDate: '2023-12-15',
                sessions: 15,
                playTime: 800,
                platform: 'Switch',
                rating: 4,
            }
        ],
        a_jouer: [
            {
                id: 7,
                cover: 'https://via.placeholder.com/150',
                name: 'Final Fantasy XVI',
                genres: ['RPG'],
                platform: 'PS5',
                aggregatedRating: 3,
            }
        ],
        liste_de_souhaits: [
            {
                id: 10,
                cover: 'https://via.placeholder.com/150',
                name: 'Starfield',
                genres: ['RPG', 'Sci-Fi'],
                releaseDate: '2024-02-15',
                aggregatedRating: 0,
            }
        ],
        en_pause: [
            {
                id: 13,
                cover: 'https://via.placeholder.com/150',
                name: 'The Witcher 3: Wild Hunt',
                lastSessionDate: '2024-01-10',
                sessions: 20,
                playTime: 2000,
                platform: 'PC',
                rating: 1,
            }
        ],
        abandonnes: [
            {
                id: 16,
                cover: 'https://via.placeholder.com/150',
                name: 'Anthem',
                lastSessionDate: '2023-12-15',
                sessions: 5,
                playTime: 300,
                platform: 'PC',
                rating: 2,
            }
        ],
    };

    const formatPlayTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} h ${mins} min`;
    };

    const games = fakeGames[selectedFilter]?.slice(0, 5) || [];

    const tableHeaders = {
        termines: ['Nom du jeu', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'],
        en_cours: ['Nom du jeu', 'Dernière session', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'],
        a_jouer: ['Nom du jeu', 'Genres', 'Plateforme', 'Note moyenne'],
        liste_de_souhaits: ['Nom du jeu', 'Genres', 'Date de sortie', 'Note moyenne'],
        en_pause: ['Nom du jeu', 'Dernière session', 'Nombre de sessions', 'Temps de jeu', 'Plateforme', 'Ma note'],
        abandonnes: ['Nom du jeu', 'Dernière session', 'Nombre de sessions', 'Temps de jeu', 'Plateforme', 'Ma note'],
    };

    const filterColors = {
        termines: '#D6BBFB',
        en_cours: '#A3D9FF',
        a_jouer: '#FFD9A3',
        liste_de_souhaits: '#FFD1D1',
        en_pause: '#FFE1A3',
        abandonnes: '#D1FFD1',
    };

    return (
        <Box style={{padding: '2px'}}>
            {/* Conteneur principal */}
            <Grid container sx={{m: 1}} alignItems='flex-start' columnSpacing={2}>
                <Grid item md={8}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#F5F5F5',
                            boxShadow: '0px 0px 7px #000000',
                            borderRadius: '5px',
                            padding: '0 10px',
                            height: '45px'
                        }}
                    >
                        {/* Barre de filtres alignée horizontalement */}
                        <Box
                            sx={{
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
                <Grid item md={4}>
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
                                height: '45px',
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
                                <ViewColumnIcon/>
                            </Button>

                            {/* Bouton 2 : Grid */}


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
                                <FormatListBulletedIcon/>
                            </Button>
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
                                <GridViewIcon/>
                            </Button>
                        </Box>
                    </Box>
                </Grid>

            </Grid>

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
                            image={game.cover}
                            title={game.name}
                            rating={game.rating || game.aggregatedRating || '—'}
                        />
                    ))}
                </Box>
            )}

            {viewMode === 'list' && (
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, mt: '80px'}}>
                    {games.map((game) => (
                        <Box
                            key={game.id}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ddd',
                                padding: 2,
                            }}
                        >
                            <img
                                src={game.cover}
                                alt={game.name}
                                style={{width: '80px', height: '80px', marginRight: '10px'}}
                            />
                            <Box>
                                <h3 style={{margin: '0', fontSize: '14px'}}>{game.name}</h3>

                                {selectedFilter === 'termines' && (
                                    <>
                                        <p>Nombre de sessions: {game.sessions || '—'}</p>
                                        <p>Temps de jeu: {formatPlayTime(game.playTime || 0)}</p>
                                        <p>Plateforme: {game.platform || '—'}</p>
                                        <p>Ma note: <StarRating rating={game.rating || 0}/>
                                        </p>
                                    </>
                                )}
                                {selectedFilter === 'en_cours' && (
                                    <>
                                        <p>Dernière session: {game.lastSessionDate || '—'}</p>
                                        <p>Nombre de sessions: {game.sessions || '—'}</p>
                                        <p>Temps de jeu: {formatPlayTime(game.playTime || 0)}</p>
                                        <p>Plateforme: {game.platform || '—'}</p>
                                        <p>Ma note: <StarRating rating={game.rating || 0}/>
                                        </p>
                                    </>
                                )}
                                {selectedFilter === 'a_jouer' && (
                                    <>
                                        <p>Genres: {game.genres?.join(', ') || '—'}</p>
                                        <p>Plateforme: {game.platform || '—'}</p>
                                        <p>Note moyenne: <StarRating rating={game.aggregatedRating || 0}/></p>
                                    </>
                                )}
                                {selectedFilter === 'liste_de_souhaits' && (
                                    <>
                                        <p>Genres: {game.genres?.join(', ') || '—'}</p>
                                        <p>Date de sortie: {game.releaseDate || '—'}</p>
                                        <p>Note moyenne: <StarRating rating={game.rating || 0}/>
                                        </p>
                                    </>
                                )}
                                {selectedFilter === 'en_pause' && (
                                    <>
                                        <p>Dernière session: {game.lastSessionDate || '—'}</p>
                                        <p>Nombre de sessions: {game.sessions || '—'}</p>
                                        <p>Temps de jeu: {formatPlayTime(game.playTime || 0)}</p>
                                        <p>Plateforme: {game.platform || '—'}</p>
                                        <p>Ma note: <StarRating rating={game.rating || 0}/>
                                        </p>
                                    </>
                                )}
                                {selectedFilter === 'abandonnes' && (
                                    <>
                                        <p>Dernière session: {game.lastSessionDate || '—'}</p>
                                        <p>Nombre de sessions: {game.sessions || '—'}</p>
                                        <p>Temps de jeu: {formatPlayTime(game.playTime || 0)}</p>
                                        <p>Plateforme: {game.platform || '—'}</p>
                                        <p>Ma note: <StarRating rating={game.rating || 0}/>
                                        </p>
                                    </>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            )}

            {viewMode === 'table' && (
                <TableContainer component={Paper}
                                sx={{width: '80%', margin: '0 auto', boxShadow: '0px 0px 7px #000000', mt: '80px'}}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableHeaders[selectedFilter]?.map((header, index) => (
                                    <TableCell
                                        key={index}
                                        sx={{
                                            borderRight: '1px solid #000',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {games.map((game) => (
                                <TableRow key={game.id}>
                                    <TableCell sx={{
                                        borderRight: '1px solid #000',
                                        textAlign: 'center'
                                    }}>{game.name}</TableCell>
                                    {selectedFilter === 'termines' && (
                                        <>
                                            <TableCell sx={{
                                                borderRight: '1px solid #000',
                                                textAlign: 'center'
                                            }}>{game.sessions}</TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {formatPlayTime(game.playTime)}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}> <StarRating
                                                rating={game.rating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'en_cours' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.lastSessionDate}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.sessions}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {formatPlayTime(game.playTime)}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}> <StarRating
                                                rating={game.rating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'a_jouer' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.genres?.join(', ')}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}><StarRating
                                                rating={game.aggregatedRating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'liste_de_souhaits' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.genres?.join(', ')}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.releaseDate}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}><StarRating
                                                rating={game.aggregatedRating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'en_pause' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.lastSessionDate}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.sessions}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {formatPlayTime(game.playTime)}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}> <StarRating
                                                rating={game.rating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'abandonnes' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.lastSessionDate}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.sessions}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {formatPlayTime(game.playTime)}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}> <StarRating
                                                rating={game.rating || 0}/></TableCell>
                                        </>
                                    )}
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
