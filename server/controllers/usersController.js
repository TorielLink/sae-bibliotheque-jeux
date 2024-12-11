const { users, privacySettings } = require('../database/sequelize');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;
const controller = {};

// Récupérer tous les utilisateurs
controller.getAll = async (req, res) => {
    try {
        const usersData = await users.findAll({
            attributes: ['user_id', 'username', 'mail', 'profile_picture', 'isDeleted'],
            where: { isDeleted: false },
            include: {
                model: privacySettings,
                as: 'default_privacy',
                attributes: ['name'],
            },
        });
        res.status(200).json({ message: 'Données des utilisateurs récupérées avec succès', data: usersData });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs', error: error.message });
    }
};

controller.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Vérifiez si l'utilisateur existe
        const user = await users.findOne({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Nom d'utilisateur ou mot de passe incorrect." });
        }

        // Génération du token JWT
        const token = jwt.sign(
            { id: user.user_id, username: user.username },
            SECRET,
        );

        res.status(200).json({
            token,
            user: {
                id: user.user_id,
                username: user.username,
                email: user.mail,
                profile_picture: user.profile_picture,
            }
        });

    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ message: 'Erreur serveur.', error: error.message });
    }
};


// Création d'un utilisateur
controller.create = async (req, res) => {
    try {
        const { username, mail, password, isDeleted, privacy_setting_id } = req.body;

        // Vérification des champs requis
        if (!username || !mail || !password) {
            return res.status(400).json({ message: 'Les champs username, mail et password sont requis.' });
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

        // Vérification du fichier image (si présent)
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
            privacy_setting_id: privacy_setting_id || 1
        });

        res.status(201).json({ message: 'Utilisateur créé avec succès', data: newUser });
    } catch (error) {
        console.error('Erreur interne lors de la création de l’utilisateur :', error);
        res.status(500).json({ message: 'Erreur interne lors de la création de l’utilisateur', error: error.message });
    }
};

// Récupérer un utilisateur par son ID
controller.getById = async (req, res) => {
    try {
        const { id } = req.params;

        // Recherche de l'utilisateur dans la base de données
        const user = await users.findOne({
            attributes: ['user_id', 'username', 'mail', 'profile_picture', 'isDeleted'],
            where: { user_id: id, isDeleted: false },
            include: {
                model: privacySettings,
                as: 'default_privacy',
                attributes: ['name'],
            },
        });

        // Vérification si l'utilisateur existe
        if (!user) {
            return res.status(404).json({ message: "Utilisateur introuvable." });
        }

        res.status(200).json({ message: 'Utilisateur récupéré avec succès', data: user });
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération de l’utilisateur', error: error.message });
    }
};


module.exports = controller;
