import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../components/AuthContext.jsx';
import ResponsiveCommentCard from '../../components/ResponsiveCommentCard';
import {Grid, CircularProgress, Typography} from '@mui/material';

const MyReviewsPage = () => {
    const {user} = useContext(AuthContext);
    const userId = user?.id;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (userId) {
            fetch(`/gameReviews/user_review`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Erreur lors de la récupération des avis.');
                    }
                    return response.json();
                })
                .then((data) => {
                    setReviews(data?.data || []);
                    setLoading(false);
                })
                .catch((error) => {
                    setError(error.message);
                    setLoading(false);
                });
        }
    }, [userId]);

    if (loading) {
        return (
            <div style={{display: 'flex', justifyContent: 'center', marginTop: '20px'}}>
                <CircularProgress/>
            </div>
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center" style={{marginTop: '20px'}}>
                {error}
            </Typography>
        );
    }

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Mes avis
            </Typography>
            <Typography variant="body1" gutterBottom>
                Bienvenue, {user?.username} !
            </Typography>
            <Grid container spacing={2}>
                {reviews.map((review) => (
                    <Grid item xs={12} sm={6} key={review.id}>
                        <ResponsiveCommentCard
                            content={review.content}
                            rating={review.rating}
                            gameTitle={review.game?.title}
                            gameCover={review.game?.cover}
                            datePublished={review.date_published}
                            username={review.user?.username}
                            userProfilePicture={review.user?.profile_picture}
                        />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
};

export default MyReviewsPage;
