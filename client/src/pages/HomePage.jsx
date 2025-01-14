import React, {useContext, useEffect, useState} from "react";
import {Box, Typography, CircularProgress, useMediaQuery, Grid} from "@mui/material";
import GameList from "../components/GameList.jsx";
import {useTheme} from "@mui/material/styles";
import SectionTitle from "../components/SectionTitle.jsx";
import MobileTabs from "../components/MobileTabs.jsx";
import CommentCard from "../components/CommentCard.jsx";
import {AuthContext} from "../components/AuthContext";

function HomePage() {
    const [recentGames, setRecentGames] = useState([]);
    const [popularGames, setPopularGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const {user} = useContext(AuthContext);
    const [recentComments, setRecentComments] = useState([]);

    const tabTitles = ["Sorties récentes", "Jeux populaires", "Avis récents"];
    const tabContents = [
        <GameList key="recent" games={recentGames}/>,
        <GameList key="popular" games={popularGames}/>,
        <Box sx={{textAlign: "center", color: theme.palette.text.secondary}}>
            {recentComments.length > 0 ? (
                <Grid container spacing={2}>
                    {recentComments.map((comment, index) => (
                        <Grid item xs={12} sm={6} key={comment.id}>
                            <CommentCard comments={[comment]} currentUserId={user?.id}/>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">
                    Aucun avis disponible pour le moment.
                </Typography>
            )}
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

    const fetchRecentComments = async () => {
        try {
            const response = await fetch("http://localhost:8080/game-reviews");
            if (!response.ok) {
                throw new Error(`Erreur API : ${response.statusText}`);
            }
            const data = await response.json();
            if (!data.data || !Array.isArray(data.data)) {
                setError("Format des données inattendu pour les avis.");
                return;
            }
            setRecentComments(data.data);
        } catch (error) {
            setError("Impossible de charger les avis récents. Veuillez réessayer plus tard.");
        }
    };

    // Chargement initial des jeux
    useEffect(() => {
        fetchAllGames();
        fetchRecentComments(); // Charger les avis récents

    }, []);

    return (
        loading ? (
            <Box
                sx={{
                    display: 'flex',
                    flex: '1',
                    justifyContent: 'center',
                    alignItems: 'center',
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
                </Box>
                {isMobile ? (
                    <MobileTabs tabTitles={tabTitles} tabContents={tabContents}/>
                ) : (
                    <>
                        <Box sx={{marginTop: "2em"}}>
                            <GameList title="Sorties récentes" games={recentGames}/>
                        </Box>
                        <Box>
                            <GameList title="Jeux populaires" games={popularGames}/>
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
                            {recentComments.length > 0 ? (
                                <Grid container spacing={2}>
                                    {recentComments.map((comment) => (
                                        <Grid item xs={12} sm={6} key={comment.id}>
                                            <CommentCard comments={[comment]} currentUserId={user?.id}/>
                                        </Grid>
                                    ))}
                                </Grid>
                            ) : (
                                <Typography variant="body1">
                                    Aucun avis disponible pour le moment.
                                </Typography>
                            )}
                        </Box>
                    </>
                )}
            </>
        )
    );
}

export default HomePage;
