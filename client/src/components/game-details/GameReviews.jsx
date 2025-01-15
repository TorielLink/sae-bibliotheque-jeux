import React, {useEffect, useState, useContext} from "react";
import {CircularProgress} from "@mui/material";
import ResponsiveCommentCard from "../ResponsiveCommentCard.jsx";
import AddComment from "../AddComment.jsx";
import {AuthContext} from "../AuthContext.jsx";
import {baseTheme as theme} from "../../theme/themes.js";

const GameReviews = ({gameId, gameName}) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddingComment, setIsAddingComment] = useState(false);
    const {user} = useContext(AuthContext);

    // Récupération des avis via l'API
    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:8080/game-reviews/game/${gameId}`);

            if (response.status === 404) {
                setReviews([]);
                setError(null);
                return;
            }

            if (!response.ok) {
                throw new Error(
                    `Erreur lors du chargement des avis : ${response.statusText}`
                );
            }

            const data = await response.json();
            setReviews(data.data || []);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [gameId]);

    const handleCommentAdded = async () => {
        setIsAddingComment(false);
        await fetchReviews();
    };

    const handleCommentDeleted = (commentId) => {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== commentId));
    };

    return (
        <div style={styles.container}>
            {/* Ligne de header : bouton à droite */}
            <div style={styles.headerRow}>
                <button onClick={() => setIsAddingComment(true)} style={styles.addButton}>
                    Ajouter un avis
                </button>
            </div>

            {/* Modale d'ajout d'avis */}
            {isAddingComment && (
                <AddComment
                    gameId={gameId}
                    gameName={gameName}
                    onCommentAdded={handleCommentAdded}
                    onCancel={() => setIsAddingComment(false)}
                />
            )}

            {/* Affichage de l'erreur si échec réseau ou code HTTP != 200/404 */}
            {error && (
                <p style={{color: "red", fontSize: "1.2em", marginTop: "20px", textAlign: "center"}}>
                    Erreur : {error}
                </p>
            )}

            {/*
        Tant que loading = true, on affiche le spinner (CircularProgress).
        Sinon, si pas d'erreur => on vérifie reviews.length
      */}
            {loading ? (
                <div style={styles.loadingContainer}>
                    <CircularProgress/>
                </div>
            ) : (
                !error && (
                    reviews.length > 0 ? (
                        <ResponsiveCommentCard
                            comments={reviews}
                            maxComments={null}
                            currentUserId={user?.id}
                            onCommentDeleted={handleCommentDeleted}
                        />
                    ) : (
                        <p style={styles.noReviewsText}>
                            Il n’y a encore aucun avis pour ce jeu...
                            <br/>
                            Soyez le premier à partager votre expérience !
                        </p>
                    )
                )
            )}
        </div>
    );
};

export default GameReviews;

const styles = {
    container: {
        padding: "20px",
    },
    headerRow: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "20px",
    },
    addButton: {
        padding: "10px 20px",
        backgroundColor: theme.palette.colors.green,
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "40px",
    },
    noReviewsText: {
        color: "blue",
        marginTop: "20px",
        textAlign: "center",
        lineHeight: "1.4",
    },
};
