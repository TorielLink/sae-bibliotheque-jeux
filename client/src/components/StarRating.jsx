import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarHalfIcon from '@mui/icons-material/StarHalf';

const StarRating = ({rating}) => {
    const maxStars = 5;

    const validRating = typeof rating === 'number' && !isNaN(rating) ? rating : 0;

    const normalizedRating = Math.max(0, Math.min(5, validRating));

    const filledStars = Math.floor(normalizedRating);
    const hasHalfStar = normalizedRating % 1 >= 0.5;
    const emptyStars = maxStars - filledStars - (hasHalfStar ? 1 : 0);

    return (
        <div style={{display: 'flex', alignItems: 'center'}}>
       
            {[...Array(filledStars)].map((_, index) => (
                <StarIcon key={`full-${index}`} style={{color: '#FFD700'}}/>
            ))}
            {hasHalfStar && <StarHalfIcon key="half" style={{color: '#FFD700'}}/>}
            {[...Array(emptyStars)].map((_, index) => (
                <StarBorderIcon key={`empty-${index}`} style={{color: '#FFD700'}}/>
            ))}
        </div>
    );
};

export default StarRating;
