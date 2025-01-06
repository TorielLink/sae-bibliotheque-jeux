const multer = require('multer');
const path = require('path');

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log("MULTER: Destination configurée pour l'upload");
        cb(null, 'uploads/profile_pictures');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const filename = 'profile_picture-' + uniqueSuffix + path.extname(file.originalname);
        console.log("MULTER: Nouveau nom de fichier =", filename);
        cb(null, filename);
    },
});

// Filtrage des fichiers
const fileFilter = (req, file, cb) => {
    console.log("MULTER: Vérification du fichier", file.originalname, "type:", file.mimetype);
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        console.log("MULTER: Type de fichier non supporté :", file.mimetype);
        cb(new Error('Type de fichier non supporté. Seules les images JPEG et PNG sont autorisées.'));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = {
    uploadProfilePicture: upload.single('profile_picture'),
};
