const catchError = require('../utils/catchError');
const { deleteFromCloudinary } = require('../utils/cloudinary');
const ProductImg = require('../models/ProductImg');
const path = require('path');
const fs = require('fs');
const { uploadToCloudinary } = require('../utils/cloudinary');


const getAll = catchError(async (req, res) => {
  const img = await ProductImg.findAll();
  return res.json(img);
});
const create = catchError(async (req, res) => {
  const { files } = req;

  if (!files || files.length !== 3) {
      return res.status(400).json({ message: "Se requieren exactamente 3 imágenes" });
  }

  const imageArray = [];

  for (const file of files) {
      const { path, filename } = file;
      const { url, public_id } = await uploadToCloudinary(path, filename);
      const body = { url, filename: public_id };
      const image = await ProductImg.create(body);
      imageArray.push(image);
  }

  return res.status(201).json(imageArray);
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
