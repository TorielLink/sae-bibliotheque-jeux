const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;
// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']; // Récupérer le token dans les en-têtes
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
