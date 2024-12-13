import React, { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const userId = user?.id; // Stocker l'ID de l'utilisateur dans une variable

  return (
    <div>
      <h1>Profil</h1>
      <p>ID de l'utilisateur : {userId}</p>
      <p>Nom d'utilisateur : {user?.username}</p>
      <p>Email : {user?.email}</p>
    </div>
  );
};

export default ProfilePage;
