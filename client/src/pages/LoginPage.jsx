import React, {useState, useContext, useEffect} from 'react';
import {AuthContext} from '../components/AuthContext.jsx';
import {useNavigate} from 'react-router-dom';

import LoginBg from "../components/LoginBg"

import LoginBox from "../components/LoginSignup/LoginBox"
import SignupBox from "../components/LoginSignup/SignupBox"

function LoginPage() {

    const [showSignup, setShowSignup] = useState(false);
    const [credentials, setCredentials] = useState({username: '', password: ''}); // Champs de connexion
    const [signupData, setSignupData] = useState({
        username: '',
        mail: '',
        password: '',
        profilePicture: null,
        privacy_setting_id: 1,
    });

    // Gérer les modifications des champs d'inscription

    const [loginError, setLoginError] = useState(''); // Erreurs de connexion
    const [signupError, setSignupError] = useState(''); // Erreurs d'inscription
    const {login} = useContext(AuthContext); // Utiliser la fonction login depuis le contexte
    const navigate = useNavigate();

    // Gérer les modifications des champs de connexion
    const handleLoginChange = (e) => {
        const {name, value} = e.target;
        setCredentials({...credentials, [name]: value});
        setLoginError(''); // Réinitialiser les erreurs
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/login`, {
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
            console.log("mon token", data.token)
            navigate('/'); // Redirection après connexion
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            setLoginError('Erreur réseau. Veuillez réessayer.');
        }
    };

    // Gérer les modifications des champs d'inscription
    const handleSignupChange = (e) => {
        const {name, value, files} = e.target;
        if (name === 'profilePicture') {
            setSignupData({...signupData, profilePicture: files[0]});
        } else {
            setSignupData({...signupData, [name]: value});
        }
        setSignupError(''); // Réinitialiser les erreurs
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users`, {
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

    const stateVariables = {
        signupData,
        setSignupData,
        signupError,
        setShowSignup,
        handleSignupChange,
        handleSignupSubmit,
        handleLoginChange,
        handleLoginSubmit,
        credentials
    }

    return (
        <>
            <LoginBg/>
            <div>
                {showSignup ? <SignupBox {...stateVariables}/> : <LoginBox {...stateVariables} />}
            </div>
        </>
    );

}

export default LoginPage;
