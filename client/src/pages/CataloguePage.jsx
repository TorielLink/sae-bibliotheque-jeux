import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import GameCategory from "../components/GameCategory";
import GameList from "../components/GameList.jsx";

import { useTheme } from "@mui/material/styles";

const CataloguePage = () => {
  const theme = useTheme();
  const styles = getStyles(theme);

  const [allGames, setAllGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Définir un état pour chaque catégorie
    const [visibleCategory, setVisibleCategory] = useState({
      fighting: false,
      shooter: false,
      platform: false,
      rts: false,
      rpg: false,
      simulation: false,
      strategy: false,
      adventure: false,
    });

  // Data de chaque catégorie
  const [fightingGames, setFightingGames] = useState([]);
  const [shooterGames, setShooterGames] = useState([]);
  const [platformGames, setPlatformGames] = useState([]);
  const [rtsGames, setRtsGames] = useState([]);
  const [rpgGames, setRpgGames] = useState([]);
  const [simulationGames, setSimulationGames] = useState([]);
  const [strategyGames, setStrategyGames] = useState([]);
  const [adventureGames, setAdventureGames] = useState([]);

  const catTitle = [
    { id: 4, name: "Fighting" },
    { id: 5, name: "Shooter" },
    { id: 8, name: "Platform" },
    { id: 11, name: "Real Time Strategy (RTS)" },
    { id: 12, name: "Role-playing (RPG)" },
    { id: 13, name: "Simulator" },
    { id: 15, name: "Strategy" },
    { id: 32, name: "Indie" },
    { id: 31, name: "Adventure" },
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

  const fetchGameByGenres = async (body) => {
    try {
      const response = await fetch(`http://localhost:8080/games/by-genres`, {
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
    setSimulationGames(
      games.filter((game) => game.genres.includes(categoryName[5]))
    );
    setStrategyGames(
      games.filter((game) => game.genres.includes(categoryName[6]))
    );
    setAdventureGames(
      games.filter((game) => game.genres.includes(categoryName[7]))
    );
  };

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const body = { limit: 100, offset: 0, genres: categoryID };
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
  }, []);  // Vous pouvez ajuster la dépendance ici si nécessaire

  
  const toggleCategory = (category) => {
    setVisibleCategory((prevState) => ({
      ...prevState,
      [category]: !prevState[category],
    }));
  };

  console.log("Catégorie :", fightingGames);

  return (
    <section>
      <h1 style={styles.title}>Catalogue de jeux</h1>

      {loading ? (
        <p style={styles.loadingTxt}>Chargement en cours...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          {/* Fighting */} 
          <GameList title={categoryName[0]} games={fightingGames} />
          <Button variant="contained" style={styles.button}  onClick={() => toggleCategory("fighting")}>
          {visibleCategory.fighting ? "Masquer" : "Afficher"}
          </Button>
          {visibleCategory.fighting && (
            <GameCategory
              style={styles.gameCard}
              categoryTitle={categoryName[0]}
              data={fightingGames}
              podium={false}
            />
          )}

          {/* Shooting */}
          <GameList title={categoryName[1]} games={shooterGames} />
          <Button variant="contained" style={styles.button}  onClick={() => toggleCategory("shooter")}>
          {visibleCategory.shooter ? "Masquer" : "Afficher"}
          </Button>
          {visibleCategory.shooter && (
            <GameCategory
              style={styles.gameCard}
              categoryTitle={categoryName[1]}
              data={shooterGames}
              podium={false}
            />
          )}

          {/* Platform */}
          <GameList title={categoryName[2]} games={platformGames} />
          <Button variant="contained" style={styles.button}  onClick={() => toggleCategory("platform")}>
          {visibleCategory.platform ? "Masquer" : "Afficher"}
          </Button>
          {visibleCategory.platform && (
            <GameCategory
              style={styles.gameCard}
              categoryTitle={categoryName[2]}
              data={platformGames}
              podium={false}
            />
          )}

          {/* RTS */}
          <GameList title={categoryName[3]} games={rtsGames} />
          <Button variant="contained" style={styles.button}  onClick={() => toggleCategory("rts")}>
          {visibleCategory.rts ? "Masquer" : "Afficher"}
          </Button>
          {visibleCategory.rts && (
            <GameCategory
              style={styles.gameCard}
              categoryTitle={categoryName[3]}
              data={rtsGames}
              podium={false}
            />
          )}

          {/* RPG */}
          <GameList title={categoryName[4]} games={rpgGames} />
          <Button variant="contained" style={styles.button}  onClick={() => toggleCategory("rpg")}>
          {visibleCategory.rpg ? "Masquer" : "Afficher"}
          </Button>
          {visibleCategory.rpg && (
            <GameCategory
              style={styles.gameCard}
              categoryTitle={categoryName[4]}
              data={rpgGames}
              podium={false}
            />
          )}
        </>
      )}
      
    </section>
  );
};

const getStyles = (theme) => ({
  title: {
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.text.primary,
    textAlign: "center",
    margin: "2em 0 1em 0",
  },
  loadingTxt: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: "700",
    color: theme.palette.text.primary,
    textAlign: "center",
  },
  button: {
    float: "right",
    margin: "-4em 2em 5em 0",
    backgroundColor: theme.palette.colors.purple,
    fontWeight: "300",
  },
  gameCard: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});
export default CataloguePage;
