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

/**
 * Composant interne (non exporté) qui contient la logique commune.
 * On y ajoute une prop booléenne "isOverlayVariant" pour gérer
 * l'affichage standard vs overlay.
 */
function BaseGameCard({
  id,
  image,
  title,
  rating,
  categories = [],
  isOverlayVariant,
}) {
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
          // Pour la variante overlay, on fait apparaître le titre au survol (PC)
          ...(isOverlayVariant && {
            "& .titleOverlay": {
              // Sur mobile, titre toujours visible
              // Sur PC, on l'affiche au hover
              opacity: isMobile ? 1 : 1,
            },
          }),
        },
      }}
      onClick={handleCardClick}
    >
      {/* Zone image + note */}
      <Box sx={{ position: "relative", height: "100%" }}>
        <CardMedia
          component="img"
          image={image}
          alt={title || "Image non disponible"}
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
            color: theme.palette.colors.yellow,
            borderRadius: "0.2em",
            boxShadow: "0 0 0.1em #000000",
            padding: "0 0.25em",
            display: "flex",
            alignItems: "center",
            gap: "0.25em",
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            {rating}
          </Typography>
          <StarIcon
            sx={{
              fontSize: "1em",
              color: theme.palette.colors.yellow,
            }}
          />
        </Box>

        {/*
          1) Mode STANDARD => affiche les catégories (chips) en bas
          2) Mode OVERLAY => pas de catégories
        */}
        {!isOverlayVariant && (
          <Box
            className="categories"
            sx={{
              position: "absolute",
              bottom: "0.5em",
              left: "0.5em",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.3em",
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
        )}

        {/*
          Titre en overlay (mode OVERLAY).
          Sur mobile => toujours visible (opacity: 1).
          Sur PC => caché (opacity: 0), apparaît au hover.
        */}
        {isOverlayVariant && (
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
              {title || "Titre non disponible"}
            </Typography>
          </Box>
        )}
      </Box>

      {/*
        Mode STANDARD => titre dans un Box en bas
        Mode OVERLAY => déjà un titre overlay, donc on n'affiche rien
      */}
      {!isOverlayVariant && (
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
      )}
    </Card>
  );
}

/**
 * 1) GameCard
 *    => Version standard : titre en bas + catégories
 */
export function GameCard({ id, image, title, rating, categories }) {
  return (
    <BaseGameCard
      id={id}
      image={image}
      title={title}
      rating={rating}
      categories={categories}
      isOverlayVariant={false}
    />
  );
}

/**
 * 2) OverlayGameCard
 *    => Version overlay : titre en overlay (au survol sur PC),
 *       pas de catégories
 */
export function OverlayGameCard({ id, image, title, rating }) {
  return (
    <BaseGameCard
      id={id}
      image={image}
      title={title}
      rating={rating}
      categories={[]} // on ignore les categories
      isOverlayVariant={true}
    />
  );
}
