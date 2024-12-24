import {useNavigate} from 'react-router-dom'; // Ajouter cet import
import React from "react";
import {Box, Card} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";

function ListImageCard({id, image, title, rating, genres = [], platform}) {
    const navigate = useNavigate(); // Initialiser useNavigate

    const handleCardClick = () => {
        console.log("Navigating to details with ID:", id);
        navigate(`/details/${id}`);  // Utiliser navigate pour la navigation
    };

    // Assurer que genres est un tableau
    const safeGenres = Array.isArray(genres) ? genres : [];

    return (
        <Card
            onClick={handleCardClick}
            sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "stretch",
                width: "100%",
                height: "200px",
                background: "#E6E6E6",
                boxShadow: "0px 0px 7px #000000",
                borderRadius: "5px",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                "&:hover": {
                    boxShadow: "0px 0px 12px #000000",
                },
            }}
        >
            {/* Image à gauche */}
            <Box
                component="img"
                src={image}
                alt={title || "Image non disponible"}
                sx={{
                    width: "120px",
                    height: "100%",
                    objectFit: "cover",
                }}
            />

            {/* Contenu à droite */}
            <Box
                sx={{
                    flex: 1,
                    padding: "10px 15px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    position: "relative",
                }}
            >
                {/* Titre et Genres */}
                <Box>
                    {/* Titre */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            background: "rgba(149, 52, 213, 0.5)",
                            boxShadow: "0px 0px 4px #000000",
                            borderRadius: "3px",
                            padding: "5px 10px",
                            color: "#FFF",
                            fontWeight: "bold",
                            fontSize: "0.9em",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            width: "fit-content",
                            marginBottom: "10px",
                        }}
                    >
                        <VideogameAssetIcon
                            sx={{
                                fontSize: "1.1em",
                                marginRight: "0.3em",
                            }}
                        />
                        {title || "Jeu inconnu"}
                    </Box>

                    {/* Genres */}
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "8px",
                        }}
                    >
                        {safeGenres.length > 0 ? (
                            safeGenres.map((genre, index) => (
                                <Box
                                    key={index}
                                    sx={{
                                        padding: "5px 10px",
                                        background: "#FE4A49",
                                        boxShadow: "0px 0px 2px #000000",
                                        borderRadius: "5px",
                                        color: "#FFF",
                                        fontSize: "0.8em",
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                    }}
                                >
                                    {genre.name} {/* Afficher le nom du genre */}
                                </Box>
                            ))
                        ) : (
                            <Box
                                sx={{
                                    padding: "5px 10px",
                                    background: "#ccc",
                                    borderRadius: "5px",
                                    color: "#FFF",
                                    fontSize: "0.8em",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                }}
                            >
                                Aucun genre disponible
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Affichage de la plateforme */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "10px",
                        fontSize: "0.9em",
                        fontWeight: "bold",
                        color: "#333",
                    }}
                >
                    <span>Plateforme : {platform || "Non spécifiée"}</span>
                </Box>

                {/* Note en haut à droite */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "10px",
                        right: "10px",
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "#fff",
                        borderRadius: "3px",
                        padding: "5px 10px",
                        boxShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
                    }}
                >
                    <Box sx={{fontWeight: "bold", color: "#000"}}>
                        {rating || "N/A"}
                    </Box>
                    <StarIcon
                        sx={{
                            fontSize: "1em",
                            color: "#FFBB33",
                            marginLeft: "5px",
                        }}
                    />
                </Box>

                {/* Logo Steam en bas à droite */}
                <Box
                    sx={{
                        position: "absolute",
                        bottom: "10px",
                        right: "10px",
                        width: "1.5em",
                        height: "1.5em",
                    }}
                >
                    <Box
                        component="img"
                        src="https://upload.wikimedia.org/wikipedia/commons/8/83/Steam_icon_logo.svg"
                        alt="Steam"
                        sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                        }}
                    />
                </Box>
            </Box>
        </Card>
    );
}

export default ListImageCard;
