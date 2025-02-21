import React, {useState, useContext} from 'react';
import {AuthContext} from '../components/AuthContext.jsx';
import {useNavigate} from 'react-router-dom';
import LoginBg from "../components/LoginBg";
import LoginBox from "../components/LoginSignup/LoginBox";
import SignupBox from "../components/LoginSignup/SignupBox";
import { useTranslation } from 'react-i18next';
import '../i18n';
const MemoizedLoginBg = React.memo(LoginBg);

function LoginPage() {
    const { t } = useTranslation();
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
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const backendUrl = import.meta.env.VITE_BACKEND_URL;
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
        const response = await fetch(`${backendUrl}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mail: credentials.username,  // Ici, "username" est en fait l'email maintenant
                password: credentials.password
            }),
        });

            if (!response.ok) {
                const errorData = await response.json();
                setLoginError(errorData.message || t("error.loginError"));
                return;
            }

            const data = await response.json();
            login(data.token, data.user);
            navigate('/');
        } catch (error) {
            setLoginError(t("error.networkError"));
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
        formData.append('privacy_setting_id', signupData.privacy_setting_id);
        if (signupData.profilePicture) {
            formData.append('profile_picture', signupData.profilePicture);
        }

        try {
            const response = await fetch(`${backendUrl}/users`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setSignupError(errorData.message || 'Erreur lors de l’inscription.');
                return;
            }

            const result = await response.json();
            alert(t("login.signupSuccess") + ':' + result.message);

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
            setSignupError(t("login.signupError"));
            setLoading(false);
        }
    };

    return (
        <>
            <MemoizedLoginBg />
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
