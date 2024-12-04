import React from 'react';
import { useParams } from 'react-router-dom';

const GameDetailsPage = () => {
  const { id } = useParams(); // Récupère directement l'ID du jeu depuis l'URL

  return (
    <div>
      <h1>Détails du jeu</h1>
      <p>ID du jeu : {id}</p>
      {/* Ajoutez d'autres informations ici */}
    </div>
  );
};

export default GameDetailsPage;
