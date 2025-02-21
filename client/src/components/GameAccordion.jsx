import React, {useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Box, Rating, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {useTheme} from '@mui/material/styles';
import {useNavigate} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const GameAccordion = ({game, selectedFilter}) => {
    const {t} = useTranslation();
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate(); // Pour la navigation vers la page de détails

    const handleChange = () => {
        setExpanded(!expanded);
    };

    const handleImageClick = () => {
        navigate(`/details/${game.igdb_game_id}`); // Redirige vers la page de détails
    };

    const formatPlayTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} h ${mins} min`;
    };

    const theme = useTheme();

    return (
        <Accordion
            expanded={expanded}
            onChange={handleChange}
            sx={{
                width: '100%',
                marginBottom: '10px',
                backgroundColor: theme.palette.background.paper,
                boxShadow: `0px 0px 8px ${theme.palette.colors['blue-50']}`
            }}
        >
            <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{color: theme.palette.text.primary}}/>}
                aria-controls={`panel-${game.igdb_game_id}-content`}
                id={`panel-${game.igdb_game_id}-header`}
                sx={{
                    backgroundColor: theme.palette.colors['lightGray'],
                    color: theme.palette.text.primary,
                }}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <img
                        src={game.cover}
                        alt={game.title}
                        width={60}
                        height={90}
                        style={{cursor: 'pointer'}} // Ajoute un curseur pour indiquer la clicabilité
                        onClick={handleImageClick} // Gère le clic sur l'image
                    />
                    <Typography variant="h6">{game.title}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    {/* Rendu des données en fonction du filtre sélectionné */}
                    {selectedFilter === 'finish' && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.numberOfSession")} :</strong>
                                {game.sessionCount || t("game.notSpecified")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.timePlay")} :</strong>
                                {game.totalTimePlayed ? formatPlayTime(game.totalTimePlayed) : t("game.notAvailable")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.plateform")} :</strong>
                                {game.platform || t("game.notSpecified")}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <strong>{t("listPage.tableHeaders.myRating")} :</strong>
                                <Rating
                                    value={game.userRating || 0}
                                    precision={0.5}
                                    readOnly
                                    sx={{marginLeft: '10px', color: theme.palette.colors.yellow}}
                                />
                            </Box>
                        </>
                    )}

                    {selectedFilter === 'playing' && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.lastSession")} :</strong>
                                {game.lastSessionDate || t("game.notSpecified")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.numberOfSession")} :</strong>
                                {game.sessionCount || t("game.notSpecified")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.timePlay")} :</strong>
                                {game.totalTimePlayed ? formatPlayTime(game.totalTimePlayed) : t("game.notAvailable")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.platform")} :</strong>
                                {game.platform || t("game.notSpecified")}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <strong>{t("listPage.tableHeaders.myRating")} :</strong>
                                <Rating
                                    value={game.userRating || 0}
                                    precision={0.5}
                                    readOnly
                                    sx={{marginLeft: '10px', color: theme.palette.colors.yellow}}
                                />
                            </Box>
                        </>
                    )}

                    {selectedFilter === 'library' && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.genre")} :</strong>
                                {game.genres ? game.genres.map((genre) => genre.name).join(', ') : t("game.notSpecified")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.platform")} :</strong>
                                {game.platform || t("game.notSpecified")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.averageRating")} :</strong>
                                {game.averageRating || t("game.notAvailable")}
                            </Typography>
                        </>
                    )}

                    {selectedFilter === 'wishlist' && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.genre")} :</strong>
                                {game.genres ? game.genres.map((genre) => genre.name).join(', ') : t("game.notSpecified")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.numberOfSession")} :</strong>
                                {game.releaseDate || t("game.notSpecified")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.averageRating")} :</strong>
                                {game.averageRating || t("game.notAvailable")}
                            </Typography>
                        </>
                    )}

                    {(selectedFilter === 'paused' || selectedFilter === 'stopped') && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.lastSession")} :</strong>
                                {game.lastSessionDate || 'Non spécifiée'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.numberOfSession")} :</strong>
                                {game.sessions || 'Non spécifié'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.timePlay")} :</strong>
                                {game.timePlayed ? formatPlayTime(game.timePlayed) : t("game.notAvailable")}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>{t("listPage.tableHeaders.platform")} :</strong>
                                {game.platform || 'Non spécifiée'}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <strong>{t("listPage.tableHeaders.myRating")} :</strong>
                                <Rating
                                    value={game.userRating || 0}
                                    precision={0.5}
                                    readOnly
                                    sx={{marginLeft: '10px', color: theme.palette.colors.yellow}}
                                />
                            </Box>
                        </>
                    )}

                </Box>
            </AccordionDetails>
        </Accordion>
    );
};


export default GameAccordion;
