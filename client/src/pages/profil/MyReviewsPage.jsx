import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../components/AuthContext.jsx';
import ResponsiveCommentCard from '../../components/ResponsiveCommentCard';
import {Grid, CircularProgress, Typography, Box} from '@mui/material';
import {useTranslation} from "react-i18next";

const MyReviewsPage = () => {
    const {t} = useTranslation();
    const {user} = useContext(AuthContext);
    const userId = user?.id;
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Charger les avis utilisateur
    useEffect(() => {
        const fetchUserReviews = async () => {
            if (!userId) {
                setError(t("error.unidentifiedUser"));
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
                console.log(t('review.userReviews'), data);
                setReviews(data?.data || []); // Mise à jour des avis
            } catch (err) {
                console.error(t("error.loadingReviews"), err);
                setError(t("error.loadingReviews")+" "+t("error.tryAgainLater") );
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
                {t("review.noReviewsFound")}
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
                        {t("review.noReviewsFoundForUser")}
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default MyReviewsPage;
