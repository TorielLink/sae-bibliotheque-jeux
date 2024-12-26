import React, { useContext } from 'react';
import { AuthContext } from '../../components/AuthContext.jsx';

const SettingsPage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id; // Stocker l'ID de l'utilisateur dans une variable

  return (
    <div>
      <h1>Paramètres</h1>
      <p>ID de l'utilisateur : {userId}</p>
      <p>Modifier les informations pour {user?.username}</p>
      <button>Modifier l'email</button>
      <button>Modifier le mot de passe</button>
    </div>
  );
};

export default SettingsPage;
