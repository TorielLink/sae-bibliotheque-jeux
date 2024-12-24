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
    TableRow,
    useMediaQuery,
    useTheme
} from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import GameCardTitle from "../components/GameCardTitle.jsx";
import ListImageCard from "../components/ListImageCard.jsx";
import StarRating from "../components/StarRating.jsx";

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
        {id: 'library', label: 'Dans la bibliothèque'},
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
                platform: "PlayStation",
                lastSessionDate: "18-12-2024",
                timePlayed: 152,
                userRating: 4.5,
                averageRating: "4",
                title: "The Witcher 3: Wild Hunt",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.png",
                releaseDate: "19-05-2015",
                genres: [
                    {id: 12, name: "Role-playing (RPG)", slug: "role-playing-rpg"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ],
                sessions: 12,
            },
            {
                igdb_game_id: 2958,
                platform: "PC",
                lastSessionDate: "15-12-2024",
                timePlayed: 200,
                userRating: 2,
                averageRating: "0",
                title: "Cyberpunk 2077",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co4wyy.png",
                releaseDate: "10-12-2020",
                genres: [
                    {id: 31, name: "Adventure", slug: "adventure"},
                    {id: 15, name: "Shooter", slug: "shooter"}
                ],
                sessions: 25,
            }
        ],
        playing: [
            {
                igdb_game_id: 5896,
                platform: "Switch",
                lastSessionDate: "01-12-2024",
                timePlayed: 50,
                userRating: 1,
                averageRating: "3.5",
                title: "Hades",
                cover: "https://images.igdb.com/igdb/image/upload/t_cover_big/co5hades.png",
                releaseDate: "17-09-2020",
                genres: [
                    {id: 24, name: "Indie", slug: "indie"},
                    {id: 31, name: "Adventure", slug: "adventure"}
                ],
                sessions: 5,
            }
        ]
    };

    const formatPlayTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} h ${mins} min`;
    };

    const games = fakeGames[selectedFilter]?.slice(0, 5) || [];

    return (
        <Box style={{padding: '2px', overflowX: 'hidden', overflowY: 'auto'}}>
            <Grid container sx={{m: 1}} alignItems='flex-start' columnSpacing={2}>
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            background: '#F5F5F5',
                            boxShadow: '0px 0px 7px #000000',
                            borderRadius: '5px',
                            padding: '0 10px',
                            height: '45px',
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flexWrap: isMobile ? 'wrap' : 'nowrap',
                                fontSize: isMobile ? '12px' : '14px',
                            }}
                        >
                            {filters.map((filter) => (
                                <Box
                                    key={filter.id}
                                    sx={{
                                        margin: '0 5px',
                                        padding: '8px 16px',
                                        cursor: 'pointer',
                                        backgroundColor: selectedFilter === filter.id ? '#D6BBFB' : 'transparent',
                                        color: selectedFilter === filter.id ? '#000' : '#555',
                                        textAlign: 'center',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}
                                    onClick={() => handleFilterChange(filter.id)}
                                >
                                    {filter.label}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                </Grid>

                {!isMobile && (
                    <Grid item md={4}>
                        <Box sx={{display: 'flex', gap: 1}}>
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
                                    <ViewWeekIcon/>
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                )}
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
                <Grid container spacing={2} justifyContent="center" sx={{mt: "20px"}}>
                    {games.map((game) => (
                        <Grid item key={game.igdb_game_id} xs={12} sm={6} md={5.5}>
                            <ListImageCard
                                id={game.igdb_game_id}
                                image={game.cover}
                                title={game.title}
                                rating={game.userRating || game.averageRating || "—"}
                                genres={game.genres || []}
                                platform={game.platform || "Non spécifiée"}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {viewMode === 'table' && (
                <TableContainer
                    component={Paper}
                    sx={{width: '80%', margin: '0 auto', boxShadow: '0px 0px 7px #000000', mt: '80px'}}
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
                                    <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                        {game.title}
                                    </TableCell>

                                    {selectedFilter === 'finish' && (
                                        <>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.sessions || '—'}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {formatPlayTime(game.timePlayed)}
                                            </TableCell>
                                            <TableCell sx={{borderRight: '1px solid #000', textAlign: 'center'}}>
                                                {game.platform || 'Non spécifiée'}
                                            </TableCell>
                                            <TableCell sx={{textAlign: 'center'}}>
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
        </Box>
    );
};

export default ListsPage;