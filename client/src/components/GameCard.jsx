import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';

function GameCard({ image, title, rating, categories }) {
  return (
    <Card sx={{
      maxWidth: 250,
      position: 'relative',
      backgroundColor: '#fff',
      color: '#333',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
    }}>

      {/* Image du jeu avec l'évaluation en haut à droite */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={image}
          alt={title}
          sx={{ objectFit: 'cover' }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#ffc107',
            borderRadius: '12px',
            padding: '2px 6px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {rating}
          </Typography>
          <StarIcon sx={{ fontSize: '1rem', color: '#ffc107' }} />
        </Box>

        {/* Catégories en bas de l'image */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
          }}
        >
          {categories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              sx={{
                backgroundColor: '#e91e63',
                color: '#fff',
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Titre du jeu en bas */}
      <CardContent sx={{ textAlign: 'center', padding: '8px 12px' }}>
        <Typography variant="h6" component="div" sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default GameCard;
