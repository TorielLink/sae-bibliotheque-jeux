// middleware/verifyToken.js
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET = process.env.SECRET;

// Middleware pour vérifier le token JWT
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    console.log('Authorization Header:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    console.log('Extracted Token:', token);

    if (!token) {
        console.log('Token is missing.');
        return res.status(403).json({message: 'Accès interdit : Token manquant.'});
    }

    jwt.verify(token, process.env.SECRET, (err, decoded) => {
        if (err) {
            console.log('Token verification error:', err);
            return res.status(401).json({message: 'Accès non autorisé : Token invalide.'});
        }

        console.log('Decoded Token:', decoded);
        req.user = decoded;
        next();
    });
};


module.exports = verifyToken;
