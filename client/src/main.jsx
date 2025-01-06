import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import {ThemeContextProvider} from './theme/ThemeContext.jsx';
import {AuthProvider} from './components/AuthContext.jsx';

// Import du simulateur
import {simulateLogin} from './utils/authSimulator';

// Simuler un utilisateur connecté en mode développement uniquement
if (process.env.NODE_ENV !== 'production') {
    const token = 'votre_token_jwt_valide'; // Remplacez par un token JWT valide
    const user = {
        id: 1,
        username: 'testuser',
        email: 'testuser@example.com',
    };
    simulateLogin(token, user);
}

createRoot(document.getElementById('root')).render(
    //TODO : remettre le Strict Mode
    // <StrictMode>
    <AuthProvider>
        <ThemeContextProvider>
            <App/>
        </ThemeContextProvider>
    </AuthProvider>
    // </StrictMode>
);
