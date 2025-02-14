import React from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import {ThemeContextProvider} from './theme/ThemeContext.jsx';
import {AuthProvider} from './components/AuthContext.jsx';
import {CommentsProvider} from './components/CommentsContext.jsx';


createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <ThemeContextProvider>
            <CommentsProvider>
                <App/>
            </CommentsProvider>
        </ThemeContextProvider>
    </AuthProvider>
);
