const express = require("express");
const router = express.Router();
const controller = require("../controllers/indexController");


router.get("/", controller.gameGenre.getAll);


module.exports = router;