import React, {useContext, useEffect, useState} from "react";
import {
    Box,
    Typography,
    CircularProgress,
    useMediaQuery,
    Grid,
} from "@mui/material";
import GameList from "../components/GameList.jsx";
import {useTheme} from "@mui/material/styles";
import SectionTitle from "../components/SectionTitle.jsx";
import MobileTabs from "../components/MobileTabs.jsx";
import ResponsiveCommentCard from "../components/ResponsiveCommentCard";
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

    // Supprimer un commentaire du state local quand il est supprimé côté serveur
    const handleCommentDeleted = (commentId) => {
        setRecentComments((prevComments) =>
            prevComments.filter((comment) => comment.id !== commentId)
        );
    };

    // Contenus des onglets (version mobile)
    const tabTitles = ["Sorties récentes", "Jeux populaires", "Avis récents"];
    const tabContents = [
        <GameList key="recent" games={recentGames}/>,
        <GameList key="popular" games={popularGames}/>,
        <Box sx={{textAlign: "center", color: theme.palette.text.secondary}}>
            {recentComments.length > 0 ? (
                <Grid container spacing={2}>
                    {/* On boucle sur recentComments et, pour chaque "comment",
              on passe uniquement [comment] à ResponsiveCommentCard */}
                    {recentComments.map((comment) => (
                        <Grid item xs={12} sm={6} key={comment.id}>
                            <ResponsiveCommentCard
                                comments={[comment]}
                                maxComments={1}
                                currentUserId={user?.id}
                                onCommentDeleted={handleCommentDeleted}
                            />
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

// Fonction pour récupérer les jeux en fonction d'un filtre
const fetchGamesByFilter = async (filter) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/games/${filter}`);
        if (!response.ok) {
            throw new Error(`Erreur API : ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Erreur lors de la récupération des jeux (${filter}) :`, error);
        throw error;
    }
};

    // Charger les jeux (récents / populaires)
    const fetchAllGames = async () => {
        setLoading(true);
        setError("");
        try {
            const recent = await fetchGamesByFilter("by-date");
            const popular = await fetchGamesByFilter("by-popularity");
            setRecentGames(recent.length ? recent : recentGames);
            setPopularGames(popular.length ? popular : popularGames);
        } catch (err) {
            setError("Impossible de charger les jeux. Veuillez réessayer plus tard.");
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour récupérer les avis récents
const fetchRecentComments = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/game-reviews`);
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

    // Chargement initial
    useEffect(() => {
        fetchAllGames();
        fetchRecentComments(); // Charger les avis récents
    }, []);

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    flex: "1",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box
                sx={{
                    textAlign: "center",
                    color: theme.palette.colors.red,
                    marginTop: "20px",
                }}
            >
                <Typography variant="h6">{error}</Typography>
            </Box>
        );
    }

    // Rendu principal
    return (
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

            {/* Si on est en mobile => MobileTabs, sinon => affichage "desktop" */}
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
                                {/* Même logique ici : on boucle et on passe [comment]. */}
                                {recentComments.map((comment) => (
                                    <Grid item xs={12} sm={6} key={comment.id}>
                                        <ResponsiveCommentCard
                                            comments={[comment]}       // un seul comment
                                            maxComments={1}
                                            currentUserId={user?.id}
                                            onCommentDeleted={handleCommentDeleted}
                                        />
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Typography variant="body1">
                                <CircularProgress/>
                            </Typography>
                        )}
                    </Box>
                </>
            )}
        </>
    );
}

export default HomePage;
