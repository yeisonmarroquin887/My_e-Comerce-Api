const { getAll, create, remove } = require('../controllers/productImg.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');
const multer = require("../utils/multer");

const routerProductImg = express.Router();

routerProductImg.route('/')
    .get(verifyJWT, getAll)
    .post(verifyJWT, multer.array('images'), create);

routerProductImg.route('/:id')
    .delete(verifyJWT, remove);

module.exports = routerProductImg;
