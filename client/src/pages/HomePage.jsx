import React, { useEffect, useState } from "react";
import {Box, Typography, CircularProgress, useMediaQuery, Tabs, Tab} from "@mui/material";
import GameList from "../components/GameList.jsx";
import {useTheme} from "@mui/material/styles";
import SectionTitle from "../components/SectionTitle.jsx";
import MobileTabs from "../components/MobileTabs.jsx";

function HomePage() {
    const [recentGames, setRecentGames] = useState([]);
    const [popularGames, setPopularGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedTab, setSelectedTab] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const tabTitles = ["Sorties récentes", "Jeux populaires", "Avis récents"];
    const tabContents = [
        <GameList key="recent" games={recentGames} />,
        <GameList key="popular" games={popularGames} />,
        <Box sx={{ textAlign: "center", color: theme.palette.text.secondary }}>
            <Typography variant="body1">
                Les avis récents seront bientôt disponibles !
            </Typography>
        </Box>,
    ];

    // Fonction pour charger les jeux en fonction des filtres
    const fetchGamesByFilter = async (filter) => {
        try {
            const response = await fetch(`http://localhost:8080/games/${filter}`);
            if (!response.ok) {
                throw new Error(`Erreur API : ${response.statusText}`);
            }
            const data = await response.json();
            console.log(`Données reçues pour ${filter}:`, data);
            return data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des jeux (${filter}):`, error);
            throw error;
        }
    };

    // Chargement des données pour les sections
    const fetchAllGames = async () => {
        setLoading(true);
        setError("");
        try {
            const recent = await fetchGamesByFilter("by-date");
            const popular = await fetchGamesByFilter("by-popularity");
            setRecentGames(recent.length ? recent : recentGames); // Préserver les anciennes données si vides
            setPopularGames(popular.length ? popular : popularGames);
        } catch (err) {
            setError("Impossible de charger les jeux. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    // Chargement initial des jeux
    useEffect(() => {
        fetchAllGames();
    }, []);

    // Gestion des changements d'onglets
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    // Données affichées en fonction de l'onglet sélectionné
    const currentGames =
        selectedTab === 0 ? recentGames : selectedTab === 1 ? popularGames : [];

    return (
        <Box sx={{ padding: "0" }}>
            {/* Breadcrumb */}
            <Box
                sx={{
                    display: "inline-block",
                    padding: isMobile ? "0.75em 0 0 0.75em" : "1.5em 0 0 1.5em",
                }}
            >
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: theme.palette.colors.red,
                        fontSize: isMobile ? "0.9em" : "1em",
                        display: "inline",
                    }}
                >
                    Accueil &gt;
                </Typography>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: isMobile ? theme.palette.colors.red : theme.palette.text.primary,
                        display: "inline",
                        marginLeft: "0.25em",
                    }}
                >
                    {isMobile ? tabTitles[selectedTab] : ""}
                </Typography>
            </Box>

            {/* Mobile Tabs */}
            {isMobile && (
                <Box sx={{ margin: "0.5em 0" }}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        centered
                        textColor="primary"
                        indicatorColor="blue"
                        sx={{
                            "& .MuiTab-root": {
                                textTransform: "none",
                                fontWeight: "bold",
                                fontSize: "0.8em",
                                margin: "0 0.5em",
                                padding: '0.5em 0.75em',
                                minHeight: "auto",
                                background: theme.palette.background.default,
                                color: theme.palette.text.primary,
                                borderRadius: '0.5em 0.5em 0 0',
                                border: "0.2em solid ${theme.palette.colors.green}",
                            },
                            "& .Mui-selected": {
                                color: theme.palette.colors.red,
                                borderBottom: `0`,
                                fontWeight: "bold",
                            },
                        }}
                    >
                        <Tab label="Sorties récentes" />
                        <Tab label="Jeux populaires" />
                        <Tab label="Avis récents" />
                    </Tabs>
                    <hr
                        style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            width: "100%",
                            border: 'none',
                            height: '0.15em',
                            backgroundColor: theme.palette.colors.green,
                            margin: 0,
                            zIndex: 0,
                        }}
                    />
                </Box>
            )}


            {/* Loading or Error */}
            { loading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "50vh",
                    }}
                >
                    <CircularProgress />
                </Box>
                ) : error ? (
                    <Box
                        sx={{
                            textAlign: "center",
                            color: theme.palette.colors.red,
                            marginTop: "20px",
                        }}
                    >
                        <Typography variant="h6">{error}</Typography>
                    </Box>
                ) : (
                    <>
                        {/* Mobile View */}
                        { isMobile ? (
                            <GameList
                                games={currentGames}
                            />
                        ) : (
                            /* Desktop View */
                            <>
                                <Box sx={{
                                    marginTop: "2em"
                                }}>
                                    <GameList
                                        title="Sorties récentes"
                                        games={recentGames}
                                    />
                                </Box>
                                {/*
                            */}

                                <Box sx={{}}>
                                    <GameList
                                        title="Jeux populaires"
                                        games={popularGames}
                                    />
                                </Box>
                            <SectionTitle title="Avis récents" />
                            <Box
                                sx={{
                                    textAlign: "center",
                                    color: theme.palette.text.secondary,
                                    marginTop: "1.5em",
                                    marginBottom: "2.5em",
                                }}
                            >
                                <Typography variant="body1">
                                    Les avis récents seront bientôt disponibles !
                                </Typography>
                            </Box>
                        </>
                    )}
                </>
            )}
        </Box>
    );
}

export default HomePage;
