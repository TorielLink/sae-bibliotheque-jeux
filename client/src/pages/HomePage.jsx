import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Tabs,
    Tab,
    CircularProgress,
    useMediaQuery,
} from "@mui/material";
import GameSection from "../components/GameSection.jsx";
import { useTheme } from "@mui/material/styles";
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
                        color: theme.palette.text.secondary,
                        fontSize: isMobile ? "0.9em" : "1em",
                        display: "inline",
                    }}
                >
                    Accueil &gt;
                </Typography>
                <Typography
                    variant="subtitle2"
                    sx={{
                        color: isMobile
                            ? theme.palette.colors.red
                            : theme.palette.text.primary,
                        fontWeight: "bold",
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
                                padding: "0.5em 0.75em",
                                border: `0.2em solid ${theme.palette.colors.green}`,
                                borderRadius: "0.5em 0.5em 0 0",
                            },
                            "& .Mui-selected": {
                                color: theme.palette.colors.red,
                                fontWeight: "bold",
                            },
                        }}
                    >
                        <Tab label="Sorties récentes" />
                        <Tab label="Jeux populaires" />
                        <Tab label="Avis récents" />
                    </Tabs>
                </Box>
            )}

            {/* Loading or Error */}
            {loading ? (
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
                        color: theme.palette.error.main,
                        marginTop: "20px",
                    }}
                >
                    <Typography variant="h6">{error}</Typography>
                </Box>
            ) : (
                <>
                    {/* Mobile View */}
                    {isMobile ? (
                        <GameSection games={currentGames} isMobileView={true} />
                    ) : (
                        /* Desktop View */
                        <>
                            <Box sx={{ marginTop: "2em" }}>
                                <GameSection
                                    title="Sorties récentes"
                                    games={recentGames}
                                    isMobileView={false}
                                />
                            </Box>

                            <Box sx={{ marginTop: "2em" }}>
                                <GameSection
                                    title="Jeux populaires"
                                    games={popularGames}
                                    isMobileView={false}
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
