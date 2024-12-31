const {
    users,
    gameReview,
    gameRatings,
    gameLogs,
    gameStatus,
    friends,
    userLists,
} = require('../database/sequelize');
const {Op} = require('sequelize');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;
const controller = {};

// Connexion d'un utilisateur
controller.login = async (req, res) => {
    const {username, password} = req.body;

    try {
        // Vérifiez si l'utilisateur existe et n'est pas supprimé
        const user = await users.findOne({
            where: {
                username,
                isDeleted: false
            }
        });

        if (!user) {
            return res.status(401).json({message: "Nom d'utilisateur ou mot de passe incorrect."});
        }

        if (user.password !== password) { // Note : Pensez à hasher et comparer les mots de passe
            return res.status(401).json({message: "Nom d'utilisateur ou mot de passe incorrect."});
        }

        // Génération du token JWT
        const token = jwt.sign(
            {user_id: user.user_id, username: user.username},
            SECRET,
            //{expiresIn: '1h'} //TODO: Décommentez cette ligne à la fin du projet
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
        res.status(500).json({message: 'Erreur serveur.', error: error.message});
    }
};

// Création d'un utilisateur
controller.create = async (req, res) => {
    try {
        const {username, mail, password, isDeleted, privacy_setting_id} = req.body;

        // Vérification des champs requis
        if (!username || !mail || !password) {
            return res.status(400).json({message: 'Les champs username, mail et password sont requis.'});
        }

        // Vérification de l'existence d'un utilisateur avec le même username ou email
        const existingUser = await users.findOne({
            where: {
                [Op.or]: [{username}, {mail}]
            }
        });

        if (existingUser) {
            return res.status(400).json({
                message: 'Nom d’utilisateur ou adresse e-mail déjà utilisé.',
                data: {username, mail}
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

        res.status(201).json({message: 'Utilisateur créé avec succès', data: newUser});
    } catch (error) {
        console.error('Erreur interne lors de la création de l’utilisateur :', error);
        res.status(500).json({message: 'Erreur interne lors de la création de l’utilisateur', error: error.message});
    }
};

// Mise à jour d'un utilisateur
controller.update = async (req, res) => {
    console.log("UPDATE USER: req.body", req.body);
    console.log("UPDATE USER: req.file", req.file);

    try {
        const {id} = req.params;
        const {username, mail, password, isDeleted, privacy_setting_id} = req.body;

        // Vérification de l'existence de l'utilisateur
        const user = await users.findOne({where: {user_id: id}});
        if (!user) {
            console.log("UPDATE USER: Utilisateur introuvable, id =", id);
            return res.status(404).json({message: "Utilisateur introuvable."});
        }

        // Vérifier si le username ou le mail sont déjà utilisés par un autre utilisateur
        if (username || mail) {
            const conditions = [];
            if (username) conditions.push({username});
            if (mail) conditions.push({mail});

            const existingUser = await users.findOne({
                where: {
                    [Op.or]: conditions
                }
            });

            if (existingUser && existingUser.user_id !== user.user_id) {
                console.log("UPDATE USER: Username ou email déjà utilisé");
                return res.status(400).json({
                    message: 'Nom d’utilisateur ou adresse e-mail déjà utilisé.',
                    data: {username, mail}
                });
            }
        }

        // Gestion de la photo de profil
        let profilePicturePath = user.profile_picture;
        if (req.file) {
            profilePicturePath = `/uploads/profile_pictures/${req.file.filename}`;
            console.log("UPDATE USER: Nouvelle image sauvegardée à:", profilePicturePath);
        }

        // Préparer les données à mettre à jour
        const updateData = {};
        if (username !== undefined) updateData.username = username;
        if (mail !== undefined) updateData.mail = mail;
        if (password !== undefined) updateData.password = password; // Note : Pensez à hasher le mot de passe
        if (profilePicturePath !== undefined) updateData.profile_picture = profilePicturePath;
        if (isDeleted !== undefined) updateData.isDeleted = isDeleted;
        if (privacy_setting_id !== undefined) updateData.privacy_setting_id = privacy_setting_id;

        // Mettre à jour l'utilisateur avec les données fournies
        await user.update(updateData);

        console.log("UPDATE USER: Mise à jour réussie pour l'utilisateur", user.user_id);

        // Mapper les champs avant de renvoyer la réponse
        const updatedUser = {
            id: user.user_id,
            username: user.username,
            email: user.mail,
            profile_picture: user.profile_picture,
            isDeleted: user.isDeleted,
            privacy_setting_id: user.privacy_setting_id,
        };

        res.status(200).json({message: 'Utilisateur mis à jour avec succès', data: updatedUser});
    } catch (error) {
        console.error('UPDATE USER: Erreur lors de la mise à jour de l’utilisateur :', error);
        res.status(500).json({message: 'Erreur lors de la mise à jour de l’utilisateur', error: error.message});
    }
};

// Récupérer un utilisateur par son ID
controller.getById = async (req, res) => {
    try {
        const {id} = req.params;

        // Recherche de l'utilisateur dans la base de données
        const user = await users.findOne({
            attributes: ['user_id', 'username', 'mail', 'profile_picture', 'isDeleted'],
            where: {user_id: id, isDeleted: false},
            include: {
                model: privacySettings,
                as: 'default_privacy',
                attributes: ['name'],
            },
        });

        // Vérification si l'utilisateur existe
        if (!user) {
            return res.status(404).json({message: "Utilisateur introuvable."});
        }

        res.status(200).json({message: 'Utilisateur récupéré avec succès', data: user});
    } catch (error) {
        console.error('Erreur lors de la récupération de l’utilisateur :', error);
        res.status(500).json({message: 'Erreur lors de la récupération de l’utilisateur', error: error.message});
    }
};

// Ajoutez cette méthode dans votre usersController.js
controller.delete = async (req, res) => {
    try {
        const {id} = req.params;

        // Trouver l'utilisateur à supprimer
        const user = await users.findOne({where: {user_id: id}});
        if (!user) {
            return res.status(404).json({message: "Utilisateur introuvable."});
        }

        // ID de l'utilisateur générique
        const userDeleteId = 9999;

        // Vérifier que l'utilisateur générique existe
        const userDelete = await users.findOne({where: {user_id: userDeleteId}});
        if (!userDelete) {
            return res.status(500).json({message: "Utilisateur générique introuvable. Veuillez le créer."});
        }

        // Transférer les données liées en gérant les conflits
        await Promise.all([
            // Transférer les critiques
            gameReview.update(
                {user_id: userDeleteId},
                {where: {user_id: id}}
            ),

            // Transférer les notes
            gameRatings.update(
                {user_id: userDeleteId},
                {where: {user_id: id}}
            ),

            // Transférer les journaux de jeux
            gameLogs.update(
                {user_id: userDeleteId},
                {where: {user_id: id}}
            ),

            // Transférer les statuts de jeux
            gameStatus.update(
                {user_id: userDeleteId},
                {where: {user_id: id}}
            ),

            // Supprimer les relations d'amis
            friends.destroy({
                where: {[Op.or]: [{user_id: id}, {user_id_1: id}]}
            }),

            // Supprimer les listes associées
            userLists.destroy({
                where: {user_id: id}
            }),
        ]);

        // Supprimer définitivement l'utilisateur
        await user.destroy();

        res.status(200).json({message: "Utilisateur supprimé et données réassignées avec succès."});
    } catch (error) {
        console.error('Erreur lors de la suppression de l’utilisateur :', error);
        res.status(500).json({message: 'Erreur lors de la suppression de l’utilisateur.', error: error.message});
    }
};

module.exports = controller;
