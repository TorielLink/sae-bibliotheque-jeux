const express = require('express');
const router = express.Router();
const gameRatingsController = require('../controllers/gameRatingsController');

// Récupérer toutes les évaluations
router.get('/', gameRatingsController.getAll);
//TODO : vérifié le fonctionnement de la fonction Création et suppression
router.post('/', gameRatingsController.create);

// Supprimer une évaluation spécifique
router.delete('/:user_id/:igdb_game_id', gameRatingsController.delete);

module.exports = router;
