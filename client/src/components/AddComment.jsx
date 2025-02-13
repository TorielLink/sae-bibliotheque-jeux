import React, {useState, useContext} from "react";
import {FaStar} from "react-icons/fa";
import {AuthContext} from "./AuthContext";

const colors = {
    orange: "#FFBA5A",
    lightOrange: "#FFE5B4",
};

const platforms = [
    {id: 1, name: "PlayStation", shortName: "PS"},
    {id: 2, name: "Xbox", shortName: "XB"},
    {id: 3, name: "Nintendo Switch", shortName: "NS"},
    {id: 4, name: "Steam", shortName: "Steam"},
    {id: 5, name: "GOG", shortName: "GOG"},
    {id: 6, name: "Epic Games Store", shortName: "EGS"},
    {id: 7, name: "Microsoft Store", shortName: "MS"},
];

function AddComment({gameId, gameName, onCommentAdded, onCancel}) {
    const [currentValue, setCurrentValue] = useState(0);
    const [hoverValue, setHoverValue] = useState(undefined);
    const [comment, setComment] = useState("");
    const [platform, setPlatform] = useState("");
    const [visibility, setVisibility] = useState("Privé");
    const [message, setMessage] = useState(null);
    const {token} = useContext(AuthContext);

    const platforms = [
        {id: 1, name: "PlayStation", shortName: "PS"},
        {id: 2, name: "Xbox", shortName: "XB"},
        {id: 3, name: "Nintendo Switch", shortName: "NS"},
        {id: 4, name: "Steam", shortName: "Steam"},
        {id: 5, name: "GOG", shortName: "GOG"},
        {id: 6, name: "Epic Games Store", shortName: "EGS"},
        {id: 7, name: "Microsoft Store", shortName: "MS"},
    ];

    const handleClick = (value) => setCurrentValue(value);
    const handleMouseOver = (value) => setHoverValue(value);
    const handleMouseLeave = () => setHoverValue(undefined);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!comment.trim() || !platform) {
            setMessage({type: "error", text: "Veuillez remplir tous les champs obligatoires."});
            return;
        }

        try {
            const privacySettingId = visibility === "Public" ? 2 : 1;

            const selectedPlatform = platforms.find(p => p.id === parseInt(platform));
            if (!selectedPlatform) {
                setMessage({type: "error", text: "Plateforme invalide."});
                return;
            }

            const body = {
                igdb_game_id: gameId,
                content: comment,
                privacy_setting_id: privacySettingId,
                spoiler: false,
                platform_id: selectedPlatform.id,
            };

            if (currentValue > 0) {
                body.rating_value = currentValue;
            }

            const response = await fetch("http://localhost:8080/game-reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            let data = null;
            let message = "Une erreur est survenue.";

            try {
                const text = await response.text();
                data = text ? JSON.parse(text) : {};

                if (response.ok) {
                    message = "Votre avis a été ajouté avec succès !";
                } else {
                    throw new Error(data.message || message);
                }
            } catch (jsonError) {
                console.error("Erreur lors du parsing JSON", jsonError);
            }

            if (data) {
                onCommentAdded(data);
            }

            setMessage({type: "success", text: message});
            resetForm();
            if (onCancel) onCancel();
        } catch (error) {
            setMessage({type: "error", text: error.message});
        }
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        resetForm();
    };

    const resetForm = () => {
        setComment("");
        setPlatform("");
        setVisibility("Privé");
        setCurrentValue(0);
        setHoverValue(undefined);
        setMessage(null);
    };

    return (
        <div style={styles.modalOverlay}>
            <div style={styles.modalContent}>
                {message && (
                    <div
                        style={{
                            ...styles.message,
                            ...(message.type === "error" ? styles.error : styles.success),
                        }}
                    >
                        {message.text}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    
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
                                <label style={styles.label}>Plateforme</label>
                                <select
                                    value={platform}
                                    onChange={(e) => setPlatform(e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="">Sélectionnez une plateforme</option>
                                    {platforms.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label style={styles.label}>Visibilité</label>
                                <select
                                    value={visibility}
                                    onChange={(e) => setVisibility(e.target.value)}
                                    style={styles.select}
                                >
                                    <option value="Privé">Privé</option>
                                    <option value="Public">Public</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <label style={styles.label}>Avis</label>
                    <textarea
                        placeholder="Mon avis..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={styles.textarea}
                    />

                    <div style={styles.actions}>
                        <button type="button" onClick={handleCancel} style={styles.cancelButton}>
                            Annuler
                        </button>
                        <button type="submit" style={styles.submitButton}>
                            Ajouter
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

    loadingContainer: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "20px",
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
    message: {
        fontSize: "1.5em",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "20px",
    },
    error: {
        color: "red",
    },
    success: {
        color: "#28a745",
    },
};


export default AddComment;
