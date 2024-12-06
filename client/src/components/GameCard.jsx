import React from "react";
import { Card, CardMedia, CardContent, Typography, Chip, Box, useMediaQuery } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function GameCard({ id, image, title, rating, categories }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Vérifie si l'utilisateur est sur mobile

  const handleCardClick = () => {
    console.log("Navigating to details with ID:", id);
    navigate(`/details/${id}`); // Passe l'ID dans l'URL pour la navigation
  };

  return (
    <Card
      sx={{
        width: 180, // Largeur fixe
        height: 280, // Hauteur ajustée
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: "10px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        cursor: "pointer", // Indicateur visuel d'élément cliquable
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)", // Effet d'ombre au survol
          "& .categories": {
            opacity: isMobile ? 1 : 1, // Pas d'effet sur mobile
          },
        },
      }}
      onClick={handleCardClick} // Gestion du clic
    >
      {/* Image du jeu avec l'évaluation en haut à droite */}
      <Box sx={{ position: "relative", height: "85%" }}>
        <CardMedia
          component="img"
          image={image || "https://via.placeholder.com/250x180"}
          alt={title || "Image non disponible"}
          sx={{ objectFit: "cover", width: "100%", height: "100%" }}
        />

        {/* Évaluation (toujours visible) */}
        {rating && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: theme.palette.background.default,
              color: theme.palette.jaune?.main || theme.palette.primary.main,
              borderRadius: "12px",
              padding: "2px 6px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
                color: theme.palette.text.primary, // Texte en noir
              }}
            >
              {rating}
            </Typography>
            <StarIcon
              sx={{
                fontSize: "1rem",
                color: theme.palette.jaune?.main || theme.palette.primary.main,
              }}
            />
          </Box>
        )}

        {/* Catégories */}
        <Box
          className="categories"
          sx={{
            position: "absolute",
            bottom: 8, // Positionné près du bas de l'image
            left: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: "4px", // Espacement entre les chips
            opacity: isMobile ? 1 : 0, // Catégories toujours visibles sur mobile
            transition: isMobile ? "none" : "opacity 0.3s ease-in-out", // Pas de transition sur mobile
          }}
        >
          {categories.map((category, index) => (
            <Chip
              key={index}
              label={category}
              size="small"
              sx={{
                backgroundColor: theme.palette.red?.main || theme.palette.secondary.main,
                color: theme.palette.white?.main || "#fff",
                fontSize: "0.6rem", // Taille plus petite sur mobile
                height: "20px", // Hauteur réduite des chips
                borderRadius: "4px",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Titre du jeu en bas */}
      <CardContent
        sx={{
          height: "15%", // Zone de texte réduite
          textAlign: "center",
          padding: "4px 8px", // Réduction du padding
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontSize: "0.85rem", // Taille de texte réduite pour correspondre à l'espace
            fontWeight: "bold",
            color: theme.palette.text.primary,
            textAlign: "center",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "100%", // Empêcher les débordements
          }}
        >
          {title || "Titre non disponible"}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default GameCard;
