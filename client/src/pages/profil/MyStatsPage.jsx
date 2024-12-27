import React, { useContext } from 'react';
import { AuthContext } from '../../components/AuthContext.jsx';

const MyStatsPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id; // Stocker l'ID de l'utilisateur dans une variable

  return (
    <div>
      <h1>Mes statistiques</h1>
      <p>ID de l'utilisateur : {userId}</p>
      <p>Utilisateur : {user?.username}</p>
      <ul>
        <li>Jeux ajoutés : 12</li>
        <li>Commentaires postés : 5</li>
        <li>Temps total joué : 300 heures</li>
      </ul>
    </div>
  );
};

export default MyStatsPage;
