import React, {useEffect, useState, useContext} from "react";
import CommentCard from "../CommentCard.jsx"; // Ensure the correct path
import AddComment from "../AddComment.jsx";
import {AuthContext} from "../AuthContext.jsx";

const GameReviews = ({gameId, gameName}) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAddingComment, setIsAddingComment] = useState(false); // Toggle for AddComment modal
    const {user} = useContext(AuthContext);

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://localhost:8080/game-reviews/game/${gameId}`);
            if (!response.ok) {
                throw new Error(`Erreur lors du chargement des avis : ${response.statusText}`);
            }
            const data = await response.json();
            setReviews(data.data);
            setError(null); // Clear previous error
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch reviews when the component loads
    useEffect(() => {
        fetchReviews();
    }, [gameId]);

    const handleCommentAdded = async () => {
        setIsAddingComment(false); // Close AddComment modal
        await fetchReviews(); // Reload reviews after adding a comment
    };

    const handleCommentDeleted = (commentId) => {
        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== commentId));
    };

    return (
        <div>
            {/* Button to Add a Comment */}
            <button onClick={() => setIsAddingComment(true)} style={styles.addButton}>
                Ajouter un avis
            </button>
            {isAddingComment && (
                <AddComment
                    gameId={gameId}
                    gameName={gameName}
                    onCommentAdded={handleCommentAdded}
                    onCancel={() => setIsAddingComment(false)}
                />
            )}

            {/* Error Handling */}
            {error && (
                <p style={{color: "red", fontSize: "1.2em", marginTop: "20px"}}>
                    Erreur : {error}
                </p>
            )}

            {/* List of Reviews */}
            {!loading && reviews.length > 0 ? (
                <CommentCard
                    comments={reviews}
                    currentUserId={user?.id}
                    onCommentDeleted={handleCommentDeleted}
                />
            ) : !loading && !error && (
                <p style={{color: "blue", marginTop: "20px"}}>
                    Aucun avis pour ce jeu pour le moment.
                </p>
            )}
        </div>
    );
};

export default GameReviews;

const styles = {
    addButton: {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        marginBottom: "20px",
    },
};
