import React, { useState } from 'react';

function LoginPage() {
  const [showSignup, setShowSignup] = useState(false); // Gérer l'affichage du formulaire d'inscription
  const [signupData, setSignupData] = useState({
    username: '',
    mail: '',
    password: '',
    profilePicture: null,
    privacy_setting_id: 1,
  });
  const [signupError, setSignupError] = useState(''); // Stocker les erreurs d'inscription

  // Gérer le changement des champs d'inscription
  const handleSignupChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setSignupData({ ...signupData, profilePicture: files[0] });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
    setSignupError(''); // Réinitialiser les erreurs lorsque l'utilisateur modifie le formulaire
  };

  // Soumettre les données d'inscription
  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', signupData.username);
    formData.append('mail', signupData.mail);
    formData.append('password', signupData.password);
    formData.append('privacy_settings', signupData.privacy_setting_id);
    if (signupData.profilePicture) {
      formData.append('profile_picture', signupData.profilePicture);
    }

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400) {
          // Afficher le message d'erreur spécifique du serveur
          setSignupError(errorData.message);
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return;
      }

      const result = await response.json();
      alert('Inscription réussie : ' + result.message);

      // Réinitialiser le formulaire après une inscription réussie
      setSignupData({
        username: '',
        mail: '',
        password: '',
        profilePicture: null,
      });
      setShowSignup(false); // Revenir à l'écran de connexion
    } catch (error) {
      console.error('Erreur lors de l’inscription :', error);
      setSignupError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div>
      <h1>Connexion</h1>
      <form>
        <label>
          Nom d'utilisateur:
          <input type="text" name="username" />
        </label>
        <br />
        <label>
          Mot de passe:
          <input type="password" name="password" />
        </label>
        <br />
        <button type="submit">Se connecter</button>
      </form>

      <hr />

      {/* Bouton pour basculer vers le formulaire d'inscription */}
      <button onClick={() => setShowSignup(!showSignup)}>
        {showSignup ? 'Annuler' : "S'inscrire"}
      </button>

      {showSignup && (
        <div>
          <h2>Inscription</h2>
          <form onSubmit={handleSignupSubmit}>
            <label>
              Nom d'utilisateur:
              <input
                type="text"
                name="username"
                value={signupData.username}
                onChange={handleSignupChange}
                required
              />
            </label>
            <br />
            <label>
              Adresse e-mail:
              <input
                type="email"
                name="mail"
                value={signupData.mail}
                onChange={handleSignupChange}
                required
              />
            </label>
            <br />
            <label>
              Mot de passe:
              <input
                type="password"
                name="password"
                value={signupData.password}
                onChange={handleSignupChange}
                required
              />
            </label>
            <br />
            <label>
              Photo de profil:
              <input
                type="file"
                name="profilePicture"
                accept="image/*"
                onChange={handleSignupChange}
              />
            </label>
            <br />
            {/* Affichage des erreurs */}
            {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
            <button type="submit">S'inscrire</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
