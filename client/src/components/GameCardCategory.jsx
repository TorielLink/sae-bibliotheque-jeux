import React from "react";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import StarIcon from "@mui/icons-material/Star";
import Button from "@mui/material/Button";
import { alpha } from "@mui/material/styles";

import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import {useTranslation} from 'react-i18next';

const GameCardCategory = ({ id, image, title, note, tags }) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = getStyles(theme);
  const navigate = useNavigate();

  // Débogage : vérifier les props
  //console.log({ id, image, title, note, tags });

  // permet d'accéder directement à la page détails du jeu
  const gamesDetailsClick = () => {
    console.log("Navigating to details with ID:", id);
    navigate(`/details/${id}`);
  };

  return (
    <section style={styles.gameCard}>
      <img src={image} alt={title} style={styles.poster} />

      <div style={styles.infos}>
        <h3 style={styles.title}>{title || t("game.title.noTitleAvailable")}</h3>
        <div style={styles.tags}>
          {tags.length > 0 ? (
            tags.map((tag, index) => (
              <Stack key={index} direction="row" spacing={1}>
                <Chip label={tag} size="small" style={styles.tag} />
              </Stack>
            ))
          ) : (
            <p>{t("game.tags.noTagAvailable")}</p>
          )}
        </div>
        <div style={styles.notes}>
          <p style={styles.note}>{t("review.comments.category.rating")} : {note || ""} </p>
          <StarIcon style={styles.star} />
        </div>

        <Button style={styles.button} onClick={gamesDetailsClick}>
          {t("actions.discover")}
        </Button>
      </div>
    </section>
  );
};

const getStyles = (theme) => ({
  gameCard: {
    display: "flex",
    alignItems: "start",
    height: "16em",
    width: "26em",
    position :"relative",
  },
  poster: {
    width: "11em", //13em ou 9.375em
    height: "inherit", //20em ou 14.063em
    borderRadius: "2%",
    boxShadow: "0 0 0.5em #000000",
    overflow: "hidden",
  },
  infos: {
    width: "15em",
    height: "inherit",
    marginLeft: "2%",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    margin: "0 0 7% 0",
  },
  tags: {
    display: "flex", // Utilisation de flexbox
    alignItems: "center", // Alignement vertical centré
    flexWrap: "wrap", // Autorise le passage à la ligne si nécessaire
    gap: "0.25em",
    margin: "0 0 2% 0",
  },
  tag: {
    backgroundColor: theme.palette.colors.red,
    color: theme.palette.text.contrast,
    fontSize: "14px",
    height: "1.5em",
    borderRadius: "0.325em",
    margin: "0 0.25em 0.25em 0",
    overflow: "hidden",
  },
  notes: {
    display: "flex",
    margin: "0 0 10% 0",
  },
  note: {
    fontSize: "15px",
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
  },
  star: {
    color: theme.palette.colors.yellow,
    margin: "5% 0 0 2%",
  },
  button: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    backgroundColor: alpha(theme.palette.colors.purple, 0.6), // 30% de transparence
    borderColor: theme.palette.colors.purple,
    padding: "0.5% 4%",
    marginRight: "7%",
    borderRadius: "15px",
    fontSize: "13px",
    position : "absolute",
    bottom : "0",
    right : "0",
  },
});

export default GameCardCategory;
