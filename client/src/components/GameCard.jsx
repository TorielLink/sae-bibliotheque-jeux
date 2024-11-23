import React from 'react';
import { Card, CardMedia, Typography, Chip, Box, useMediaQuery } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '@mui/material/styles';

function GameCard({ image, title, rating, categories }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Limiter le nombre de catégories affichées sur mobile
  const displayedCategories = isMobile ? categories.slice(0, 2) : categories;

  return (
    <Card
      sx={{
        position: 'relative',
        width: '184px',
        height: '276px',
        backgroundImage: 'url(Checker.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        boxShadow: '0px 0px 7px #000000',
        borderRadius: '5px',
        overflow: 'hidden',
        marginLeft: '0px', // Supprimer la marge gauche
        marginTop: '0px',
        '&:hover': {
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)',
          ...(!isMobile && {
            '& .categories': {
              opacity: 1, // Afficher les catégories au survol sur desktop
            },
          }),
        },
      }}
    >
      {/* Conteneur de l'image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '241px', // Hauteur ajustée pour correspondre à la position du titre
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={title || 'Image non disponible'}
          sx={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />

        {/* Badge de la note */}
        {rating !== 'N/A' && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: theme.palette.background.default,
              borderRadius: '12px',
              padding: '2px 6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: 'bold',
                color: theme.palette.text.primary,
              }}
            >
              {rating}
            </Typography>
            <StarIcon sx={{ fontSize: '0.875rem', color: theme.palette.jaune.main }} />
          </Box>
        )}

        {/* Liste des catégories */}
        <Box
          className="categories"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            display: 'flex',
            flexWrap: 'wrap',
            gap: '4px',
            opacity: isMobile ? 1 : 0,
            transition: 'opacity 0.3s',
            pointerEvents: isMobile ? 'auto' : 'none',
          }}
        >
          {displayedCategories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              sx={{
                backgroundColor: theme.palette.red.main,
                color: theme.palette.white.main,
                fontSize: '0.75rem',
                fontWeight: 'bold',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Zone du titre */}
      <Box
        sx={{
          position: 'absolute',
          width: '184px',
          height: '35px',
          left: '0px',
          top: '241px',
          backgroundColor: theme.palette.background.default,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 8px',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            color: theme.palette.text.primary,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {title || 'Titre non disponible'}
        </Typography>
      </Box>
    </Card>
  );
}

export default GameCard;
