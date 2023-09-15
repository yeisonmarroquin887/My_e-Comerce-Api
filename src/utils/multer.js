const multer = require("multer");
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

// Exporta una instancia de Multer configurada
module.exports = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Aquí puedes agregar tu lógica de filtrado de archivos si es necesario
        cb(null, true);
    },
});
