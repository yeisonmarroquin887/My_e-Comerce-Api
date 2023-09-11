const catchError = require('../utils/catchError');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const ProductImg = require('../models/ProductImg');
const Product = require('../models/Product');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

const getAll = catchError(async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findByPk(productId, {
        include: ProductImg,
    });

    if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.json(product.ProductImgs);
});

const create = catchError(async (req, res) => {
    const images = req.files;
    const uploadedImages = [];
    
    const { productId } = req.params;

    const product = await Product.findByPk(productId);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    for (const imageFile of images) {
      const { path, filename } = imageFile;
      const { url, public_id } = await uploadToCloudinary(path, filename);
      const body = { url, filename: public_id };
      
      const image = await ProductImg.create(body);
      await image.setProduct(product);
      uploadedImages.push(image);
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
