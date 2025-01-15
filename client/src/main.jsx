import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import {ThemeContextProvider} from './theme/ThemeContext.jsx';
import {AuthProvider} from './components/AuthContext.jsx';
import {CommentsProvider} from './components/CommentsContext.jsx'; // Import du CommentsProvider


createRoot(document.getElementById('root')).render(
    // <StrictMode>
    <AuthProvider>
        <ThemeContextProvider>
            <CommentsProvider> {/* Enveloppez l'application dans CommentsProvider */}
                <App/>
            </CommentsProvider>
        </ThemeContextProvider>
    </AuthProvider>
    // </StrictMode>
);
