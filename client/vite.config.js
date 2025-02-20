// vite.config.js
import {defineConfig} from 'vite';
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
            // Capture toutes les requêtes API
            '/api': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
            '/users': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
            '/auth': {
                target: 'http://localhost:8080',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
