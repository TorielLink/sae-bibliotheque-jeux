// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraction du token

  if (!token) {
    return res.status(403).json({ message: 'Accès interdit : Token manquant.' });
  }

  // Vérifier et décoder le token
  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Accès non autorisé : Token invalide.' });
    }

    req.user = decoded; // Ajouter les informations du token à la requête
    next(); // Passer au prochain middleware ou à la route
  });
};

module.exports = verifyToken;
