const { users } = require('../database/sequelize');
const { Op } = require('sequelize');

const controller = {};

// Récupérer tous les utilisateurs
controller.getAll = async (req, res) => {
    try {
        const usersData = await users.findAll({
            attributes: [
                'user_id',
                'username',
                'mail',
                'profile_picture',
                'isDeleted',
                'privacy_setting_id' // Remplacement par le bon champ
            ],
            where: { isDeleted: false }
        });
        res.status(200).json({ message: 'User data fetched successfully', data: usersData });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// Création d'un utilisateur (désactivé temporairement si non nécessaire)
controller.create = async (req, res) => {
    try {
        const { username, mail, password, isDeleted, privacy_setting_id } = req.body;

        // Vérification des champs requis
        if (!username || !mail || !password) {
            return res.status(400).json({ message: 'Champs requis : username, mail et password' });
        }

        // Vérification de l'existence d'un utilisateur avec le même username ou email
        const existingUser = await users.findOne({
            where: {
                [Op.or]: [{ username }, { mail }]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Nom d’utilisateur ou adresse e-mail déjà utilisé.',
                data: { username, mail }
            });
        }

        // Gestion de l'image de profil (optionnel)
        let profilePicturePath = null;
        if (req.file) {
            profilePicturePath = `/uploads/profile_pictures/${req.file.filename}`;
        }

        // Création de l'utilisateur
        const newUser = await users.create({
            username,
            mail,
            password,
            profile_picture: profilePicturePath,
            isDeleted: isDeleted || false,
            privacy_setting_id: privacy_setting_id || 1 // Attention à utiliser privacy_setting_id
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès', data: newUser });
    } catch (error) {
        console.error('Erreur interne lors de la création de l’utilisateur :', error);
        res.status(500).json({ message: 'Erreur interne lors de la création de l’utilisateur', error: error.message });
    }
};

module.exports = controller;
