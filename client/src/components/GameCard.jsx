import React from 'react';
import { Card, CardMedia, CardContent, Typography, Chip, Box } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from '@mui/material/styles';

function GameCard({ image, title, rating, categories }) {
  const theme = useTheme();

  return (
    <Card
      sx={{
        position: 'relative',
        width: '150px', // Largeur définie
        height: '225px', // Hauteur définie
        backgroundImage: 'url(Checker.png)', // L'image de fond
        backgroundSize: 'cover', // Assurer que l'image couvre toute la carte
        boxShadow: '0px 0px 7px #000000', // Ombre autour de la carte
        borderRadius: '5px', // Bordure arrondie
        overflow: 'hidden',
        '&:hover': {
          boxShadow: '0px 0px 15px rgba(0, 0, 0, 0.3)', // Ombre plus grande au survol
          '& .categories': {
            opacity: 1, // Afficher les catégories au survol
          },
        },
      }}
    >
      {/* Conteneur de l'image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '70%', // Réduit la hauteur de l'image
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={title || 'Image non disponible'}
          sx={{
            objectFit: 'cover', // Assure que l'image remplit l'espace
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
            opacity: 0,
            transition: 'opacity 0.3s',
            pointerEvents: 'none',
          }}
        >
          {categories.map((category, index) => (
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

      {/* Titre du jeu */}
      <CardContent
        sx={{
          textAlign: 'center',
          padding: '4px 8px', // Espacement ajusté
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontSize: '0.875rem', // Réduit la taille de la police
            fontWeight: 'bold',
            color: theme.palette.text.primary,
          }}
        >
          {title || 'Titre non disponible'}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default GameCard;
