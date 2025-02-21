import React from "react";
import GameCardCategory from "../components/GameCardCategory";
import PodiumCategory from "./PodiumCategory";

import { useTheme } from "@mui/material/styles";
import {useTranslation} from 'react-i18next';

const GameCategory = ({ categoryTitle, data, podium }) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const styles = getStyles(theme);

  const podiumGames = data.slice(0, 3);
  const listGames = data.length > 3 ? data.slice(3) : [];
  const numGames = data.length;

  if (data.length === 0) {
    return <p>{t("category.error.noGameInCategory")} "{categoryTitle}".</p>;
  }

  return (
    <section>
      <h1 style={styles.title}>{categoryTitle}</h1>
      
      {podium ? (
        <div>
          <div style ={styles.podium}>
            <PodiumCategory
              data = {podiumGames}
            />
          </div>
          <p style={styles.count}>t("category.total") : {numGames}</p>
          <div style={styles.list}>
            {listGames.map((game) => (
              <div key={game.id} style={styles.card}>
                <GameCardCategory 
                id={game.id}
                image={game.cover}
                title={game.name}
                note={game.aggregated_rating}
                tags={game.genres} 
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
        <p style={styles.count}>{numGames + " " + t("category.wGame")}</p>
        <div style={styles.list}>
          {data.map((game) => (
            <div key={game.id} style={styles.card}>
              <GameCardCategory
                id={game.id}
                image={game.cover}
                title={game.name}
                note={game.aggregated_rating}
                tags={game.genres} 
              />
            </div>
          ))}
        </div>
      </div>
      )}
    </section>
  );
};

const getStyles = (theme) => ({
  title: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    textAlign: "center",
    margin: "3% 0 0 0",
  },
  podium : {
    justifyContent: "center",
    alignItems: "center",
  },
  count: {
    float: "right",
    margin: "3% 7% 3% 0",
    fontSize: "15px",
    fontWeight: "700",
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
  },
  list: {
    display: "flex",
    flexWrap: "wrap",
    width: "98%",
    justifyContent: "center",
    alignItems: "center",
    margin: "2% 0 5% 0",
  },
  card: {
    margin: "0 2.5% 2% 2.5%",
  },
});

export default GameCategory;