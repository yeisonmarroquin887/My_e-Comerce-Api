const catchError = require('../utils/catchError');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const ProductImg = require('../models/ProductImg');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');


const getAll = catchError(async (req, res) => {
  const img = await ProductImg.findAll();
  return res.json(img);
});
const create = catchError(async(req, res) => {
  const { id } = req.params;
  const images = req.files.map(file => {
      const url = req.protocol + "://" + req.headers.host + "/uploads/" + file.filename;
      const filename = file.filename;
      return { url, filename };
  });

  // Crear las imágenes en la base de datos y obtener sus IDs
  const createdImages = await ProductImg.bulkCreate(images);
  return res.status(201).json(createdImages)
});



const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const image = await ProductImg.findByPk(id);

  if (!image) return res.sendStatus(404);

  await deleteFromCloudinary(image.filename);

  const localFilePath = path.join('temp', image.filename);
  if (fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }

  await image.destroy();
  return res.sendStatus(204);
});

module.exports = {
  getAll,
  create,
  remove
};
