import React from "react";
import Scrollable from "react-scrollable";
import {Box, Grid2, useMediaQuery} from "@mui/material";
import {useTheme} from "@mui/material/styles";
import GameCard from "../components/GameCard.jsx";
import SectionTitle from "../components/SectionTitle.jsx";

function GameList({title, games}) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <>
            {/* Afficher le titre de la section */}
            {!isMobile && <SectionTitle title={title}/>}

            {isMobile ? (
                <Scrollable horizontal>
                    <Grid2 container spacing={2} justifyContent="center" sx={{padding: isMobile ? '0' : '0.75em'}}>
                        {games.map((game) => (
                            <Grid2 xs={6} sm={4} key={game.id} sx={{
                                padding: 0,
                                display: "flex",
                                justifyContent: "center",
                                maxWidth: 'calc(50% - 1em)',
                                boxSizing: 'border-box',
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
                            </Grid2>
                        ))}
                    </Grid2>
                </Scrollable>
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
