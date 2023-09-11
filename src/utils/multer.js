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

module.exports = (fieldName) => {
    return multer({
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (file.fieldname === fieldName) {
                cb(null, true);
            } else {
                cb(new Error('Unexpected field'));
            }
        },
    });
};
