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
        {id: 'finish', label: 'Terminés'},          // Finish
        {id: 'playing', label: 'En cours'},        // Playing
        {id: 'library', label: 'Dans la bibliothèque'}, // Library
        {id: 'wishlist', label: 'Liste de souhaits'},   // Wishlist
        {id: 'paused', label: 'En pause'},         // Paused
        {id: 'stopped', label: 'Abandonnés'},      // Stopped
    ];


    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    // Jeux factices
    const fakeGames = {
        finish: [
            {
                igdb_game_id: 1942,
                platform: "PlayStation",
                lastSessionDate: "18-12-2024",
                timePlayed: 152,
                userRating: 8,
                averageRating: "8.0",
                title: "The Witcher 3: Wild Hunt",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.png",
                releaseDate: "19-05-2015",
                genres: [
                    {id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ]
            },
            {
                igdb_game_id: 2958,
                platform: "PC",
                lastSessionDate: "15-12-2024",
                timePlayed: 200,
                userRating: 9,
                averageRating: "9.0",
                title: "Cyberpunk 2077",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4wyy.png",
                releaseDate: "10-12-2020",
                genres: [
                    {id: 31, name: "Adventure", slug: "adventure"},
                    {id: 15, name: "Shooter", slug: "shooter"}
                ]
            }
        ],
        playing: [
            {
                igdb_game_id: 5896,
                platform: "Switch",
                lastSessionDate: "01-12-2024",
                timePlayed: 50,
                userRating: 7,
                averageRating: "7.5",
                title: "Hades",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5hades.png",
                releaseDate: "17-09-2020",
                genres: [
                    {id: 24, name: "Indie", slug: "indie"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ]
            }
        ],
        library: [
            {
                igdb_game_id: 8761,
                platform: "PC",
                lastSessionDate: null,
                timePlayed: 0,
                userRating: null,
                averageRating: "8.2",
                title: "Elden Ring",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6eldenring.png",
                releaseDate: "25-02-2022",
                genres: [
                    {id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ]
            }
        ],
        wishlist: [
            {
                igdb_game_id: 9021,
                platform: "PlayStation",
                lastSessionDate: null,
                timePlayed: 0,
                userRating: null,
                averageRating: "7.8",
                title: "Final Fantasy XVI",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7ffxvi.png",
                releaseDate: "22-06-2023",
                genres: [
                    {id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ]
            }
        ],
        paused: [
            {
                igdb_game_id: 3045,
                platform: "Xbox",
                lastSessionDate: "05-12-2024",
                timePlayed: 45,
                userRating: 6,
                averageRating: "6.5",
                title: "Anthem",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1anthem.png",
                releaseDate: "22-02-2019",
                genres: [
                    {id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ]
            }
        ],
        stopped: [
            {
                igdb_game_id: 4563,
                platform: "PC",
                lastSessionDate: "30-11-2024",
                timePlayed: 120,
                userRating: 5,
                averageRating: "5.8",
                title: "Fallout 76",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4fallout.png",
                releaseDate: "14-11-2018",
                genres: [
                    {id: 31, name: "Adventure", slug: "adventure"},
                    {id: 25, name: "Survival", slug: "survival"}
                ]
            }
        ]
    };

    const formatPlayTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} h ${mins} min`;
    };

    const games = fakeGames[selectedFilter]?.slice(0, 5) || [];

    const tableHeaders = {
        finish: ['Nom du jeu', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'], // Terminés
        playing: ['Nom du jeu', 'Dernière session', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'], // En cours
        library: ['Nom du jeu', 'Genres', 'Plateforme', 'Note moyenne'], // Dans la bibliothèque
        wishlist: ['Nom du jeu', 'Genres', 'Date de sortie', 'Note moyenne'], // Liste de souhaits
        paused: ['Nom du jeu', 'Dernière session', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'], // En pause
        stopped: ['Nom du jeu', 'Dernière session', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'], // Abandonnés
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
                            key={game.igdb_game_id}
                            id={game.igdb_game_id}
                            image={game.cover}
                            title={game.title}
                            rating={game.userRating || game.averageRating || '—'}
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
                            key={game.igdb_game_id}
                            xs={12}
                            sm={6}
                            md={5.5} // Réduit légèrement la taille des cartes
                        >
                            <ListImageCard
                                id={game.igdb_game_id}
                                image={game.cover}
                                title={game.title}
                                rating={game.userRating || game.averageRating || "—"}
                                genres={game.genres.map(genre => genre.name).join(', ') || '—'}
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
                                <TableRow key={game.igdb_game_id}>
                                    <TableCell sx={{
                                        borderRight: '1px solid #000',
                                        textAlign: 'center'
                                    }}>{game.title}</TableCell>
                                    {selectedFilter === 'finish' && (
                                        <>
                                            <TableCell sx={{
                                                borderRight: '1px solid #000',
                                                textAlign: 'center'
                                            }}>{game.sessions || '—'}</TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {formatPlayTime(game.timePlayed)}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}> <StarRating
                                                rating={game.userRating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'playing' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.lastSessionDate || '—'}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.sessions || '—'}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {formatPlayTime(game.timePlayed)}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}> <StarRating
                                                rating={game.userRating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'library' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.genres.map(genre => genre.name).join(', ') || '—'}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform || '—'}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}><StarRating
                                                rating={game.averageRating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'wishlist' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.genres.map(genre => genre.name).join(', ') || '—'}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.releaseDate || '—'}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}><StarRating
                                                rating={game.averageRating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'paused' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.lastSessionDate || '—'}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.sessions || '—'}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {formatPlayTime(game.timePlayed)}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}> <StarRating
                                                rating={game.userRating || 0}/></TableCell>
                                        </>
                                    )}
                                    {selectedFilter === 'stopped' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.lastSessionDate || '—'}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.sessions || '—'}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {formatPlayTime(game.timePlayed)}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}> <StarRating
                                                rating={game.userRating || 0}/></TableCell>
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
