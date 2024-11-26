// gameGenreRoute.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/indexController');

router.get('/', controller.users.getAll);

module.exports = router;
