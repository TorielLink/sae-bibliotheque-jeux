import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../components/AuthContext';
import {
    Box,
    Button,
    CircularProgress,
    Grid,
    Grid2,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import GameCardTitle from '../../components/GameCardTitle.jsx';
import ListImageCard from '../../components/ListImageCard.jsx';
import StarRating from '../../components/StarRating.jsx';
import FilterBarList from '../../components/FilterBarList.jsx';
import GameAccordion from '../../components/GameAccordion.jsx';

const MyListsPage = () => {
    const {user} = useContext(AuthContext);
    const userId = user?.id;

    const [selectedFilter, setSelectedFilter] = useState('playing'); // Filtre initial
    const [viewMode, setViewMode] = useState('grid');
    const [gamesData, setGamesData] = useState({
        finish: [],
        playing: [],
        library: [],
        wishlist: [],
        paused: [],
        stopped: [],
    });
    const [loading, setLoading] = useState(true); // Initialiser à true pour charger dès le début
    const [error, setError] = useState(null);

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

    // Mapping entre les IDs de filtres et les valeurs attendues par l'API
    const filterStatusMapping = {
        finish: 'Finished',
        playing: 'Playing',
        library: 'Library',
        wishlist: 'Wishlist',
        paused: 'Paused',
        stopped: 'Stopped',
    };

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

    // Fonction pour formater le temps de jeu
    const formatPlayTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} h ${mins} min`;
    };

    useEffect(() => {
        if (!userId) return;

        const fetchAllGames = async () => {
            setLoading(true);
            setError(null);
            try {
                const fetchPromises = filters.map(async (filter) => {
                    const gameStatusName = filterStatusMapping[filter.id];
                    const apiUrl = `http://localhost:8080/game-status/games-by-status?userId=${userId}&gameStatusName=${encodeURIComponent(gameStatusName)}`;
                    console.log(`Fetching games for filter "${filter.id}" with URL: ${apiUrl}`); // Debug

                    const response = await fetch(apiUrl, {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.status === 404) {
                        // Aucun jeu trouvé pour ce filtre, retourner une liste vide
                        console.warn(`Aucun jeu trouvé pour le filtre "${filter.id}".`);
                        return {filterId: filter.id, games: []};
                    }

                    if (!response.ok) {
                        throw new Error(`Erreur pour le filtre "${filter.id}": ${response.status} ${response.statusText}`);
                    }

                    const result = await response.json();
                    console.log(`API Response for filter "${filter.id}":`, result); // Debug

                    return {filterId: filter.id, games: result.data || []};
                });

                const results = await Promise.all(fetchPromises);
                const newGamesData = {...gamesData};

                results.forEach(({filterId, games}) => {
                    newGamesData[filterId] = games;
                });

                setGamesData(newGamesData);
            } catch (err) {
                setError(err.message);
                console.error('Erreur lors de la récupération des jeux:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllGames();
    }, [userId]); // Dépendance uniquement sur userId pour charger une fois

    return (
        <Box style={{padding: '0.125em', overflowX: 'hidden', overflowY: 'auto'}}>
            {/* Navigation en haut */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5em',
                    fontSize: '1em',
                    color: theme.palette.colors?.red || '#FF0000',
                }}
            >
                <Typography variant="body1" sx={{color: '#555', marginRight: '0.5em'}}>
                    Listes de jeux
                </Typography>
                <Typography variant="body1" sx={{color: theme.palette.colors?.red || '#FF0000'}}>
                    &gt; {filters.find((f) => f.id === selectedFilter)?.label || ''}
                </Typography>
            </Box>
            <Grid2
                container
                sx={{
                    padding: '0.5em',
                    alignItems: 'center',
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '8fr 2fr',
                    columnGap: '1em',
                    minHeight: '3em',
                    backgroundColor: theme.backgroundColor,
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
                            height: '100%', // Assure une hauteur fixe
                        }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '9em',
                                backgroundColor: theme.backgroundColor,
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
                                    padding: 0,
                                }}
                            >
                                <FormatListBulletedIcon fontSize="small"/>
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => setViewMode('grid')}
                                sx={{
                                    backgroundColor: viewMode === 'grid' ? '#B0B0B0' : '#E0E0E0',
                                    color: theme.palette.text.primary,
                                    borderRadius: '0.3125em',
                                    minWidth: 0,
                                    width: '33%',
                                    height: '100%',
                                    padding: 0,
                                }}
                            >
                                <GridViewIcon fontSize="small"/>
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => setViewMode('table')}
                                sx={{
                                    backgroundColor: viewMode === 'table' ? '#B0B0B0' : '#E0E0E0',
                                    color: theme.palette.text.primary,
                                    borderRadius: '0.3125em',
                                    minWidth: 0,
                                    width: '33%',
                                    height: '100%',
                                    padding: 0,
                                }}
                            >
                                <ViewWeekIcon fontSize="small"/>
                            </Button>
                        </Box>
                    </Grid2>
                )}
            </Grid2>

            {/* Conteneur pour l'affichage conditionnel avec une hauteur minimale pour éviter les changements de layout */}
            <Box
                sx={{
                    minHeight: '200px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    mt: '2em',
                    transition: 'all 0.3s ease-in-out',
                }}
            >
                {loading ? (
                    <CircularProgress/>
                ) : error ? (
                    <Typography color="error">Erreur: {error}</Typography>
                ) : (
                    // Affichage des jeux ou message s'il n'y en a pas
                    <>
                        {gamesData[selectedFilter]?.length === 0 ? (
                            <Typography>Aucun jeu trouvé pour ce filtre.</Typography>
                        ) : (
                            <>
                                {isMobile ? (
                                    <Box sx={{padding: '0.75em', mt: '1.875em', width: '100%'}}>
                                        {gamesData[selectedFilter].map((game) => (
                                            <GameAccordion key={game.igdb_game_id} game={game}
                                                           selectedFilter={selectedFilter}/>
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
                                                {gamesData[selectedFilter].map((game) => (
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
                                            <Grid container spacing={2} justifyContent="center"
                                                  sx={{mt: '1.25em', width: '100%'}}>
                                                {gamesData[selectedFilter].map((game) => (
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
                                                        {gamesData[selectedFilter].map((game) => (
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
                                                                            {game.sessionCount || '—'}
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{
                                                                                borderRight: '1px solid #000',
                                                                                textAlign: 'center',
                                                                                whiteSpace: 'nowrap',
                                                                                padding: '5px',
                                                                            }}
                                                                        >
                                                                            {formatPlayTime(game.totalTimePlayed)}
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
                                                                            {game.sessionCount || '—'}
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{
                                                                                borderRight: '1px solid #000',
                                                                                textAlign: 'center',
                                                                                whiteSpace: 'nowrap',
                                                                                padding: '5px',
                                                                            }}
                                                                        >
                                                                            {formatPlayTime(game.totalTimePlayed)}
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
                                                                                        background: theme.palette.colors.red,
                                                                                        boxShadow: '0px 0px 2px #000000',
                                                                                        borderRadius: '5px',
                                                                                        padding: '3px 6px',
                                                                                        color: theme.palette.text.contrast,
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
                                                                                        background: theme.palette.colors.red,
                                                                                        boxShadow: '0px 0px 2px #000000',
                                                                                        borderRadius: '5px',
                                                                                        padding: '3px 6px',
                                                                                        color: theme.palette.text.contrast,
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
                                                                            {game.sessionCount || '—'}
                                                                        </TableCell>
                                                                        <TableCell
                                                                            sx={{
                                                                                borderRight: '1px solid #000',
                                                                                textAlign: 'center',
                                                                                whiteSpace: 'nowrap',
                                                                                padding: '5px',
                                                                            }}
                                                                        >
                                                                            {formatPlayTime(game.totalTimePlayed)}
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
                            </>
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
};

export default MyListsPage;
