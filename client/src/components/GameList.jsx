import React from "react";
import {Box, Grid, useMediaQuery} from "@mui/material";
import SectionTitle from "../components/SectionTitle.jsx";
import {useTheme} from "@mui/material/styles";
import {GameCard} from "./GameCard.jsx";

function GameList({title, games}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            {/* Afficher le titre de la section */}
            {!isMobile && <SectionTitle title={title}/>}

            {isMobile ? (
                <Grid container spacing={2} justifyContent="center" sx={{
                    padding:'0.75em'
                }}> // TODO : passer de Grid (déprécié) à Grid2
                    {games.map((game) => (
                        <Grid
                            item
                            xs={6}
                            sm={4}
                            key={game.id}
                            sx={{
                                padding: 0,
                                display: "flex",
                                justifyContent: "center"
                        }}
                        >
                            {/* Ajout de l'ID ici */}
                            <GameCard
                                id={game.id}
                                image={game.cover}
                                title={game.name}
                                rating={game.aggregated_rating}
                                categories={game.genres}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        overflowX: "auto",
                        gap: "1.875em",
                        marginTop: "1em",
                        marginBottom: "4em",
                        padding: "1.5em",
                        scrollbarWidth: "none",
                        "&::-webkit-scrollbar": {display: "none"},
                    }}
                >
                    {games.map((game) => (
                        <Box key={game.id} sx={{flex: "0 0 auto"}}>
                            <GameCard
                                id={game.id}
                                image={game.cover}
                                title={game.name}
                                rating={game.aggregated_rating}
                                categories={game.genres}
                            />
                        </Box>
                    ))}
                </Box>
            )}
        </>
    );
}

export default GameList;
