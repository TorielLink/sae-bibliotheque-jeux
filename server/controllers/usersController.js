const { users } = require('../database/sequelize'); // Modèle Sequelize pour les utilisateurs
const { Op } = require('sequelize'); // Import Sequelize Opérateurs

const controller = {};

// Récupérer tous les utilisateurs
controller.getAll = async (req, res) => {
    try {
        const usersData = await users.findAll({
            where: { isDeleted: false }, // Filtre pour exclure les utilisateurs supprimés
        });
        res.status(200).json({ message: 'User data fetched successfully', data: usersData });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

controller.create = async (req, res) => {
    console.log('Requête reçue pour créer un utilisateur :', req.body);
    if (req.file) {
        console.log('Fichier téléchargé :', req.file);
    }

    try {
        const { username, mail, password, isDeleted, deleted_at } = req.body;

        // Vérification des champs requis
        if (!username || !mail || !password) {
            console.log('Champs requis manquants');
            return res.status(400).json({ message: 'Champs requis : username, mail et password' });
        }

        // Vérification de l'existence d'un utilisateur avec le même username ou email
        const existingUser = await users.findOne({
            where: {
                [Op.or]: [{ username }, { mail }],
            },
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Nom d’utilisateur ou adresse e-mail déjà utilisé.',
                data: { username, mail }
            });
        }

        // Gestion de l'image de profil
        let profilePicturePath = null;
        if (req.file) {
            profilePicturePath = `/uploads/profile_pictures/${req.file.filename}`;
        }

        console.log('Données à insérer :', {
            username,
            mail,
            password,
            profile_picture: profilePicturePath,
            isDeleted: isDeleted || false,
            deleted_at: deleted_at || null,
        });

        // Création de l'utilisateur
        const newUser = await users.create({
            username,
            mail,
            password,
            profile_picture: profilePicturePath,
            isDeleted: isDeleted || false,
            deleted_at: deleted_at || null,
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès', data: newUser });
    } catch (error) {
        console.error('Erreur interne lors de la création de l’utilisateur :', error);
        res.status(500).json({ message: 'Erreur interne lors de la création de l’utilisateur', error: error.message });
    }
};



module.exports = controller;
