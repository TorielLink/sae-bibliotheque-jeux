import React, { StrictMode } from 'react'; // Ajoutez StrictMode ici
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { ThemeContextProvider } from './theme/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeContextProvider>
      <App />
    </ThemeContextProvider>
  </StrictMode>
);
