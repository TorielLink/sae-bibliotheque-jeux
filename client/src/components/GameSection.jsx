import React from "react";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import GameSorter from "../components/GameSorter.jsx";
import GameCard from "../components/GameCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";
import { useTheme } from "@mui/material/styles";

function GameSection({ title, games, sortBy, order, isMobileView }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      {/* Afficher le titre de la section */}
      {!isMobileView && <SectionTitle title={title} />}

      <GameSorter games={games} sortBy={sortBy} order={order}>
        {(sortedGames) =>
          isMobileView ? (
            <Grid container spacing={2} justifyContent="center">
              {sortedGames.map((game) => (
                <Grid
                  item
                  xs={6}
                  sm={4}
                  key={game.id}
                  sx={{ padding: 0, display: "flex", justifyContent: "center" }}
                >
                  {/* Ajout de l'ID ici */}
                  <GameCard
                    id={game.id} // Transmettez l'ID à GameCard
                    image={game.image}
                    title={game.title}
                    rating={game.rating}
                    categories={game.categories}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box
              sx={{
                display: "flex",
                overflowX: "auto",
                gap: "30px",
                padding: "0px 0px",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": { display: "none" },
              }}
            >
              {sortedGames.map((game) => (
                <Box key={game.id} sx={{ flex: "0 0 auto" }}>
                  <GameCard
                    id={game.id} // Transmettez également l'ID ici
                    image={game.image}
                    title={game.title}
                    rating={game.rating}
                    categories={game.categories}
                  />
                </Box>
              ))}
            </Box>
          )
        }
      </GameSorter>
    </>
  );
}

export default GameSection;
