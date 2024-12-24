import React from 'react';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

const StarRating = ({rating}) => {
    const maxStars = 5;
    const filledStars = Math.round(rating); // Note déjà sur 5

    return (
        <div>
            {[...Array(maxStars)].map((_, index) =>
                index < filledStars ? (
                    <StarIcon key={index} style={{color: '#FFD700'}}/>
                ) : (
                    <StarBorderIcon key={index} style={{color: '#FFD700'}}/>
                )
            )}
        </div>
    );
};

export default StarRating;
