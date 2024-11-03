import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx'], // Ajoute explicitement les extensions .js et .jsx
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.(js|jsx)$/, // Applique le chargeur JSX aux fichiers .js et .jsx
  },
  server: {
    port: 5173, // Port pour le frontend (Vite)
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // Assurez-vous que le port est le même que celui de votre backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
