const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuration de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Bibliothèque de Jeux API',
            version: '1.0.0',
            description: 'Documentation pour l\'API de gestion de jeux, incluant les modèles et associations.',
        },
        servers: [
            {
                url: 'http://localhost:8080', // URL de base de l'API
                description: 'Serveur local'
            },
        ],
        components: {
            schemas: {
                // Modèle User
                User: {
                    type: 'object',
                    description: 'Représente un utilisateur.',
                    properties: {
                        user_id: {
                            type: 'integer',
                            description: 'Identifiant unique de l\'utilisateur',
                            example: 1,
                        },
                        username: {
                            type: 'string',
                            description: 'Nom d\'utilisateur',
                            example: 'johndoe',
                        },
                        email: {
                            type: 'string',
                            description: 'Adresse e-mail',
                            example: 'johndoe@example.com',
                        },
                        privacy_setting_id: {
                            type: 'integer',
                            description: 'ID du paramètre de confidentialité associé',
                            example: 2,
                        },
                    },
                },
                // Modèle PrivacySettings
                PrivacySettings: {
                    type: 'object',
                    description: 'Représente un paramètre de confidentialité.',
                    properties: {
                        privacy_setting_id: {
                            type: 'integer',
                            description: 'Identifiant unique du paramètre de confidentialité',
                            example: 1,
                        },
                        name: {
                            type: 'string',
                            description: 'Nom du paramètre de confidentialité',
                            example: 'Public',
                        },
                    },
                },
                // Modèle GameCollections
                GameCollections: {
                    type: 'object',
                    description: 'Représente une collection de jeux.',
                    properties: {
                        game_collection_id: {
                            type: 'integer',
                            description: 'Identifiant unique de la collection de jeux',
                            example: 42,
                        },
                        name: {
                            type: 'string',
                            description: 'Nom de la collection de jeux',
                            example: 'Mes jeux favoris',
                        },
                        description: {
                            type: 'string',
                            description: 'Description de la collection de jeux',
                            example: 'Une collection de mes jeux préférés.',
                        },
                    },
                },
                // Modèle CollectionContent
                CollectionContent: {
                    type: 'object',
                    description: 'Représente le contenu d\'une collection de jeux.',
                    properties: {
                        game_collection_id: {
                            type: 'integer',
                            description: 'ID de la collection de jeux à laquelle appartient ce contenu',
                            example: 42,
                        },
                        igdb_game_id: {
                            type: 'integer',
                            description: 'ID du jeu associé au contenu',
                            example: 8800,
                        },
                    },
                },
                // Modèle GameLog
                GameLog: {
                    type: 'object',
                    description: 'Représente un journal de jeu.',
                    properties: {
                        game_log_id: {
                            type: 'integer',
                            description: 'ID unique du journal de jeu',
                            example: 500,
                        },
                        user_id: {
                            type: 'integer',
                            description: 'ID de l\'utilisateur associé',
                            example: 1,
                        },
                        platform_id: {
                            type: 'integer',
                            description: 'ID de la plateforme utilisée',
                            example: 3,
                        },
                        privacy_setting_id: {
                            type: 'integer',
                            description: 'ID du paramètre de confidentialité du journal',
                            example: 2,
                        },
                    },
                },
                // Modèle GamePlatform
                GamePlatform: {
                    type: 'object',
                    description: 'Représente une plateforme de jeu.',
                    properties: {
                        platform_id: {
                            type: 'integer',
                            description: 'ID unique de la plateforme',
                            example: 3,
                        },
                        name: {
                            type: 'string',
                            description: 'Nom de la plateforme',
                            example: 'PlayStation 5',
                        },
                    },
                },
                // Modèle GameSession
                GameSession: {
                    type: 'object',
                    description: 'Représente une session de jeu.',
                    properties: {
                        game_session_id: {
                            type: 'integer',
                            description: 'ID unique de la session de jeu',
                            example: 200,
                        },
                        game_log_id: {
                            type: 'integer',
                            description: 'ID du journal de jeu associé',
                            example: 500,
                        },
                        session_date: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Date de la session de jeu',
                            example: '2024-12-05T14:30:00Z',
                        },
                        time_played: {
                            type: 'integer',
                            description: 'Temps de jeu en minutes',
                            example: 120,
                        },
                    },
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Inclure les fichiers de routes pour Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {swaggerUi, swaggerDocs};
