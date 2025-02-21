import React, {useEffect, useState, useMemo} from "react";
import {FaStar} from "react-icons/fa";
import {Grid, Typography, CircularProgress, useMediaQuery} from "@mui/material";
import ResponsiveCommentCard from "../components/ResponsiveCommentCard";
import {useTheme} from "@mui/material/styles";
import { useTranslation } from 'react-i18next';

export default function ReviewsPage() {
    const { t } = useTranslation();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
    const styles = getStyles(theme, isMobile);
    // Étoiles filtrage
    const [filterStars, setFilterStars] = useState(null);
    const [hoveredStars, setHoveredStars] = useState(null);
    const stars = Array(5).fill(0);

    const userId = 42;

    // Récupération des avis depuis l'API
    useEffect(() => {
        const fetchComments = async () => {
            setLoading(true);
            try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game-reviews`);
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();

                setComments(data.data || []);
            } catch (err) {
                setError(t("error.loadingReviews"));
            } finally {
                setLoading(false);
            }
        };

    fetchComments();
}, []);

    // Filtrer localement les avis par note
    const filteredComments = useMemo(() => {
        if (filterStars !== null) {
            return comments.filter((comment) => comment.rating === filterStars);
        }
        return comments;
    }, [comments, filterStars]);

    // Quand on supprime un avis côté serveur, on le retire aussi du state local
    const handleCommentDeleted = (commentId) => {
        setComments((prev) => prev.filter((c) => c.id !== commentId));
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <CircularProgress/>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <Typography color="error" variant="h6">
                    {error}
                </Typography>
            </div>
        );
    }

    return (
        <div style={{padding: "20px"}}>
            <Typography variant="subtitle2" style={styles.breadcrumb}>
                {t("pageName.home")} &gt; {t("pageName.reviews")}
            </Typography>
            {/* Barre de filtre (étoiles) */}
            <div style={styles.filterContainer}>
                {stars.map((_, index) => {
                    const starValue = index + 1;
                    const isActive = filterStars === starValue;
                    const isHovered = hoveredStars === starValue;
                    return (
                        <button
                            key={index}
                            style={{
                                ...styles.filterButton,
                                ...(isActive || isHovered ? styles.filterButtonHover : {}),
                                backgroundColor: isActive
                                    ? theme.palette.colors.yellow
                                    : isHovered
                                        ? theme.palette.text.secondary
                                        : theme.palette.background.paper,
                                color: isActive || isHovered ? theme.palette.text.contrast : theme.palette.text.primary,
                            }}
                            onMouseEnter={() => setHoveredStars(starValue)}
                            onMouseLeave={() => setHoveredStars(null)}
                            onClick={() => setFilterStars(starValue)}
                        >
                            {starValue} <FaStar
                            color={isActive || isHovered ? theme.palette.text.contrast : theme.palette.colors.yellow}/>
                        </button>
                    );
                })}

                {/* Bouton pour annuler le filtre */}
                <button
                    style={{
                        ...styles.filterButton,
                        backgroundColor: filterStars === null ? theme.palette.colors.yellow : theme.palette.text.contrast,
                        color: filterStars === null ? theme.palette.text.contrast : theme.palette.text.primary,
                    }}
                    onClick={() => setFilterStars(null)}
                >
                    {t("review.all")}
                </button>
            </div>

            {/* Liste des commentaires filtrés */}
            {filteredComments.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredComments.map((comment) => (
                        <Grid item xs={12} md={6} key={comment.id}>
                            {/* On passe un SEUL commentaire à ResponsiveCommentCard
                  pour éviter l'effet "duplicates" */}
                            <ResponsiveCommentCard
                                comments={[comment]}
                                maxComments={1}
                                currentUserId={userId}  // ou user?.id
                                onCommentDeleted={handleCommentDeleted}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography style={styles.noResultsText}>
                    {t("review.noReviewsFound")}
                </Typography>
            )}
        </div>
    );
}

const getStyles = (theme, isMobile) => ({
    breadcrumb: {
        color: theme.palette.colors.red,
        padding: isMobile ? "0.75em 0 0 0.75em" : "1.5em 0 0 1.5em",
        font: 'Inter',
        fontSize: isMobile ? "0.9em" : "1em",
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    },
    errorContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
    },
    filterContainer: {
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        marginBottom: "20px",
        maxWidth: "100%",
        padding: "0 10px",
        gap: "10px",
    },
    filterButton: {

        margin: "0 10px",
        padding: "10px 20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        transition: "background-color 0.3s, color 0.3s, transform 0.2s",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
    },
    filterButtonHover: {
        transform: "scale(1.05)",
    },
    noResultsText: {
        textAlign: "center",
        marginTop: "20px",
        fontSize: "16px",
        color: theme.palette.text.secondary,
    },

});

