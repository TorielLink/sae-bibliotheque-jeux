// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.(js|jsx)$/,
  },
  server: {
    port: 5173,
    proxy: {
      '/users': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
    },
    // Supprimer ou commenter toute section setupMiddlewares
    /*
    setupMiddlewares: (middlewares) => {
      // Middleware personnalisé à supprimer ou commenter
      return middlewares;
    },
    */
  },
});
