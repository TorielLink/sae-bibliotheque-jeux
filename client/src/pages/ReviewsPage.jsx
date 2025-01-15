import React, {useEffect, useState, useMemo} from "react";
import {FaStar} from "react-icons/fa";
import {Grid, Typography, CircularProgress} from "@mui/material";
import ResponsiveCommentCard from "../components/ResponsiveCommentCard";

/** Couleurs pour le système de filtrage des étoiles */
const colors = {
    orange: "#FFBA5A",
    grey: "#a9a9a9",
};

export default function ReviewsPage() {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                const response = await fetch("http://localhost:8080/game-reviews");
                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                console.log("Réponse de l'API :", data);
                setComments(data.data || []);
            } catch (err) {
                console.error("Erreur lors de la récupération des avis :", err.message);
                setError("Impossible de charger les avis. Veuillez réessayer.");
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
                                    ? colors.orange
                                    : isHovered
                                        ? colors.grey
                                        : "#f0f0f0",
                                color: isActive || isHovered ? "#fff" : "#000",
                            }}
                            onMouseEnter={() => setHoveredStars(starValue)}
                            onMouseLeave={() => setHoveredStars(null)}
                            onClick={() => setFilterStars(starValue)}
                        >
                            {starValue} <FaStar color={isActive || isHovered ? "#fff" : colors.orange}/>
                        </button>
                    );
                })}

                {/* Bouton pour annuler le filtre */}
                <button
                    style={{
                        ...styles.filterButton,
                        backgroundColor: filterStars === null ? colors.orange : "#f0f0f0",
                        color: filterStars === null ? "#fff" : "#000",
                    }}
                    onClick={() => setFilterStars(null)}
                >
                    Tous
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
                    Aucun avis trouvé
                </Typography>
            )}
        </div>
    );
}

const styles = {
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
        backgroundColor: "#f0f0f0",
        color: "#000",
    },
    filterButtonHover: {
        transform: "scale(1.05)",
    },
    noResultsText: {
        textAlign: "center",
        marginTop: "20px",
        fontSize: "16px",
        color: "#666",
    },
};
