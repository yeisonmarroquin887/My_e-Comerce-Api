const catchError = require('../utils/catchError');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const ProductImg = require('../models/ProductImg');

const getAll = catchError(async (req, res) => {
  const result = await ProductImg.findAll();
  return res.json(result);
});

const create = catchError(async (req, res) => {
  const images = req.files; // Obtén todas las imágenes enviadas en el formulario
  const uploadedImages = [];

  // Itera sobre las imágenes y súbela a Cloudinary
  for (const image of images) {
    const { path, filename } = image;
    const { url, public_id } = await uploadToCloudinary(path, filename);
    const body = { url, filename: public_id };
    const createdImage = await ProductImg.create(body);
    uploadedImages.push(createdImage);
  }

  return res.status(201).json(uploadedImages);
});

const remove = catchError(async (req, res) => {
  const { id } = req.params;
  const image = await ProductImg.findByPk(id);
  if (!image) return res.sendStatus(404);
  await deleteFromCloudinary(image.filename);
  await image.destroy();
  return res.sendStatus(204);
});

module.exports = {
  getAll,
  create,
  remove
};
