const express = require('express');
const router = express.Router();
const gameStatusController = require('../controllers/gameStatusController');

// Récupérer tous les statuts des jeux
router.get('/', gameStatusController.getAll);

// TODO : vérifié le fonctionnement de la fonction Création et suppression
// Ajouter un nouveau statut de jeu
router.post('/', gameStatusController.create);

// Supprimer un statut de jeu spécifique
router.delete('/:user_id/:igdb_game_id', gameStatusController.delete);

module.exports = router;
