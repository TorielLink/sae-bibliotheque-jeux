import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

const StarRating = ({rating}) => {
    const maxStars = 5;

    // Vérifier si la note est un nombre valide, sinon on la considère comme 0
    const validRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;

    // S'assurer que la note reste entre 0 et 5
    const normalizedRating = Math.max(0, Math.min(5, validRating));

    // Calculer le nombre d'étoiles pleines, demi-étoiles et étoiles vides
    const filledStars = Math.floor(normalizedRating);  // Nombre d'étoiles pleines
    const hasHalfStar = normalizedRating % 1 >= 0.5;   // Vérifier s'il y a une demi-étoile
    const emptyStars = maxStars - filledStars - (hasHalfStar ? 1 : 0); // Nombre d'étoiles vides

    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
            {/* Étoiles pleines */}
            {[...Array(filledStars)].map((_, index) => (
                <StarIcon key={`full-${index}`} style={{color: '#FFD700'}}/>
            ))}
            {/* Demi-étoile si nécessaire */}
            {hasHalfStar && <StarHalfIcon key="half" style={{color: '#FFD700'}}/>}
            {/* Étoiles vides */}
            {[...Array(emptyStars)].map((_, index) => (
                <StarBorderIcon key={`empty-${index}`} style={{color: '#FFD700'}}/>
            ))}
        </div>
    );
};

export default StarRating;
