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
        url: 'http://localhost:8080', // URL de base de l'API
      },
    ],
    components: {
      schemas: {
        // Modèle User
        User: {
          type: 'object',
          description: 'Représente un utilisateur. Chaque utilisateur est associé à un paramètre de confidentialité.',
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
            mail: {
              type: 'string',
              description: 'Adresse e-mail',
              example: 'johndoe@example.com',
            },
            privacy_setting: {
              $ref: '#/components/schemas/PrivacySettings',
              description: 'Paramètre de confidentialité associé à l\'utilisateur',
            },
            game_lists: {
              type: 'array',
              description: 'Listes de jeux associées à cet utilisateur.',
              items: {
                $ref: '#/components/schemas/GameList',
              },
            },
          },
        },
        // Modèle PrivacySettings
        PrivacySettings: {
          type: 'object',
          description: 'Paramètre de confidentialité utilisé par plusieurs utilisateurs ou objets.',
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
        // Modèle GameList
        GameList: {
          type: 'object',
          description: 'Liste de jeux créée par un utilisateur ou partagée avec d\'autres utilisateurs.',
          properties: {
            game_list_id: {
              type: 'integer',
              description: 'Identifiant unique de la liste de jeux',
              example: 42,
            },
            name: {
              type: 'string',
              description: 'Nom de la liste de jeux',
              example: 'Mes jeux favoris',
            },
            description: {
              type: 'string',
              description: 'Description de la liste de jeux',
              example: 'Une collection de mes jeux préférés.',
            },
            contents: {
              type: 'array',
              description: 'Contenus de la liste (relation One-to-Many avec `ListContent`).',
              items: {
                $ref: '#/components/schemas/ListContent',
              },
            },
            users: {
              type: 'array',
              description: 'Utilisateurs associés à cette liste (relation Many-to-Many via `user_lists`).',
              items: {
                $ref: '#/components/schemas/User',
              },
            },
          },
        },
        // Modèle ListContent
        ListContent: {
          type: 'object',
          description: 'Contenu d\'une liste de jeux, associé à un jeu spécifique.',
          properties: {
            list_content_id: {
              type: 'integer',
              description: 'Identifiant unique du contenu de liste',
              example: 101,
            },
            game_list_id: {
              type: 'integer',
              description: 'ID de la liste de jeux à laquelle appartient ce contenu',
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
          description: 'Journal de jeu enregistré par un utilisateur.',
          properties: {
            game_log_id: {
              type: 'integer',
              description: 'ID unique du journal de jeu',
              example: 500,
            },
            user: {
              $ref: '#/components/schemas/User',
              description: 'Utilisateur associé au journal.',
            },
            platform: {
              $ref: '#/components/schemas/GamePlatform',
              description: 'Plateforme utilisée pour ce journal.',
            },
            privacy_setting: {
              $ref: '#/components/schemas/PrivacySettings',
              description: 'Paramètre de confidentialité du journal.',
            },
          },
        },
        // Modèle GamePlatform
        GamePlatform: {
          type: 'object',
          description: 'Plateforme de jeu, comme PC, PlayStation, ou Xbox.',
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
          description: 'Session de jeu enregistrée par un utilisateur.',
          properties: {
            game_session_id: {
              type: 'integer',
              description: 'ID unique de la session de jeu',
              example: 200,
            },
            session_date: {
              type: 'string',
              format: 'date-time',
              description: 'Date de la session de jeu',
              example: '2024-12-05T14:30:00Z',
            },
            title: {
              type: 'string',
              description: 'Titre de la session',
              example: 'Soirée de jeu avec des amis',
            },
            content: {
              type: 'string',
              description: 'Description ou notes sur la session de jeu',
              example: 'Nous avons terminé le dernier niveau.',
            },
            time_played: {
              type: 'integer',
              description: 'Temps de jeu en minutes',
              example: 120,
            },
            game_log_id: {
              type: 'integer',
              description: 'ID du journal de jeu associé.',
              example: 500,
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'], // Inclure tous les fichiers de routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
