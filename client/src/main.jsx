import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import {ThemeContextProvider} from './theme/ThemeContext.jsx';
import {AuthProvider} from './components/AuthContext.jsx';
import {simulateLogin} from './utils/authSimulator';

// Simuler un utilisateur connecté en mode développement uniquement
if (process.env.NODE_ENV !== 'production') {
    simulateLogin();
}

createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <AuthProvider>
        <ThemeContextProvider>
            <App/>
        </ThemeContextProvider>
    </AuthProvider>
    // </StrictMode>
);
