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
// On importe la carte overlay
import GameCardTitle from "../components/GameCardTitle.jsx";
import StarRating from "../components/StarRating.jsx";
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import ListImageCard from "../components/ListImageCard.jsx";

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
                genres: ['RPG', 'Fantasy'],
            },
            {
                id: 2,
                cover: 'https://via.placeholder.com/150',
                name: 'Astro Bot',
                sessions: 12,
                playTime: 730,
                platform: 'PS5',
                rating: 4,
                genres: ['RPG', 'Fantasy'],
            }
        ],
        en_cours: [
            {
                id: 4,
                cover: 'https://via.placeholder.com/150',
                name: 'Elden Ring',
                lastSessionDate: '01-10-2023',
                genres: ['RPG', 'Fantasy'],
                sessions: 10,
                playTime: 1200,
                platform: 'PC',
                rating: 4,
            },
            {
                id: 5,
                cover: 'https://via.placeholder.com/150',
                name: 'Hades',
                lastSessionDate: '01-10-2023',
                sessions: 15,
                playTime: 800,
                platform: 'Switch',
                rating: 4,
                genres: ['RPG', 'Fantasy'],
            }
        ],
        a_jouer: [
            {
                id: 7,
                cover: 'https://via.placeholder.com/150',
                name: 'Final Fantasy XVI',
                genres: ['RPG', 'Fantasy'],
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
                lastSessionDate: '01-10-2023',
                sessions: 20,
                playTime: 2000,
                platform: 'PC',
                rating: 1,
                genres: ['RPG', 'Fantasy'],
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
                genres: ['RPG', 'Fantasy'],
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
                                <GridViewIcon/>
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
                                <ViewWeekIcon/>
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
                        <GameCardTitle
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
                <Grid
                    container
                    spacing={2}
                    justifyContent="center"
                    sx={{mt: "20px"}}
                >
                    {games.map((game) => (
                        <Grid
                            item
                            key={game.id}
                            xs={12}
                            sm={6}
                            md={5.5} // Réduit légèrement la taille des cartes
                        >
                            <ListImageCard
                                id={game.id}
                                image={game.cover}
                                title={game.name}
                                rating={game.rating || game.aggregatedRating || "—"}
                                genres={game.genres || []}
                                platform={game.platform || "—"}
                            />
                        </Grid>
                    ))}
                </Grid>

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
