import React, { useState, useEffect } from 'react';

import LoginBox from "../components/LoginSignup/LoginBox"
import SignupBox from "../components/LoginSignup/SignupBox"

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

  useEffect(() => { //Execution du script background3D.jsx
    // Code à exécuter lorsque le composant est monté
    console.log('Composant chargé');

    // Exemple : Attacher un script ou une logique
    const script = document.createElement('script');
    script.src = "/src/3Dbackgrounds/background3D.jsx";
    script.async = true;
    script.type = "module";
    document.body.appendChild(script);

    // Nettoyage (si nécessaire)
    return () => {
      console.log('Composant démonté');
      document.body.removeChild(script);
    };
  }, []);

  const stateVariables = {
    signupData,
    setSignupData,
    signupError,
    setShowSignup,
    handleSignupChange,
    handleSignupSubmit,
  }

  return (
    <>
      <canvas id="bg" style = {{position: "fixed",top: 0,left:0,}}></canvas>
      {showSignup ? <SignupBox {...stateVariables}/> : <LoginBox {...stateVariables} />}
    </>
  );
  
}

export default LoginPage;
