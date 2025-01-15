import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Button, CircularProgress, Link} from "@mui/material";
import Stack from "@mui/material/Stack";

import GameCategory from "../components/GameCategory";
import GameList from "../components/GameList.jsx";

import {useTheme} from "@mui/material/styles";

const CataloguePage = () => {
    const theme = useTheme();
    const styles = getStyles(theme);

    const [allGames, setAllGames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Définir un état pour chaque catégorie
    const [activeComponent, setActiveComponent] = useState("all"); // 'all' par défaut

    // Data de chaque catégorie
    const [fightingGames, setFightingGames] = useState([]);
    const [shooterGames, setShooterGames] = useState([]);
    const [platformGames, setPlatformGames] = useState([]);
    const [rtsGames, setRtsGames] = useState([]);
    const [rpgGames, setRpgGames] = useState([]);

    const catTitle = [
        {id: 4, name: "Fighting", nameFR: "Combat"},
        {id: 5, name: "Shooter", nameFR: "Tir"},
        {id: 8, name: "Platform", nameFR: "Plateforme"},
        {
            id: 11,
            name: "Real Time Strategy (RTS)",
            nameFR: "Stratégie en temps réel (RTS)",
        },
        {id: 12, name: "Role-playing (RPG)", nameFR: "Jeux de rôle (RPG)"},
    ];

    // ID des catégories
    const categoryID = catTitle.map(function (category) {
        return category.id;
    });
    console.log("ID des catégories :", categoryID);

    // Nom des catégories
    const categoryName = catTitle.map(function (category) {
        return category.name;
    });
    console.log("Nom des catégories :", categoryName);

    //Nom français des catégories
    const categoryNameFR = catTitle.map(function (category) {
        return category.nameFR;
    });
    console.log("Nom des catégories :", categoryNameFR);

    // récupérer les jeux
    const fetchGameByGenres = async (body) => {
        try {
            const response = await fetch(`http://localhost:8080/games/by-genres`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error(`Erreur API : ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la récupération des jeux :", error);
            throw error;
        }
    };

    //mettre les jeux dans des variables
    const filterGamesByGenre = (games) => {
        console.log("Jeux avant filtrage :", games);
        setFightingGames(
            games.filter((game) => game.genres.includes(categoryName[0]))
        );
        setShooterGames(
            games.filter((game) => game.genres.includes(categoryName[1]))
        );
        setPlatformGames(
            games.filter((game) => game.genres.includes(categoryName[2]))
        );
        setRtsGames(games.filter((game) => game.genres.includes(categoryName[3])));
        setRpgGames(games.filter((game) => game.genres.includes(categoryName[4])));
    };

    // exécution API
    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const body = {limit: 100, offset: 0, genres: categoryID};
                const gamesData = await fetchGameByGenres(body);
                console.log("Données reçues API :", gamesData);

                // Une fois les jeux récupérés, filtrez-les par genre
                filterGamesByGenre(gamesData);

                // Mettez à jour l'état pour tous les jeux
                setAllGames(gamesData);
            } catch {
                setError("Impossible de charger les jeux.");
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []); // Vous pouvez ajuster la dépendance ici si nécessaire

    const AllGames = () => {
        return (
            <div>
                <GameList title={categoryNameFR[0]} games={fightingGames}/>
                <GameList title={categoryNameFR[1]} games={shooterGames}/>
                <GameList title={categoryNameFR[2]} games={platformGames}/>
                <GameList title={categoryNameFR[3]} games={rtsGames}/>
                <GameList title={categoryNameFR[4]} games={rpgGames}/>
            </div>
        );
    };

    const fighting = () => {
        return (
            <GameCategory
                style={styles.gameCard}
                categoryTitle={categoryNameFR[0]}
                data={fightingGames}
                podium={true}
            />
        );
    };

    const shooting = () => {
        return (
            <GameCategory
                style={styles.gameCard}
                categoryTitle={categoryNameFR[1]}
                data={shooterGames}
                podium={true}
            />
        );
    };

    const platform = () => {
        return (
            <GameCategory
                style={styles.gameCard}
                categoryTitle={categoryNameFR[2]}
                data={platformGames}
                podium={true}
            />
        );
    };

    const rts = () => {
        return (
            <GameCategory
                style={styles.gameCard}
                categoryTitle={categoryNameFR[3]}
                data={rtsGames}
                podium={true}
            />
        );
    };

    const rpg = () => {
        return (
            <GameCategory
                style={styles.gameCard}
                categoryTitle={categoryNameFR[4]}
                data={rpgGames}
                podium={true}
            />
        );
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case "all":
                return AllGames();
            case "fighting":
                return fighting();
            case "shooting":
                return shooting();
            case "platform":
                return platform();
            case "rts":
                return rts();
            case "rpg":
                return rpg();
            default:
                return AllGames();
        }
    };

    console.log("Filtre plateforme :", platformGames);

    return (
        <section style={
            {
                flexGrow: 1,
            }
        }>
            {loading ? (
                <Box
                    sx={{
                        padding: '30%',
                        display: 'flex',
                        flex: '1',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}

                >
                    <CircularProgress/>
                </Box>
            ) : error ? (
                <p style={{color: "red"}}>{error}</p>
            ) : (
                <>
                    <Breadcrumbs separator="›" style={styles.breadcrumb}>
                        <Link underline="hover" href="/" style={styles.txtBreadcrumb}>
                            Accueil
                        </Link>
                        <Link
                            underline="hover"
                            href="/catalogue"
                            style={styles.txtBreadcrumb}>
                            Catalogue
                        </Link>
                    </Breadcrumbs>

                    {/* Boutons filtre */}
                    <Stack direction="row" spacing={2} style={styles.buttons}>
                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("all")}
                        >
                            Tout
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("fighting")}
                        >
                            Combat
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("shooting")}
                        >
                            Tir
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("platform")}
                        >
                            Plateforme
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("rts")}
                        >
                            RTS
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("rpg")}
                        >
                            RPG
                        </Button>
                    </Stack>

                    <div>{renderComponent()}</div>
                </>
            )}
        </section>
    );
};

const getStyles = (theme) => ({
    breadcrumb: {
        fontFamily: theme.typography.fontFamily,
        //fontSize: "1em",
        color: theme.palette.colors.red,
        margin: "2em 0 1em 2em",
    },
    txtBreadcrumb: {
        fontFamily: theme.typography.fontFamily,
        //fontSize: "1em",
        color: theme.palette.colors.red,
    },
    loadingTxt: {
        fontFamily: theme.typography.fontFamily,
        fontWeight: "700",
        color: theme.palette.text.primary,
        textAlign: "center",
    },
    buttons: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "1.5em 0",
    },
    button: {
        color: theme.palette.colors.blue,
        backgroundColor: theme.palette.background.paper,
        fontWeight: "700",
        fontSize: "14px",
        padding: "0.25em 1.75em",
        borderRadius: "2em",
    },
    gameCard: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
});
export default CataloguePage;
