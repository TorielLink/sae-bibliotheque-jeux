import React from "react";
import {
    Card,
    CardMedia,
    Typography,
    Chip,
    Box,
    useMediaQuery,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function GameCard({ id, image, title, rating, categories }) {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const handleCardClick = () => {
        console.log("Navigating to details with ID:", id);
        navigate(`/details/${id}`);
    };

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
                "&:hover": {
                    boxShadow: "0 0 1em #000000",
                    "& .categories": {
                        opacity: 1,
                    },
                },
            }}
            onClick={handleCardClick}
        >
            {/* Zone contenant l'image et l'évaluation */}
            <Box sx={{ position: "relative", height: "85%" }}>
                <CardMedia
                    component="img"
                    image={image}
                    alt={title || "Image non disponible"}
                    sx={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%"
                }} />

                <Box
                    sx={{
                        position: "absolute",
                        top: "0.5em",
                        right: "0.5em",
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.colors.yellow,
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
                        {rating}
                    </Typography>
                    <StarIcon
                        sx={{
                            fontSize: "1em",
                            color: theme.palette.colors.yellow,
                        }}
                    />
                </Box>

                {/* Catégories */}
                <Box
                    className="categories"
                    sx={{
                        position: "absolute",
                        bottom: "0.5em",
                        left: "0.5em",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "0.3em",
                        opacity: isMobile ? 1 : 0,
                        transition: isMobile ? "none" : "opacity 0.3s ease-in-out",
                    }}
                >
                    {categories.map((category, index) => (
                        <Chip
                            key={index}
                            label={category}
                            size="small"
                            sx={{
                                backgroundColor: theme.palette.colors.red,
                                color: theme.palette.text.contrast,
                                fontSize: "0.8em",
                                height: "1.5em",
                                borderRadius: "0.325em",
                            }}
                        />
                    ))}
                </Box>
            </Box>

            {/* Titre du jeu */}
            <Box
                sx={{
                    height: "15%",
                    display: "flex",
                    alignItems: "center",
                    padding: "0 0.5em",
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontSize: "0.85em",
                        fontWeight: "bold",
                        color: theme.palette.text.primary,
                        whiteSpace: "nowrap",
                        width: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {title || "Titre non disponible"}
                </Typography>
            </Box>
        </Card>
    );
}

export default GameCard;
