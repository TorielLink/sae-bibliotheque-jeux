import React, { useContext } from 'react';
import { AuthContext } from '../../components/AuthContext.jsx';

const MyCollectionPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id; // Stocker l'ID de l'utilisateur dans une variable

  return (
    <div>
      <h1>Listes personnalisées</h1>
      <p>ID de l'utilisateur : {userId}</p>
      <p>Bienvenue, {user?.username}</p>
      <ul>
        <li>Liste personnalisée 1 : "Jeux multijoueur"</li>
        <li>Liste personnalisée 2 : "Jeux indépendants"</li>
      </ul>
    </div>
  );
};

export default MyCollectionPage;
