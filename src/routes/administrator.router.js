const { getAll, create, getOne, remove, update, login } = require('../controllers/administrator.controllers');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const routerAdministrator = express.Router();

routerAdministrator.route('/')
    .get(verifyJWT, getAll)
    .post(create);
routerAdministrator.route('/login')
    .post(login)

routerAdministrator.route('/:id')
    .get(verifyJWT,getOne)
    .delete(verifyJWT,remove)
    .put(verifyJWT,update);

module.exports = routerAdministrator;