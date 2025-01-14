import React, {useState, useContext} from "react";
import {FaStar} from "react-icons/fa";
import {CommentsContext} from "./CommentsContext";

const colors = {
    orange: "#FFBA5A",
    lightOrange: "#FFE5B4",
};

function AddComment({gameName}) {
    const [isVisible, setIsVisible] = useState(true);
    const [currentValue, setCurrentValue] = useState(0);
    const [hoverValue, setHoverValue] = useState(undefined);
    const [comment, setComment] = useState("");
    const [platform, setPlatform] = useState("");
    const [visibility, setVisibility] = useState("Privé");
    const [coverImage, setCoverImage] = useState(""); // Nouvelle image de couverture
    const [successMessage, setSuccessMessage] = useState("");
    const {addComment} = useContext(CommentsContext);

    const handleClick = (value) => setCurrentValue(value);
    const handleMouseOver = (value) => setHoverValue(value);
    const handleMouseLeave = () => setHoverValue(undefined);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim() && platform && currentValue > 0) {
            addComment(
                currentValue,
                comment,
                platform,
                gameName || "Non spécifié",
                visibility,
                coverImage // Ajout de l'image de couverture
            );

            setSuccessMessage("Votre commentaire a été ajouté avec succès !");
            setTimeout(() => {
                resetForm();
                setIsVisible(false); // Fermeture du modal
            }, 2000);
        } else {
            alert("Veuillez remplir tous les champs et sélectionner une note.");
        }
    };

    const handleCancel = () => {
        resetForm();
        setIsVisible(false);
    };

    const resetForm = () => {
        setComment("");
        setPlatform("");
        setVisibility("Privé");
        setCurrentValue(0);
        setHoverValue(undefined);
        setCoverImage(""); // Réinitialisation de l'image
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div style={styles.modalOverlay} role="dialog" aria-labelledby="add-comment-title">
            <div style={styles.modalContent}>
                {successMessage && <p style={styles.successMessage}>{successMessage}</p>}
                <form onSubmit={handleSubmit} aria-describedby="form-description">
                    <div style={styles.gameNameBlock}>
                        <strong>Nom du jeu :</strong> {gameName || "Non spécifié"}
                    </div>

                    <div style={styles.starsBlock}>
                        <label style={styles.label}>Note</label>
                        <div style={styles.starsWrapper}>
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    size={40}
                                    role="button"
                                    onClick={() => handleClick(index + 1)}
                                    onMouseOver={() => handleMouseOver(index + 1)}
                                    onMouseLeave={handleMouseLeave}
                                    color={(hoverValue || currentValue) > index ? colors.orange : colors.lightOrange}
                                    style={styles.star}
                                />
                            ))}
                        </div>
                    </div>

                    <div style={styles.selectContainer}>
                        <div style={styles.inlineSelects}>
                            <div>
                                <label htmlFor="platform-select" style={styles.label}>Plateforme</label>
                                <select
                                    id="platform-select"
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    style={styles.select}
                                    aria-label="Sélectionnez une plateforme"
                                >
                                    <option value="">Sélectionnez une plateforme</option>
                                    <option value="PC">PC</option>
                                    <option value="Switch">Switch</option>
                                    <option value="PS5">PS5</option>
                                    <option value="Xbox">Xbox</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="visibility-select" style={styles.label}>Visibilité</label>
                                <select
                                    id="visibility-select"
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    style={styles.select}
                                    aria-label="Sélectionnez la visibilité"
                                >
                                    <option value="Privé">Privé</option>
                                    <option value="Public">Public</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <label htmlFor="comment-textarea" style={styles.label}>Avis</label>
                    <textarea
                        id="comment-textarea"
                        placeholder="Mon avis..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={styles.textarea}
                        aria-label="Ajouter un commentaire"
                    />
                    <div style={styles.actions}>
                        <button
                            type="button"
                            onClick={handleCancel}
                            style={styles.cancelButton}
                            aria-label="Annuler et fermer"
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            style={styles.submitButton}
                            aria-label="Ajouter votre avis"
                        >
                            <div style={styles.customPlusIcon}>+</div>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },

    modalContent: {
        backgroundColor: "#fff",
        padding: 30,
        borderRadius: 12,
        width: "98%",
        maxWidth: "900px",
        height: "90%",
        maxHeight: "70%",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        overflowY: "auto",
        position: "relative",
    },
    gameNameBlock: {
        marginBottom: "20px",
        fontSize: "1.2em",
        fontWeight: "bold",
    },
    starsBlock: {
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px",
        borderRadius: 10,
        backgroundColor: "#f9f9f9",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        position: "relative",
        left: "500px",
        top: "50px",
        width: "280px",
    },
    starsWrapper: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
    },
    star: {
        cursor: "pointer",
        transition: "transform 0.2s ease",
    },
    label: {
        fontWeight: "bold",
        marginBottom: "5px",
        display: "block",
    },
    selectContainer: {
        marginBottom: "20px",
    },
    inlineSelects: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
    },
    select: {
        flex: 1,
        padding: "12px",
        borderRadius: 5,
        border: "1px solid #ccc",
        fontSize: "1em",
        outline: "none",
    },
    textarea: {
        width: "100%",
        padding: "12px",
        height: "220px",
        borderRadius: 5,
        border: "1px solid #ccc",
        fontSize: "1em",
        outline: "none",
        resize: "none",
        marginTop: "20px",
    },
    imageUpload: {
        marginTop: "20px",
    },
    fileInput: {
        width: "100%",
        marginTop: "10px",
    },
    actions: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        bottom: "20px",
        left: "20px",
        right: "20px",
    },
    cancelButton: {
        backgroundColor: "#e74c3c",
        color: "#fff",
        padding: "10px 20px",
        border: "none",
        borderRadius: 5,
        cursor: "pointer",
    },
    submitButton: {
        backgroundColor: "#FFBA5A",
        color: "#fff",
        width: "70px",
        height: "70px",
        borderRadius: "50%",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    },
    customPlusIcon: {
        fontSize: "2.2em",
        fontWeight: "bold",
        color: "#fff",
    },
    successMessage: {
        color: "#28a745",
        fontSize: "1.2em",
        fontWeight: "bold",
        marginBottom: "20px",
        textAlign: "center",
    },
};


export default AddComment;
