const { getAll, create, remove, update, getOne } = require('../controllers/venta.controllers');
const express = require('express');

const routerVenta = express.Router();

routerVenta.route('/')
    .get(getAll)
    .post(create);

routerVenta.route('/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = routerVenta;