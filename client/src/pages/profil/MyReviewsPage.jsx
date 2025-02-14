import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../components/AuthContext.jsx';
import ResponsiveCommentCard from '../../components/ResponsiveCommentCard';
import {Grid, CircularProgress, Typography, Box} from '@mui/material';

const MyReviewsPage = () => {
    const {user} = useContext(AuthContext);
    const userId = user?.id;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les avis utilisateur
    useEffect(() => {
        const fetchUserReviews = async () => {
            if (!userId) {
                setError('Utilisateur non identifié.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game-reviews/user/${userId}/reviews`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                console.log('Avis utilisateur:', data);
                setReviews(data?.data || []); // Mise à jour des avis
            } catch (err) {
                console.error('Erreur lors de la récupération des avis:', err);
                setError('Erreur lors de la récupération des avis. Veuillez réessayer plus tard.');
            } finally {
                setLoading(false); // Désactiver le chargement
            }
        };

        fetchUserReviews();
    }, [userId]);

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flex: '1',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    textAlign: 'center',
                    color: 'red',
                    marginTop: '20px',
                }}
            >
                <Typography variant="h6">{error}</Typography>
            </Box>
        );
    }

    if (reviews.length === 0) {
        return (
            <Typography align="center" variant="h6" style={{marginTop: '20px'}}>
                Aucun avis trouvé.
            </Typography>
        );
    }

    return (
        <Box sx={{padding: '2em'}}>

            {/* Affichage des avis comme sur HomePage */}
            <Box
                sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    marginTop: '1.5em',
                }}
            >
                {reviews.length > 0 ? (
                    <Grid container spacing={2}>
                        {reviews.map((review) => (
                            <Grid item xs={12} sm={6} key={review.id}>
                                <ResponsiveCommentCard
                                    comments={[review]} // Un seul commentaire
                                    maxComments={1} // Permet d’afficher un seul commentaire par carte
                                    currentUserId={user?.id}
                                    onCommentDeleted={(commentId) =>
                                        setReviews((prev) => prev.filter((r) => r.id !== commentId))
                                    }
                                />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Typography variant="body1">
                        Aucun avis trouvé pour cet utilisateur.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default MyReviewsPage;
