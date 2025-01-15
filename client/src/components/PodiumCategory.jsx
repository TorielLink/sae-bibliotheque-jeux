import React from "react";
import GameCardCategory from "../components/GameCardCategory";

import { useTheme } from "@mui/material/styles";

const PodiumCategory = ({ data }) => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const games = data || []; //données de jeu

  // Accéder au premier, deuxième, troisième jeu
  const firstGame = games[0]; // Premier objet
  const secondGame = games[1]; // Deuxième objet
  const thirdGame = games[2]; // Troisième objet

  return (
    <section style={styles.podiumContainer}>
      <hr style={styles.separator} />

      <div style={styles.podium}>
        {/* Niveau 2 */}
        <div style={{ ...styles.podiumStep, ...styles.second }}>
          <GameCardCategory 
            id={secondGame.id}
            image={secondGame.cover}
            title={secondGame.name}
            note={secondGame.aggregated_rating}
            tags={secondGame.genres}  />
          <p style={{ ...styles.positionText, ...styles.secondPlace }}>2</p>
        </div>

        {/* Niveau 1 */}
        <div style={{ ...styles.podiumStep, ...styles.first }}>
          <GameCardCategory
            id={firstGame.id}
            image={firstGame.cover}
            title={firstGame.name}
            note={firstGame.aggregated_rating}
            tags={firstGame.genres} 
          />
          <p style={{ ...styles.positionText, ...styles.firstPlace }}>1</p>
        </div>

        {/* Niveau 3 */}
        <div style={{ ...styles.podiumStep, ...styles.third }}>
          <GameCardCategory
            id={thirdGame.id}
            image={thirdGame.cover}
            title={thirdGame.name}
            note={thirdGame.aggregated_rating}
            tags={thirdGame.genres} 
          />
          <p style={{ ...styles.positionText, ...styles.thirdPlace }}>3</p>
        </div>
      </div>
      <hr style={styles.separator} />
    </section>
  );
};

const getStyles = (theme) => ({
  podiumContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
  },
  separator: {
    border: "none",
    borderTop: "3px solid " + theme.palette.colors.green,
    margin: "20px auto",
  },
  podium: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  podiumStep: {
    backgroundColor: theme.palette.background.default,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: "17em",
  },
  // blocs des podiums
  first: {
    height: "170px",
    width: "30em",
  },
  second: {
    height: "130px",
    width: "30em",
  },
  third: {
    height: "100px",
    width: "30em",
  },
  positionText: {
    // texte de classement
    fontSize: "35px",
    fontWeight: "bold",
    textAlign: "center",
  },
  firstPlace: { color: "#fdd835", marginBottom: "60px", marginTop: "2em" }, // Or
  secondPlace: { color: "#c0c0c0", marginBottom: "35px", marginTop: "1.6em" }, // Argent
  thirdPlace: { color: "#cd7f32", marginBottom: "20px", marginTop: "1.2em" }, // Bronze
});

export default PodiumCategory;