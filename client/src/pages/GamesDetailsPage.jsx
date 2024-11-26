import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

const GameDetailsPage = () => {
  const { gameName } = useParams(); // Récupère le nom du jeu depuis l'URL
  const location = useLocation();
  const { id } = location.state || {}; // Récupère l'ID du jeu depuis `state`

  return (
    <div>
      <h1>Détails du jeu : {gameName}</h1>
      <p>ID du jeu : {id}</p>
      {/* Vous pouvez ajouter d'autres informations ici */}
    </div>
  );
};

export default GameDetailsPage;
