const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuration de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Bibliothèque de Jeux API',
      version: '1.0.0',
      description: 'Documentation pour l\'API de gestion de jeux',
    },
    servers: [
      {
        url: 'http://localhost:8080', // Remplacez par l'URL de votre API
      },
    ],
  },
  apis: ['./routes/*.js'], // Chemin vers les fichiers avec des commentaires Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
