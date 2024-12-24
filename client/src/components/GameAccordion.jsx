// components/GameAccordion.jsx
import React, {useState} from 'react';
import {Accordion, AccordionDetails, AccordionSummary, Box, Rating, Typography,} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const GameAccordion = ({game}) => {
    const [expanded, setExpanded] = useState(false);

    const handleChange = () => {
        setExpanded(!expanded);
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
                    <Typography variant="body1" sx={{marginBottom: '10px'}}>
                        <strong>Genres:</strong> {game.genres ? game.genres.map((genre) => genre.name).join(', ') : 'Non spécifié'}
                    </Typography>
                    <Typography variant="body1" sx={{marginBottom: '10px'}}>
                        <strong>Plateforme:</strong> {game.platform || 'Non spécifiée'}
                    </Typography>
                    <Typography variant="body1" sx={{marginBottom: '10px'}}>
                        <strong>Temps
                            joué:</strong> {game.timePlayed ? `${Math.floor(game.timePlayed / 60)} h ${game.timePlayed % 60} min` : 'Non disponible'}
                    </Typography>
                    <Typography variant="body1" sx={{marginBottom: '10px'}}>
                        <strong>Dernière session:</strong> {game.lastSessionDate || 'Non spécifiée'}
                    </Typography>
                    <Box sx={{display: 'flex', alignItems: 'center'}}>
                        <strong>Ma note:</strong>
                        <Rating value={game.userRating || 0} precision={0.5} readOnly sx={{marginLeft: '10px'}}/>
                    </Box>
                </Box>
            </AccordionDetails>
        </Accordion>
    );
};

export default GameAccordion;
