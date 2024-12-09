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
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      secure: false,
    },
  },
  setupMiddlewares: (middlewares) => {
    // Middleware personnalisé pour simuler une connexion
    middlewares.use('/api/login', (req, res, next) => {
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      if (username === 'testuser' && password === 'password123') {
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTQsInVzZXJuYW1lIjoibmljbzEyIiwiaWF0IjoxNzMzNzUwNjE3fQ.Ef1AlgYkKDhuTSAQEV9ZQ1mbtc1lUSK8EN7GTp3jAuM',
            user: {
              id: 1,
              username: 'testuser',
              email: 'testuser@example.com',
              profile_picture: '/uploads/profile_pictures/profile_picture-1733753112111-210866192.png', // Ajout du chemin de l'image
            },
          })
        );
      } else {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ message: 'Identifiants incorrects.' }));
      }
    });
  } else {
    next();
  }
});

    return middlewares;
  },
},
});
