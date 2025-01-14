import React, {createContext, useContext, useState} from "react";
import {faker} from "@faker-js/faker";
import {AuthContext} from "./AuthContext.jsx";

export const CommentsContext = createContext();

export function CommentsProvider({children}) {
    const {token, user} = useContext(AuthContext); // Récupération du token et des données utilisateur
    const [comments, setComments] = useState([]);

    if (!token) {
        console.warn("Token non disponible. L'utilisateur doit être connecté.");
    }

    const addComment = async (rating, text, platform, gameName) => {
        try {
            const response = await fetch("http://localhost:8080/game-reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // Token JWT
                },
                body: JSON.stringify({
                    rating,
                    text,
                    platform,
                    gameName,
                }),
            });

            if (!response.ok) {
                throw new Error(`Erreur API : ${response.statusText}`);
            }

            const newComment = await response.json();

            setComments((prevComments) => [newComment, ...prevComments]); // Ajout du commentaire localement
        } catch (error) {
            console.error("Erreur lors de l'ajout du commentaire :", error);
            throw error;
        }
    };

    const deleteComment = async (commentId) => {
        if (!token) {
            console.warn("Token non disponible. Impossible de supprimer le commentaire.");
            return;
        }

        try {
            const response = await fetch(`http://localhost:8080/game-reviews/${commentId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`, // Token JWT
                },
            });

            if (!response.ok) {
                throw new Error(`Erreur API : ${response.statusText}`);
            }

            // Mettre à jour l'état global des commentaires
            setComments((prevComments) =>
                prevComments.filter((comment) => comment.id !== commentId)
            );
        } catch (error) {
            console.error("Erreur lors de la suppression du commentaire :", error);
            throw error;
        }
    };

    return (
        <CommentsContext.Provider value={{comments, addComment, deleteComment}}>
            {children}
        </CommentsContext.Provider>
    );
}

export function Comment({comment}) {
    const getButtonColor = (platform) => {
        switch (platform) {
            case "PS5":
                return "red";
            case "PS4":
                return "orange";
            case "Xbox":
                return "green";
            case "PC":
                return "blue";
            default:
                return "gray";
        }
    };

    return (
        <div style={styles.commentContainer}>
            <div style={styles.header}>
                <button
                    style={{
                        ...styles.platformButton,
                        backgroundColor: getButtonColor(comment.platform),
                    }}
                ></button>
                <span style={styles.platformLabel}>{comment.platform}</span>
            </div>
            <p style={styles.commentText}>{comment.text}</p>
            <small style={styles.commentDate}>{comment.date}</small>
        </div>
    );
}

const styles = {
    commentContainer: {
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "10px",
        margin: "10px 0",
        backgroundColor: "#f9f9f9",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    header: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
    },
    platformButton: {
        width: "20px",
        height: "20px",
        borderRadius: "50%",
        border: "none",
        marginRight: "10px",
    },
    platformLabel: {
        fontWeight: "bold",
    },
    commentText: {
        fontSize: "1rem",
        marginBottom: "5px",
    },
    commentDate: {
        fontSize: "0.8rem",
        color: "#666",
    },
};
