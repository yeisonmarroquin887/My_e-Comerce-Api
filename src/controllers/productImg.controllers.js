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

const create = catchError(upload.array('nombreDelCampo'), async (req, res) => {
  const images = req.files;
  const uploadedImages = [];
  const { productId } = req.params;
  const product = await Product.findByPk(productId);

  if (!product) {
    return res.status(404).json({ message: 'Producto no encontrado' });
  }

  for (const imageFile of images) {
    const { path, filename } = imageFile;

    // Verificar si el archivo existe en la ruta especificada
    if (fs.existsSync(path)) {
      const { url, public_id } = await uploadToCloudinary(path, filename);
      const body = { url, filename: public_id };

      const image = await ProductImg.create(body);
      await image.setProduct(product);
      uploadedImages.push(image);
    } else {
      console.error(`Archivo no encontrado en la ruta: ${path}`);
      // Puedes enviar una respuesta de error adecuada aquí si lo deseas
    }
  }

  return res.status(201).json(uploadedImages);
});


const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const image = await ProductImg.findByPk(id);

  if (!image) return res.sendStatus(404);

  // Eliminar de Cloudinary
  await deleteFromCloudinary(image.filename);

  // Eliminar el archivo local (si es necesario)
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
