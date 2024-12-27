import React, { useContext } from 'react';
import { AuthContext } from '../../components/AuthContext.jsx';

const MyReviewsPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id; // Stocker l'ID de l'utilisateur dans une variable

  return (
    <div>
      <h1>Mes avis</h1>
      <p>ID de l'utilisateur : {userId}</p>
      <p>Bienvenue, {user?.username}</p>
      <ul>
        <li>Avis 1 : "Très bon jeu, je le recommande !"</li>
        <li>Avis 2 : "Pas mal, mais pourrait être amélioré."</li>
      </ul>
    </div>
  );
};

export default MyReviewsPage;
