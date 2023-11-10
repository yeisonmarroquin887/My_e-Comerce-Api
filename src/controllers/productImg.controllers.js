const catchError = require('../utils/catchError');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const ProductImg = require('../models/ProductImg');
const fs = require('fs');
const path = require('path');

const getAll = catchError(async (req, res) => {
  const img = await ProductImg.findAll();
  return res.json(img);
});

const create = catchError(async (req, res) => {
  const { id } = req.params;

  try {
    // Crear las imágenes en la base de datos y obtener sus IDs
    const images = req.files.map(file => ({
      url: file.path,  // Modifica esto para obtener la URL de Cloudinary
      filename: file.filename
    }));

    const createdImages = await ProductImg.bulkCreate(images);

    return res.status(201).json(createdImages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear las imágenes' });
  }
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const image = await ProductImg.findByPk(id);

  if (!image) {
    return res.sendStatus(404);
  }

  try {
    // Eliminar la imagen de Cloudinary (añadir try/catch si deleteFromCloudinary no maneja errores)
    await deleteFromCloudinary(image.filename);

    // Eliminar archivo local si existe
    const localFilePath = path.join('temp', image.filename);
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // Eliminar la entrada de la base de datos
    await image.destroy();

    return res.sendStatus(204);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar la imagen' });
  }
});

module.exports = {
  getAll,
  create,
  remove
};
