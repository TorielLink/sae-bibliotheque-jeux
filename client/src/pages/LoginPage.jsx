import React, { useState, useContext } from 'react';
import { AuthContext } from '../components/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

import LoginBg from "../components/LoginBg";
import LoginBox from "../components/LoginSignup/LoginBox";
import SignupBox from "../components/LoginSignup/SignupBox";

const MemoizedLoginBg = React.memo(LoginBg); // Optimisation du rendu du fond

function LoginPage() {
    const [showSignup, setShowSignup] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' }); // Champs de connexion
    const [signupData, setSignupData] = useState({
        username: '',
        mail: '',
        password: '',
        profilePicture: null,
        privacy_setting_id: 1,
    });

    const [loginError, setLoginError] = useState('');
    const [signupError, setSignupError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080"; // 🔥 Vérifie que l'URL est bien définie
    console.log("🔗 URL du backend :", backendUrl);

    // Gestion des changements dans les champs de connexion
    const handleLoginChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prevState => ({ ...prevState, [name]: value }));
        setLoginError('');
    };

    // Soumission du formulaire de connexion
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setLoginError('');
        setLoading(true);

        try {
            console.log("🛂 Tentative de connexion avec :", credentials);

            const response = await fetch(`${backendUrl}/users/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            if (!response.ok) {
                const errorData = await response.json();
                setLoginError(errorData.message || 'Erreur de connexion.');
                console.error('❌ Erreur de connexion :', errorData);
                return;
            }

            const data = await response.json();
            console.log('✅ Connexion réussie :', data);
            login(data.token, data.user);
            navigate('/'); // Redirection après connexion
        } catch (error) {
            console.error('❌ Erreur lors de la connexion :', error);
            setLoginError('Erreur réseau. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    // Gestion des changements dans les champs d'inscription
    const handleSignupChange = (e) => {
        const { name, value, files } = e.target;
        setSignupData(prevState => ({
            ...prevState,
            [name]: name === 'profilePicture' ? files?.[0] || null : value,
        }));
        setSignupError('');
    };

    // Soumission du formulaire d'inscription
    const handleSignupSubmit = async (e) => {
        e.preventDefault();
        setSignupError('');
        setLoading(true);

        const formData = new FormData();
        formData.append('username', signupData.username);
        formData.append('mail', signupData.mail);
        formData.append('password', signupData.password);
        formData.append('privacy_setting_id', signupData.privacy_setting_id); // 🔥 Correction du nom
        if (signupData.profilePicture) {
            formData.append('profile_picture', signupData.profilePicture);
        }

        try {
            console.log("📤 Tentative d'inscription avec :", signupData);

            const response = await fetch(`${backendUrl}/users`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setSignupError(errorData.message || 'Erreur lors de l’inscription.');
                console.error('❌ Erreur d’inscription :', errorData);
                return;
            }

            const result = await response.json();
            console.log('✅ Inscription réussie :', result);
            alert('Inscription réussie : ' + result.message);

            // Réinitialiser le formulaire après inscription
            setSignupData({
                username: '',
                mail: '',
                password: '',
                profilePicture: null,
                privacy_setting_id: 1,
            });
            setShowSignup(false);
        } catch (error) {
            console.error('❌ Erreur lors de l’inscription :', error);
            setSignupError('Une erreur réseau est survenue. Vérifiez votre connexion.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MemoizedLoginBg /> {/* Empêche le rechargement inutile du fond */}
            <div>
                {showSignup
                    ? <SignupBox
                        signupData={signupData}
                        setSignupData={setSignupData}
                        signupError={signupError}
                        setShowSignup={setShowSignup}
                        handleSignupChange={handleSignupChange}
                        handleSignupSubmit={handleSignupSubmit}
                        loading={loading}
                    />
                    : <LoginBox
                        credentials={credentials}
                        setCredentials={setCredentials}
                        loginError={loginError}
                        setShowSignup={setShowSignup}
                        handleLoginChange={handleLoginChange}
                        handleLoginSubmit={handleLoginSubmit}
                        loading={loading}
                    />
                }
            </div>
        </>
    );
}

export default LoginPage;
