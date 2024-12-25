// pages/ListsPage.jsx
import React, {useContext, useState} from 'react';
import {AuthContext} from '../components/AuthContext';
import {
    Box,
    Button,
    Grid,
    Grid2,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import GameCardTitle from '../components/GameCardTitle.jsx';
import ListImageCard from '../components/ListImageCard.jsx';
import StarRating from '../components/StarRating.jsx';
// Import du composant FilterBarList
import FilterBarList from '../components/FilterBarList.jsx';
// Import du composant GameAccordion
import GameAccordion from '../components/GameAccordion.jsx';

const ListsPage = () => {
    const {user} = useContext(AuthContext);
    const userId = user?.id;

    const [selectedFilter, setSelectedFilter] = useState('finish');
    const [viewMode, setViewMode] = useState('grid');

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const filters = [
        {id: 'finish', label: 'Terminés'},
        {id: 'playing', label: 'En cours'},
        {id: 'library', label: 'A jouer'},
        {id: 'wishlist', label: 'Liste de souhaits'},
        {id: 'paused', label: 'En pause'},
        {id: 'stopped', label: 'Abandonnés'},
    ];

    const tableHeaders = {
        finish: ['Nom du jeu', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'],
        playing: ['Nom du jeu', 'Dernière session', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'],
        library: ['Nom du jeu', 'Genres', 'Plateforme', 'Note moyenne'],
        wishlist: ['Nom du jeu', 'Genres', 'Date de sortie', 'Note moyenne'],
        paused: ['Nom du jeu', 'Dernière session', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'],
        stopped: ['Nom du jeu', 'Dernière session', 'Nombre de sessions', 'Temps joué', 'Plateforme', 'Ma note'],
    };

    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
    };

    const fakeGames = {
        finish: [
            {
                igdb_game_id: 1942,
                platform: 'PlayStation',
                lastSessionDate: '18-12-2024',
                timePlayed: 152,
                userRating: 4.5,
                averageRating: '4',
                title: 'The Witcher 3: Wild Hunt',
                cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.png',
                releaseDate: '19-05-2015',
                genres: [
                    {id: 12, name: 'Role-playing (RPG)', slug: 'role-playing-rpg'},
                    {id: 31, name: 'Adventure', slug: 'adventure'},
                ],
                sessions: 12,
            },
            {
                igdb_game_id: 2958,
                platform: 'PC',
                lastSessionDate: '15-12-2024',
                timePlayed: 200,
                userRating: 2,
                averageRating: '0',
                title: 'Cyberpunk 2077',
                cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4wyy.png',
                releaseDate: '10-12-2020',
                genres: [
                    {id: 31, name: 'Adventure', slug: 'adventure'},
                    {id: 15, name: 'Shooter', slug: 'shooter'},
                ],
                sessions: 25,
            },
        ],
        playing: [
            {
                igdb_game_id: 5896,
                platform: 'Switch',
                lastSessionDate: '01-12-2024',
                timePlayed: 50,
                userRating: 1,
                averageRating: '3.5',
                title: 'Hades',
                cover: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co5hades.png',
                releaseDate: '17-09-2020',
                genres: [
                    {id: 24, name: 'Indie', slug: 'indie'},
                    {id: 31, name: 'Adventure', slug: 'adventure'},
                ],
                sessions: 5,
            },
        ],
        library: [
            {
                igdb_game_id: 4021,
                platform: "Xbox",
                lastSessionDate: "20-12-2024",
                timePlayed: 300,
                userRating: 5,
                averageRating: "4.8",
                title: "Halo Infinite",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co6halo.png",
                releaseDate: "08-12-2021",
                genres: [
                    {id: 9, name: "Shooter", slug: "shooter"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ],
                sessions: 30,
            },
            {
                igdb_game_id: 5034,
                platform: "PC",
                lastSessionDate: "22-12-2024",
                timePlayed: 120,
                userRating: 4,
                averageRating: "4.2",
                title: "Stardew Valley",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co7stardew.png",
                releaseDate: "26-02-2016",
                genres: [
                    {id: 11, name: "Simulation", slug: "simulation"},
                    {id: 28, name: "Indie", slug: "indie"}
                ],
                sessions: 15,
            }
        ],
        wishlist: [
            {
                igdb_game_id: 6043,
                platform: "PlayStation",
                lastSessionDate: "N/A",
                timePlayed: 0,
                userRating: 0,
                averageRating: "4.5",
                title: "Elden Ring",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co8elden.png",
                releaseDate: "25-02-2022",
                genres: [
                    {id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ],
                sessions: 0,
            },
            {
                igdb_game_id: 7056,
                platform: "PC",
                lastSessionDate: "N/A",
                timePlayed: 0,
                userRating: 0,
                averageRating: "4.0",
                title: "The Legend of Zelda: Breath of the Wild 2",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co9zelda.png",
                releaseDate: "TBA",
                genres: [
                    {id: 31, name: "Adventure", slug: "adventure"},
                    {id: 24, name: "Indie", slug: "indie"}
                ],
                sessions: 0,
            }
        ],
        paused: [
            {
                igdb_game_id: 8067,
                platform: "Nintendo Switch",
                lastSessionDate: "10-12-2024",
                timePlayed: 80,
                userRating: 3,
                averageRating: "3.5",
                title: "Animal Crossing: New Horizons",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co10acnh.png",
                releaseDate: "20-03-2020",
                genres: [
                    {id: 11, name: "Simulation", slug: "simulation"},
                    {id: 28, name: "Indie", slug: "indie"}
                ],
                sessions: 8,
            },
            {
                igdb_game_id: 9078,
                platform: "PC",
                lastSessionDate: "05-12-2024",
                timePlayed: 90,
                userRating: 2.5,
                averageRating: "3.0",
                title: "No Man's Sky",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co11nms.png",
                releaseDate: "01-08-2016",
                genres: [
                    {id: 31, name: "Adventure", slug: "adventure"},
                    {id: 24, name: "Indie", slug: "indie"}
                ],
                sessions: 9,
            }
        ],
        stopped: [
            {
                igdb_game_id: 10089,
                platform: "PlayStation",
                lastSessionDate: "12-12-2024",
                timePlayed: 30,
                userRating: 1,
                averageRating: "2.5",
                title: "Assassin's Creed Valhalla",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co12acv.png",
                releaseDate: "10-11-2020",
                genres: [
                    {id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg"},
                    {id: 9, name: "Shooter", slug: "shooter"}
                ],
                sessions: 3,
            },
            {
                igdb_game_id: 11090,
                platform: "Xbox",
                lastSessionDate: "14-12-2024",
                timePlayed: 45,
                userRating: 1.5,
                averageRating: "2.0",
                title: "Battlefield 2042",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co13bf2042.png",
                releaseDate: "19-11-2021",
                genres: [
                    {id: 9, name: "Shooter", slug: "shooter"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ],
                sessions: 4,
            }
        ],
    };

    const formatPlayTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} h ${mins} min`;
    };

    const games = fakeGames[selectedFilter]?.slice(0, 5) || [];

    return (
        <Box style={{padding: '0.125em', overflowX: 'hidden', overflowY: 'auto'}}>
            <Grid2
                container
                sx={{
                    marginLeft: '1.25em',
                    marginRight: '1.25em',
                    alignItems: 'center',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '8fr 2fr',
                    columnGap: '1em',
                }}
            >
                {/* Barre de filtres */}
                <Grid2 item sx={{gridColumn: '1 / span 1'}}>
                    <FilterBarList
                        filters={filters}
                        selectedFilter={selectedFilter}
                        onFilterChange={handleFilterChange}
                    />
                </Grid2>

                {/* Barre de changement d'affichage (affichée uniquement en version desktop) */}
                {!isMobile && (
                    <Grid2
                        item
                        sx={{
                            gridColumn: '2 / span 1',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '9em',
                                backgroundColor: '#E0E0E0',
                                borderRadius: '0.625em',
                                height: '2.5625em',
                                boxShadow: '0em 0em 0.4375em rgba(0, 0, 0, 0.2)',
                            }}
                        >
                            {/* Boutons */}
                            <Button
                                variant="text"
                                onClick={() => setViewMode('list')}
                                sx={{
                                    backgroundColor: viewMode === 'list' ? '#B0B0B0' : '#E0E0E0',
                                    color: '#000',
                                    borderRadius: '0.3125em',
                                    minWidth: 0,
                                    width: '33%',
                                    height: '100%',
                                }}
                            >
                                <FormatListBulletedIcon fontSize="small"/>
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => setViewMode('grid')}
                                sx={{
                                    backgroundColor: viewMode === 'grid' ? '#B0B0B0' : '#E0E0E0',
                                    color: '#000',
                                    borderRadius: '0.3125em',
                                    minWidth: 0,
                                    width: '33%',
                                    height: '100%',
                                }}
                            >
                                <GridViewIcon fontSize="small"/>
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => setViewMode('table')}
                                sx={{
                                    backgroundColor: viewMode === 'table' ? '#B0B0B0' : '#E0E0E0',
                                    color: '#000',
                                    borderRadius: '0.3125em',
                                    minWidth: 0,
                                    width: '33%',
                                    height: '100%',
                                }}
                            >
                                <ViewWeekIcon fontSize="small"/>
                            </Button>
                        </Box>
                    </Grid2>
                )}
            </Grid2>


            {/* Affichage des jeux */}
            {isMobile ? (
                <Box sx={{padding: '0.75em', mt: '1.875em'}}>
                    {games.map((game) => (
                        <GameAccordion key={game.igdb_game_id} game={game} selectedFilter={selectedFilter}/>
                    ))}
                </Box>
            ) : (
                <>
                    {viewMode === 'grid' && (
                        <Box
                            sx={{

                                padding: '0.75em',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '1em',
                                justifyContent: 'center',
                                mt: '1.875em',
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
                        <Grid container spacing={2} justifyContent="center" sx={{mt: '1.25em'}}>
                            {games.map((game) => (
                                <Grid item key={game.igdb_game_id} xs={12} sm={6} md={5.5}>
                                    <ListImageCard
                                        id={game.igdb_game_id}
                                        image={game.cover}
                                        title={game.title}
                                        rating={game.userRating || game.averageRating || '—'}
                                        genres={game.genres || []}
                                        platform={game.platform || 'Non spécifiée'}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    )}


                    {viewMode === 'table' && (
                        <TableContainer
                            component={Paper}
                            sx={{
                                marginLeft: '1.25em',
                                marginRight: '1.25em',
                                width: 'auto',
                                boxShadow: '0em 0em 0.4375em #000000',
                                mt: '5em',
                            }}
                        >
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {tableHeaders[selectedFilter]?.map((header, index) => (
                                            <TableCell
                                                key={index}
                                                sx={{
                                                    borderRight: '1px solid #000',
                                                    textAlign: 'center',
                                                    fontWeight: 'bold',
                                                    whiteSpace: 'nowrap',
                                                    padding: '5px',
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
                                            {/* Nom du jeu */}
                                            <TableCell
                                                sx={{
                                                    borderRight: '1px solid #000',
                                                    textAlign: 'center',
                                                    whiteSpace: 'nowrap',
                                                    padding: '5px',
                                                }}
                                            >
                                                {game.title || '—'}
                                            </TableCell>

                                            {/* Filtres spécifiques */}
                                            {selectedFilter === 'finish' && (
                                                <>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.sessions || '—'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {formatPlayTime(game.timePlayed)}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.platform || 'Non spécifiée'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        <StarRating rating={game.userRating || 0}/>
                                                    </TableCell>
                                                </>
                                            )}

                                            {selectedFilter === 'playing' && (
                                                <>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.lastSessionDate || '—'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.sessions || '—'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {formatPlayTime(game.timePlayed)}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.platform || 'Non spécifiée'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        <StarRating rating={game.userRating || 0}/>
                                                    </TableCell>
                                                </>
                                            )}

                                            {selectedFilter === 'library' && (
                                                <>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            padding: '5px',
                                                            display: 'flex',
                                                            gap: '3px',
                                                            justifyContent: 'start',
                                                            flexWrap: 'wrap',
                                                        }}
                                                    >
                                                        {game.genres?.map((genre, index) => (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    background: '#FE4A49',
                                                                    boxShadow: '0px 0px 2px #000000',
                                                                    borderRadius: '5px',
                                                                    padding: '3px 6px',
                                                                    color: '#FFFFFF',
                                                                    fontSize: '0.75em',
                                                                    fontWeight: 'bold',
                                                                    margin: '1px',
                                                                }}
                                                            >
                                                                {genre.name}
                                                            </Box>
                                                        )) || 'Non spécifié'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.platform || 'Non spécifiée'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.averageRating || '—'}
                                                    </TableCell>
                                                </>
                                            )}

                                            {selectedFilter === 'wishlist' && (
                                                <>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            padding: '5px',
                                                            display: 'flex',
                                                            gap: '3px',
                                                            justifyContent: 'start',
                                                            flexWrap: 'wrap',
                                                        }}
                                                    >
                                                        {game.genres?.map((genre, index) => (
                                                            <Box
                                                                key={index}
                                                                sx={{
                                                                    background: '#FE4A49',
                                                                    boxShadow: '0px 0px 2px #000000',
                                                                    borderRadius: '5px',
                                                                    padding: '3px 6px',
                                                                    color: '#FFFFFF',
                                                                    fontSize: '0.75em',
                                                                    fontWeight: 'bold',
                                                                    margin: '1px',
                                                                }}
                                                            >
                                                                {genre.name}
                                                            </Box>
                                                        )) || 'Non spécifié'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.releaseDate || '—'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.averageRating || '—'}
                                                    </TableCell>
                                                </>
                                            )}

                                            {(selectedFilter === 'paused' || selectedFilter === 'stopped') && (
                                                <>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.lastSessionDate || '—'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.sessions || '—'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {formatPlayTime(game.timePlayed)}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            borderRight: '1px solid #000',
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        {game.platform || 'Non spécifiée'}
                                                    </TableCell>
                                                    <TableCell
                                                        sx={{
                                                            textAlign: 'center',
                                                            whiteSpace: 'nowrap',
                                                            padding: '5px',
                                                        }}
                                                    >
                                                        <StarRating rating={game.userRating || 0}/>
                                                    </TableCell>
                                                </>
                                            )}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}
        </Box>
    );
};

export default ListsPage;
