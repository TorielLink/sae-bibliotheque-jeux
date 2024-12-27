import React, { useContext } from 'react';
import { AuthContext } from '../../components/AuthContext.jsx';

const MyListsPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id; // Stocker l'ID de l'utilisateur dans une variable

  return (
    <div>
      <h1>Mes listes</h1>
      <p>ID de l'utilisateur : {userId}</p>
      <p>Bienvenue, {user?.username}</p>
      <ul>
        <li>Liste 1 : "Jeux préférés"</li>
        <li>Liste 2 : "À jouer plus tard"</li>
        <li>Liste 3 : "Fini en 2024"</li>
      </ul>
    </div>
  );
};

export default MyListsPage;
