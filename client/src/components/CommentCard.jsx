import React, {useState, useContext} from "react";
import {FaStar} from "react-icons/fa";
import {CommentsContext} from "./CommentsContext";

const colors = {
    orange: "#FFBA5A",
    grey: "#a9a9a9",
};

const CommentCard = ({comments = [], maxComments = null, currentUserId, onCommentDeleted}) => {
    const {deleteComment} = useContext(CommentsContext);
    const [modalText, setModalText] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("asc");
    const [hoveredButton, setHoveredButton] = useState(null);
    const validComments = Array.isArray(comments) ? comments : [];

    // Fonction pour déterminer la couleur du bouton de plateforme
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

    // Filtrer les commentaires selon le texte
    const filteredComments = validComments.filter((comment) =>
        comment.content?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Trier les commentaires par note
    const sortedComments = [...filteredComments].sort((a, b) =>
        sortOrder === "asc" ? a.rating - b.rating : b.rating - a.rating
    );

    // Limiter les commentaires affichés
    const displayedComments = maxComments
        ? sortedComments.slice(0, maxComments)
        : sortedComments;

    return (
        <div style={styles.container}>
            {/* Modal pour afficher le texte complet */}
            {modalText && (
                <FullTextModal text={modalText} onClose={() => setModalText(null)}/>
            )}

            <div style={styles.commentsContainer}>
                {validComments.map((item, index) => (
                    <div key={item.id || index} style={styles.commentBlock}>
                        {/* Image de couverture */}
                        <img
                            src={item.game?.cover || "https://via.placeholder.com/150"}
                            alt={item.game?.title || "Cover image"}
                            style={styles.coverImage}
                        />

                        {/* Contenu du commentaire */}
                        <div style={styles.commentContent}>
                            <div style={styles.topContainer}>
                                {/* Titre du jeu */}
                                <div style={styles.gameNameContainer}>
                                    <p>{item.game?.title || "Nom du jeu inconnu"}</p>
                                </div>

                                {/* Informations utilisateur et plateforme */}

                                <div style={styles.platformStarsContainer}>
                                    {/* Nom d'utilisateur */}
                                    <div style={styles.userContainer}>
                                        <p>{item.user?.username || "Utilisateur inconnu"}</p>
                                    </div>

                                    {item.platform && (
                                        <div style={styles.platformContainer}>
                                            <div
                                                style={{
                                                    backgroundColor: getButtonColor(item.platform),
                                                    ...styles.platformCircle,
                                                }}
                                            ></div>
                                            <p>{item.platform}</p>
                                        </div>
                                    )}

                                    {/* Étoiles de notation */}
                                    <div style={styles.starsContainer}>
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar
                                                key={i}
                                                size={24}
                                                color={
                                                    i < (item.rating || 0)
                                                        ? colors.orange
                                                        : colors.grey
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Texte du commentaire */}
                            <CommentText
                                text={item.content}
                                onViewMore={() => setModalText(item.content)}
                                isHovered={hoveredButton === `viewMore-${index}`}
                                setHoveredButton={(state) =>
                                    setHoveredButton(state ? `viewMore-${index}` : null)
                                }
                            />

                            {/* Date de publication */}
                            <p style={styles.date}>{item.date_published || "Date inconnue"}</p>

                            {/* Bouton de suppression */}
                            {currentUserId === item.user_id && (
                                <button
                                    style={{
                                        ...styles.deleteButton,
                                        ...(hoveredButton === `delete-${index}`
                                            ? styles.deleteButtonHover
                                            : {}),
                                    }}
                                    onMouseEnter={() => setHoveredButton(`delete-${index}`)}
                                    onMouseLeave={() => setHoveredButton(null)}
                                    onClick={async () => {
                                        try {
                                            await deleteComment(item.id);
                                            onCommentDeleted(item.id); // Notifier le parent après suppression
                                            alert('Commentaire supprimé avec succès.');
                                        } catch (error) {
                                            console.error("Erreur lors de la suppression du commentaire :", error);
                                            alert('Impossible de supprimer le commentaire. Veuillez réessayer.');
                                        }
                                    }}

                                >
                                    Supprimer
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FullTextModal({text, onClose}) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                <p style={{fontSize: "1.2rem", lineHeight: "1.8", textAlign: "justify"}}>
                    {text}
                </p>
                <button
                    onClick={onClose}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    style={{
                        ...styles.closeButton,
                        ...(isHovered ? styles.closeButtonHover : {}),
                    }}
                >
                    Fermer
                </button>
            </div>
        </div>
    );
}

// Fonction pour afficher une partie du texte avec un bouton "Voir plus"
function CommentText({text, onViewMore, isHovered, setHoveredButton}) {
    const [isOverflow, setIsOverflow] = useState(false);
    const textRef = React.useRef(null);

    React.useEffect(() => {
        if (textRef.current) {
            const isTextOverflowing =
                textRef.current.scrollHeight > textRef.current.offsetHeight;
            setIsOverflow(isTextOverflowing);
        }
    }, [text]);

    return (
        <div>
            <p
                ref={textRef}
                style={{
                    ...styles.commentText,
                    display: "-webkit-box",
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                }}
            >
                {text}
            </p>
            {isOverflow && (
                <button
                    style={{
                        ...styles.viewMoreButton,
                        ...(isHovered ? styles.viewMoreButtonHover : {}),
                    }}
                    onMouseEnter={() => setHoveredButton(true)}
                    onMouseLeave={() => setHoveredButton(false)}
                    onClick={onViewMore}
                >
                    Voir plus →
                </button>
            )}
        </div>
    );
}

// Styles
const styles = {

    container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    commentsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "20px",
        width: "100%",
        maxWidth: "1600px",
        padding: "10px",
        boxSizing: "border-box",
    },
    platformCircle: {
        width: "15px",
        height: "15px",
        borderRadius: "50%",
        display: "inline-block",
        boxSizing: "border-box",
    },

    commentBlock: {
        display: "flex",
        flexDirection: "row",
        alignItems: "stretch",
        border: "1px solid #a9a9a9",
        borderRadius: 5,
        padding: 0,
        marginBottom: 20,
        backgroundColor: "#f9f9f9",
        overflow: "hidden",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        boxSizing: "border-box",
    },
    coverImage: {
        width: "50%",
        height: "auto",
        objectFit: "cover",
        margin: 0,
        flexShrink: 0,
        maxWidth: "200px",
        minWidth: "100px",
    },
    commentContent: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: "15px",
    },
    topContainer: {
        display: "flex",
        flexDirection: "column", // Change to column to accommodate GameName block
        marginBottom: "10px",
    },
    gameNameContainer: {
        marginBottom: "5px", // Réduction de l'espacement en bas
        padding: "0px 10px", // Réduction de la hauteur et ajout d'espacement horizontal
        backgroundColor: "#ffffff",
        borderRadius: "5px",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "0.7em", // Réduction de la taille du texte
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)"
    },
    userContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px",
        backgroundColor: "#ffffff", // Fond blanc
        borderRadius: 5,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        height: "35px",
        width: "80px",
        fontSize: "0.9em",
        color: "#000",
        fontWeight: "bold",
    },
    platformStarsContainer: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "10px",
        marginTop: "20px",
        marginLeft: "auto",
    },
    platformContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px",
        backgroundColor: "#fff",
        borderRadius: 5,
        gap: "5px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        height: "35px",
        width: "80px",
    },
    starsContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "5px",
        backgroundColor: "#fff",
        borderRadius: 5,
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
        width: "100px",
        height: "35px",
    },
    date: {
        fontSize: "0.8em",
        color: "#666",
    },
    viewMoreButton: {
        backgroundColor: "#FFBA5A",
        color: "#000",
        borderRadius: "25px",
        border: "none",
        padding: "5px 10px",
        fontSize: "1rem",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    viewMoreButtonHover: {
        backgroundColor: "#d9a346",
        transform: "scale(1.05)",
    },
    deleteButton: {
        alignSelf: "flex-end",
        backgroundColor: "#ff4d4d",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: "20px",
        fontSize: "0.9rem",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
    },
    deleteButtonHover: {
        backgroundColor: "#d43c3c",
        transform: "scale(1.05)",
    },
    button: {
        width: "100%",
        padding: "10px",
        border: "1px solid #a9a9a9",
        borderRadius: 5,
        backgroundColor: "#f0f0f0",
        cursor: "pointer",
    },
    textarea: {
        width: "100%",
        height: "100px",
        marginBottom: "10px",
        borderRadius: 5,
        padding: "10px",
        border: "1px solid #a9a9a9",
    },
    select: {
        width: "100%",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: 5,
        border: "1px solid #a9a9a9",
    },
    addButton: {
        marginBottom: "20px",
        backgroundColor: "#007BFF",
        color: "#FFF",
        padding: "10px 20px",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.8)", // Fond sombre avec opacité
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Toujours au-dessus des autres éléments
        animation: "fadeIn 0.3s ease-in-out", // Animation d'apparition
    },

    modalContent: {
        backgroundColor: "#ffffff",
        padding: "40px", // Plus d'espace intérieur
        borderRadius: "15px", // Arrondi des coins
        maxWidth: "900px", // Largeur maximale du modal
        width: "90%", // S'adapte à l'écran
        maxHeight: "85vh", // Hauteur maximale pour éviter de dépasser l'écran
        overflowY: "auto", // Scroll si le contenu est trop long
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)", // Ombre pour un effet flottant
        textAlign: "center",
        position: "relative",
        display: "flex",
        flexDirection: "column", // Empile les éléments verticalement
        alignItems: "center", // Centre horizontalement tous les éléments
        gap: "20px", // Espacement entre les éléments
    },

    buttonContainer: {
        display: "flex",
        justifyContent: "center", // Centre le bouton horizontalement
        width: "100%", // Assure que le conteneur prend tout l'espace horizontal
        marginTop: "20px", // Espacement au-dessus
    },

    closeButton: {
        backgroundColor: "#ff4d4d",
        color: "#ffffff",
        padding: "12px 24px", // Augmente la taille du bouton
        border: "none",
        borderRadius: "20px", // Forme arrondie
        fontSize: "1rem", // Texte plus grand
        fontWeight: "bold",
        cursor: "pointer",
        transition: "background-color 0.3s ease, transform 0.2s ease", // Effet de transition
        boxShadow: "0 6px 10px rgba(0, 0, 0, 0.3)", // Ombre plus marquée
        width: "150px", // Largeur du bouton
        textAlign: "center",
    },


    closeButtonHover: {
        backgroundColor: "#d43c3c", // Changement de couleur au survol
        transform: "scale(1.05)", // Mise à l'échelle
    },


    "@keyframes fadeIn": {
        "0%": {opacity: 0, transform: "scale(0.9)"},
        "100%": {opacity: 1, transform: "scale(1)"},
    },


    "@media (max-width: 768px)": {
        commentsContainer: {
            gridTemplateColumns: "1fr",
            gap: "10px",
        },
        commentBlock: {
            flexDirection: "column",
        },
        randomImage: {
            width: "50%",
            maxWidth: "160px",
            minWidth: "80px",
        },
        commentContent: {
            padding: "10px",
        },
        starsContainer: {
            width: "80px",
            height: "30px",
        },
        platformContainer: {
            width: "70px",
            height: "30px",
        },
    },
    "@media (max-width: 480px)": {
        randomImage: {
            width: "80%",
            maxWidth: "100px",
            minWidth: "60px",
        },
    },
};
export default CommentCard;
