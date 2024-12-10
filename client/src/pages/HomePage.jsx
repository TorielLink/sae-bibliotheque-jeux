import React, {useEffect, useState} from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    CircularProgress,
    useMediaQuery,
} from "@mui/material";
import GameSection from "../components/GameSection.jsx";
import {useTheme} from "@mui/material/styles";
import SectionTitle from "../components/SectionTitle.jsx";

function HomePage() {
    const [recentGames, setRecentGames] = useState([]);
    const [popularGames, setPopularGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedTab, setSelectedTab] = useState(0);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const tabTitles = ["Sorties récentes", "Jeux populaires", "Avis récents"];

    // Fonction pour charger les jeux en fonction des filtres
    const fetchGamesByFilter = async (filter) => {
        // const queryParams = new URLSearchParams(filter).toString();

        const response = await fetch(`http://localhost:8080/games/${filter}`);
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
    };

    // Chargement des données pour les sections
    const fetchAllGames = async () => {
        setLoading(true);
        setError("");
        try {
            setRecentGames(await fetchGamesByFilter("by-date"));
            setPopularGames(await fetchGamesByFilter("by-popularity"));
        } catch (err) {
            console.error("Erreur lors de la récupération des jeux :", err);
            setError("Impossible de charger les jeux. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllGames();
    }, []);

    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
    };

    const currentGames =
        selectedTab === 0 ? recentGames : selectedTab === 1 ? popularGames : [];

    return (
        <Box sx={{padding: "0"}}>
            {/* Breadcrumb */}
            <Box sx={{
                display: "inline-block",
                padding: isMobile ? "0.75em 0 0 0.75em" : "1.5em 0 0 1.5em",
            }}>
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
                <div style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    height: "100%",
                    margin: "0.5em 0 0.5em 0"
                }}>
                    <Tabs
                        value={selectedTab}
                        onChange={handleTabChange}
                        centered
                        textColor="primary"
                        indicatorColor="blue"
                        sx={{
                            position: 'relative',
                            minHeight: "2em",
                            zIndex: 1,
                            "& .MuiTab-root": {
                                position: 'relative',
                                textTransform: "none",
                                fontWeight: "bold",
                                fontSize: "0.8em",
                                margin: "0 0.5em",
                                padding: '0.5em 0.75em',
                                minHeight: "auto",
                                background: theme.palette.background,
                                color: theme.palette.text.primary,
                                border: `0.2em solid ${theme.palette.colors.green}`,
                                borderRadius: '0.5em 0.5em 0 0',
                            },
                            "& .Mui-selected": {
                                color: theme.palette.colors.red,
                                borderBottom: `0`,
                                fontWeight: "bold",
                            },
                        }}
                    >
                        <Tab label="Sorties récentes"/>
                        <Tab label="Jeux populaires"/>
                        <Tab label="Avis récents"/>
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
                </div>
            )}

            {/* Loading or Error */
            }
            {
                loading ? (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "50vh",
                        }}
                    >
                        <CircularProgress/>
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
                        {isMobile ? (
                            <GameSection
                                games={currentGames}
                            />
                        ) : (
                            /* Desktop View */
                            <>
                                <Box sx={{
                                    marginTop: "2em"
                                }}>
                                    <GameSection
                                        title="Sorties récentes"
                                        games={recentGames}
                                    />
                                </Box>
                                {/*
                            */}

                                <Box sx={{}}>
                                    <GameSection
                                        title="Jeux populaires"
                                        games={popularGames}
                                    />
                                </Box>

                                <SectionTitle title="Avis récents"/>
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
                )
            }
        </Box>
    )
        ;
}

export default HomePage;
