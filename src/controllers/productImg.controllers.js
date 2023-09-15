const catchError = require('../utils/catchError');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const ProductImg = require('../models/ProductImg');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'temp/' });

const getAll = catchError(async (req, res) => {
  const img = await ProductImg.findAll();
  return res.json(img);
});

const create = catchError(async (req, res) => {
  const images = req.files.map(file => {
      const url = req.protocol + "://" + req.headers.host + "/uploads/" + file.filename;
      const filename = file.filename;
      return { url, filename };
  });

  const result = await ProductImg.bulkCreate(images);

  // Aquí configuramos el seteo de imágenes para el producto
  const { id } = req.params;
  const product = await Product.findByPk(id);

  if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
  }

  await product.setProductImgs(images);

  return res.status(201).json(result);
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
