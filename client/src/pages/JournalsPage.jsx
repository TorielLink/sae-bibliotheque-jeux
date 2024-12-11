import React, { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

const JournalsPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id; // Stocker l'ID de l'utilisateur dans une variable

  return (
    <div>
      <h1>Mes journaux</h1>
      <p>ID de l'utilisateur : {userId}</p>
      <p>Journaux pour {user?.username}</p>
      <ul>
        <li>Journal 1 : "Mes aventures dans Elden Ring"</li>
        <li>Journal 2 : "Mon expérience avec Zelda"</li>
      </ul>
    </div>
  );
};

export default JournalsPage;
