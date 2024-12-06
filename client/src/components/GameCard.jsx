import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
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
        width: 150,
        height: 225,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        borderRadius: "10px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.3)",
        overflow: "hidden",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.2)",
          "& .categories": {
            opacity: isMobile ? 1 : 1,
          },
        },
      }}
      onClick={handleCardClick}
    >
      {/* Zone contenant l'image et l'évaluation */}
      <Box sx={{ position: "relative", height: "85%"}}>
        {/* Affiche l'image uniquement si elle existe */}
        {image && (
          <CardMedia
            component="img"
            image={image}
            alt={title || "Image non disponible"}
            sx={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        )}

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
                color: theme.palette.text.primary,
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
            bottom: 8,
            left: 8,
            display: "flex",
            flexWrap: "wrap",
            gap: "4px",
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
                backgroundColor: theme.palette.red?.main || theme.palette.secondary.main,
                color: theme.palette.white?.main || "#fff",
                fontSize: "0.6rem",
                height: "20px",
                borderRadius: "6px",
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Titre du jeu */}
      <CardContent
        sx={{
          height: "15%",
          textAlign: "center",
          padding: "8px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
            marginTop: "4px",

        }}
      >
  <Typography
    variant="h6"
    component="div"
    sx={{
      fontSize: "0.85rem",
      fontWeight: "bold",
      color: theme.palette.text.primary,
      textAlign: "center",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "100%",
    }}
  >
    {title || "Titre non disponible"}
  </Typography>
      </CardContent>
    </Card>
  );
}

export default GameCard;
