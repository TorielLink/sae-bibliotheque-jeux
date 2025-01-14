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

    const addComment = (rating, text, platform, gameName) => {
        const newComment = {
            id: faker.datatype.uuid(), // Génère un ID unique
            rating,
            text,
            platform,
            gameName,
            date: new Date().toLocaleString(),
            avatar: faker.image.avatar(),
        };

        setComments((prevComments) => [newComment, ...prevComments]); // Ajout du commentaire localement
    };

    const deleteComment = async (commentId) => {
        try {
            const response = await fetch(`http://localhost:8080/game-reviews/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`, // Token JWT
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
            console.error('Erreur lors de la suppression du commentaire :', error);
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
        <div style={{border: "1px solid #ccc", padding: 10, margin: 10}}>
            <button
                style={{
                    backgroundColor: getButtonColor(comment.platform),
                    border: "none",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                }}
            ></button>
            <span style={{marginLeft: 10}}>{comment.platform}</span>
            <p>{comment.text}</p>
            <small>{comment.date}</small>
        </div>
    );
}
