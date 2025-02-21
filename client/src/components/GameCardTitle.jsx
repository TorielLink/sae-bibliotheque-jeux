import React from "react";
import {Box, Card, CardMedia, Typography, useMediaQuery} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import {useTheme} from "@mui/material/styles";
import {useNavigate} from "react-router-dom";
import {useTranslation} from 'react-i18next';

function GameCardTitle({id, image, title, rating}) {
    const {t} = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Gestion du clic sur la carte
    const handleCardClick = () => {
        console.log("Navigating to details with ID:", id);
        navigate(`/details/${id}`);
    };

    // Debug des données reçues
    console.log("GameCardTitle Props:", {id, image, title, rating});

    return (
        <Card
            sx={{
                width: "13em",
                height: "20em",
                position: "relative",
                backgroundColor: theme.palette.background.paper,
                color: theme.palette.text.primary,
                borderRadius: "0.3125em",
                boxShadow: "0 0 0.5em #000000",
                overflow: "hidden",
                cursor: "pointer",
                transition: "box-shadow 0.3s ease-in-out",
                "&:hover": {
                    boxShadow: "0 0 1em #000000",
                    "& .titleOverlay": {
                        opacity: 1,
                    },
                },
            }}
            onClick={handleCardClick}
        >
            {/* Zone contenant l'image et l'évaluation */}
            <Box sx={{position: "relative", height: "100%"}}>
                {/* Affichage de l'image avec fallback */}
                <CardMedia
                    component="img"
                    image={image || "/placeholder-image.png"} // Image par défaut
                    alt={title || t("game.cover.noCoverAvailable")}
                    sx={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                    }}
                />

                {/* Note (rating) en haut à droite */}
                <Box
                    sx={{
                        position: "absolute",
                        top: "0.5em",
                        right: "0.5em",
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.colors?.yellow || "#FFD700",
                        borderRadius: "0.2em",
                        boxShadow: "0 0 0.1em #000000",
                        padding: "0 0.25em",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.25em",
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            fontWeight: "bold",
                        }}
                    >
                        {rating || "—"}
                    </Typography>
                    <StarIcon
                        sx={{
                            fontSize: "1em",
                            color: theme.palette.colors?.yellow || "#FFD700",
                        }}
                    />
                </Box>

                {/* Titre en overlay */}
                <Box
                    className="titleOverlay"
                    sx={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        width: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.6)",
                        color: "#fff",
                        padding: "0.4em",
                        textAlign: "center",
                        opacity: isMobile ? 1 : 0,
                        transition: isMobile ? "none" : "opacity 0.3s ease-in-out",
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontSize: "0.85em",
                            fontWeight: "bold",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                        }}
                    >
                        {title || t("game.title.noTitleAvailable")}
                    </Typography>
                </Box>
            </Box>
        </Card>
    );
}

export default GameCardTitle;
