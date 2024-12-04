import React from "react";
import { Card, CardMedia, Typography, Chip, Box, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

function GameCard({ id, image, title, rating, categories }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const displayedCategories = isMobile ? categories.slice(0, 2) : categories;

  const handleCardClick = () => {
    console.log("Navigating to details with ID:", id); // Log pour vérifier l'ID
    navigate(`/details/${id}`); // Passe l'ID dans l'URL
  };

  return (
    <Card
      sx={{
        position: "relative",
        width: "184px",
        height: "276px",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0px 0px 15px rgba(0, 0, 0, 0.3)",
        },
      }}
      onClick={handleCardClick}
    >
      <Box sx={{ position: "relative", width: "100%", height: "241px", overflow: "hidden" }}>
        <CardMedia
          component="img"
          image={image || "https://via.placeholder.com/184x241"}
          alt={title || "Image non disponible"}
          sx={{ objectFit: "cover", width: "100%", height: "100%" }}
        />
        {rating !== "N/A" && (
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: theme.palette.background.default,
              borderRadius: "12px",
              padding: "2px 6px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "bold" }}>
              {rating}
            </Typography>
          </Box>
        )}
        <Box sx={{ position: "absolute", bottom: 8, left: 8, display: "flex", gap: "4px" }}>
          {displayedCategories.map((category, index) => (
            <Chip key={index} label={category} size="small" />
          ))}
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          width: "184px",
          height: "35px",
          left: "0px",
          top: "241px",
          backgroundColor: theme.palette.background.default,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontSize: "1rem", fontWeight: "bold" }}>
          {title || "Titre non disponible"}
        </Typography>
      </Box>
    </Card>
  );
}

export default GameCard;
