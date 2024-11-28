const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/profile_pictures'); // Dossier de destination
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile_picture-' + uniqueSuffix + path.extname(file.originalname));
    },
});

// Filtrage des fichiers
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Type de fichier non supporté. Seules les images JPEG et PNG sont autorisées.'));
    }
};

// Middleware Multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
});

module.exports = {
    uploadProfilePicture: upload.single('profile_picture'),
};
