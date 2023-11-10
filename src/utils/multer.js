const multer = require("multer");
const path = require('path');

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        // Cambié el nombre del archivo para evitar posibles conflictos
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
    },
});

// Configuración del objeto de multer
const upload = multer({
    storage: storage,
    // Puedes añadir más configuraciones según tus necesidades
});

module.exports = upload;
