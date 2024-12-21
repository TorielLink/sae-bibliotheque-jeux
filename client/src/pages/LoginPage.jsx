import React, { useState, useContext } from 'react';
import { AuthContext } from '../components/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [showSignup, setShowSignup] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [signupData, setSignupData] = useState({
    username: '',
    mail: '',
    password: '',
    profilePicture: null,
    privacy_setting_id: 1,
  });

  const [loginError, setLoginError] = useState('');
  const [signupError, setSignupError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Gérer les modifications des champs de connexion
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
    setLoginError('');
  };

const handleLoginSubmit = async (e) => {
  e.preventDefault();
  setLoginError('');

  try {
    const response = await fetch('http://localhost:8080/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setLoginError(errorData.message || 'Erreur de connexion.');
      console.log('Erreur de connexion :', errorData);
      return;
    }

    const data = await response.json();
    console.log('Connexion réussie :', data);
    login(data.token, data.user);
    navigate('/');
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    setLoginError('Erreur réseau. Veuillez réessayer.');
  }
};


  // Gérer les modifications des champs d'inscription
  const handleSignupChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setSignupData({ ...signupData, profilePicture: files[0] });
    } else {
      setSignupData({ ...signupData, [name]: value });
    }
    setSignupError('');
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
        privacy_setting_id: 1,
      });
      setShowSignup(false);
    } catch (error) {
      console.error('Erreur lors de l’inscription :', error);
      setSignupError('Une erreur est survenue. Veuillez réessayer.');
    }
  };

  return (
    <div>
      {!showSignup ? (
        <>
          <h1>Connexion</h1>
          <form onSubmit={handleLoginSubmit}>
            <label>
              Nom d'utilisateur :
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleLoginChange}
                required
              />
            </label>
            <br />
            <label>
              Mot de passe :
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleLoginChange}
                required
              />
            </label>
            <br />
            <button type="submit">Se connecter</button>
          </form>
          {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          <hr />
          <button onClick={() => setShowSignup(true)}>S'inscrire</button>
        </>
      ) : (
        <>
          <h2>Inscription</h2>
          <form onSubmit={handleSignupSubmit}>
            <label>
              Nom d'utilisateur :
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
              Adresse e-mail :
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
              Mot de passe :
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
              Photo de profil :
              <input
                type="file"
                name="profilePicture"
                accept="mentorOrInvestorImage/*"
                onChange={handleSignupChange}
              />
            </label>
            <br />
            <button type="submit">S'inscrire</button>
          </form>
          {signupError && <p style={{ color: 'red' }}>{signupError}</p>}
          <hr />
          <button onClick={() => setShowSignup(false)}>Retour à la connexion</button>
        </>
      )}
    </div>
  );
}

export default LoginPage;
