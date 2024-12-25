import React, {useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Box, Rating, Typography} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const GameAccordion = ({game, selectedFilter}) => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = () => {
        setExpanded(!expanded);
    };

    const formatPlayTime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} h ${mins} min`;
    };

    return (
        <Accordion expanded={expanded} onChange={handleChange} sx={{width: '100%', marginBottom: '10px'}}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon/>}
                aria-controls={`panel-${game.igdb_game_id}-content`}
                id={`panel-${game.igdb_game_id}-header`}
                sx={{backgroundColor: '#f5f5f5'}}
            >
                <Box sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                    <img src={game.cover} alt={game.title} width={60} height={90}/>
                    <Typography variant="h6">{game.title}</Typography>
                </Box>
            </AccordionSummary>
            <AccordionDetails>
                <Box>
                    {/* Rendu des données en fonction du filtre sélectionné */}
                    {selectedFilter === 'finish' && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Nombre de sessions:</strong> {game.sessions || 'Non spécifié'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Temps
                                    joué:</strong> {game.timePlayed ? formatPlayTime(game.timePlayed) : 'Non disponible'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Plateforme:</strong> {game.platform || 'Non spécifiée'}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <strong>Ma note:</strong>
                                <Rating value={game.userRating || 0} precision={0.5} readOnly
                                        sx={{marginLeft: '10px'}}/>
                            </Box>
                        </>
                    )}

                    {selectedFilter === 'playing' && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Dernière session:</strong> {game.lastSessionDate || 'Non spécifiée'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Nombre de sessions:</strong> {game.sessions || 'Non spécifié'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Temps
                                    joué:</strong> {game.timePlayed ? formatPlayTime(game.timePlayed) : 'Non disponible'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Plateforme:</strong> {game.platform || 'Non spécifiée'}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <strong>Ma note:</strong>
                                <Rating value={game.userRating || 0} precision={0.5} readOnly
                                        sx={{marginLeft: '10px'}}/>
                            </Box>
                        </>
                    )}

                    {selectedFilter === 'library' && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Genres:</strong> {game.genres ? game.genres.map((genre) => genre.name).join(', ') : 'Non spécifié'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Plateforme:</strong> {game.platform || 'Non spécifiée'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Note moyenne:</strong> {game.averageRating || 'Non disponible'}
                            </Typography>
                        </>
                    )}

                    {selectedFilter === 'wishlist' && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Genres:</strong> {game.genres ? game.genres.map((genre) => genre.name).join(', ') : 'Non spécifié'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Date de sortie:</strong> {game.releaseDate || 'Non spécifiée'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Note moyenne:</strong> {game.averageRating || 'Non disponible'}
                            </Typography>
                        </>
                    )}

                    {(selectedFilter === 'paused' || selectedFilter === 'stopped') && (
                        <>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Dernière session:</strong> {game.lastSessionDate || 'Non spécifiée'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Nombre de sessions:</strong> {game.sessions || 'Non spécifié'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Temps
                                    joué:</strong> {game.timePlayed ? formatPlayTime(game.timePlayed) : 'Non disponible'}
                            </Typography>
                            <Typography variant="body1" sx={{marginBottom: '10px'}}>
                                <strong>Plateforme:</strong> {game.platform || 'Non spécifiée'}
                            </Typography>
                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                <strong>Ma note:</strong>
                                <Rating value={game.userRating || 0} precision={0.5} readOnly
                                        sx={{marginLeft: '10px'}}/>
                            </Box>
                        </>
                    )}
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default GameAccordion;
