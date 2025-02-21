import React, {useEffect, useState} from "react";
import {Box, Breadcrumbs, Button, CircularProgress, Link} from "@mui/material";
import Stack from "@mui/material/Stack";

import GameCategory from "../components/GameCategory";
import GameList from "../components/GameList.jsx";

import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";

const CataloguePage = () => {
    const { t } = useTranslation();
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
        { id: 4, name: "Fighting", key: "category.fighting" },
        { id: 5, name: "Shooter", key: "category.shooter" },
        { id: 8, name: "Platform", key: "category.platform" },
        { id: 11, name: "Real Time Strategy (RTS)", key: "category.rts" },
        { id: 12, name: "Role-playing (RPG)", key: "category.rpg" }
    ];

    const categoryID = catTitle.map(category => category.id);
    const categoryName = catTitle.map(category => category.name);
    const categoryKeys = catTitle.map(category => category.key);

  // récupérer les jeux via une requête POST
    const fetchGameByGenres = async (body) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/games/by-genres`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error(`Erreur API : ${response.statusText}`);
            return await response.json();
        } catch (error) {
            console.error("Erreur lors de la récupération des jeux :", error);
            throw error;
        }
    };

    const filterGamesByGenre = (games) => {
        return categoryName.map(name => games.filter(game => game.genres.includes(name)));
    };

    // exécution API
    useEffect(() => {
        const fetchGames = async () => {
            setLoading(true);
            try {
                const body = {limit: 100, offset: 0, genres: categoryID};
                const gamesData = await fetchGameByGenres(body);
                console.log("Données reçues API :", gamesData);

                const filteredGames = filterGamesByGenre(gamesData);
                setFightingGames(filteredGames[0]);
                setShooterGames(filteredGames[1]);
                setPlatformGames(filteredGames[2]);
                setRtsGames(filteredGames[3]);
                setRpgGames(filteredGames[4]);
                setAllGames(gamesData);
            } catch {
                setError(t("error.loadingGames"));
            } finally {
                setLoading(false);
            }
        };
        fetchGames();
    }, []);

    const AllGames = () => (
        <div>
            {catTitle.map((category, index) => (
                <GameList key={index} title={t(category.key)}
                          games={[fightingGames, shooterGames, platformGames, rtsGames, rpgGames][index]}/>
            ))}
        </div>
    );

    const GameCategoryComponent = ({index}) => (
        <GameCategory
            style={styles.gameCard}
            categoryTitle={t(catTitle[index].key)}
            data={[fightingGames, shooterGames, platformGames, rtsGames, rpgGames][index]}
            podium={true}
        />
    );

    const fighting = () => <GameCategoryComponent index={0} />;
    const shooting = () => <GameCategoryComponent index={1} />;
    const platform = () => <GameCategoryComponent index={2} />;
    const rts = () => <GameCategoryComponent index={3} />;
    const rpg = () => <GameCategoryComponent index={4} />;

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
                            {t("pageName.home")}
                        </Link>
                        <Link
                            underline="hover"
                            href="/catalogue"
                            style={styles.txtBreadcrumb}>
                            {t("pageName.catalogue")}
                        </Link>
                    </Breadcrumbs>

                    {/* Boutons filtre */}
                    <Stack direction="row" spacing={2} style={styles.buttons}>
                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("all")}
                        >
                            {t("category.all")}
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("fighting")}
                        >
                            {t("category.fighting")}
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("shooting")}
                        >
                            {t("category.shooter")}
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("platform")}
                        >
                            {t("category.platform")}
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("rts")}
                        >
                            {t("category.rts")}
                        </Button>

                        <Button
                            variant="outlined"
                            style={styles.button}
                            onClick={() => setActiveComponent("rpg")}
                        >
                            {t("category.rpg")}
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