const catchError = require('../utils/catchError');
const Administrator = require('../models/Administrator');
const User = require('../models/User');
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const Purchase = require('../models/Purchase');
const Product = require('../models/Product');
const ProductImg = require('../models/ProductImg');

const getAll = catchError(async(req, res) => {
    const results = await Administrator.findAll({
        include: [{
            model: User,
            include: {
                model: Purchase,
                include: Product
            }
        }]
    });
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const result = await Administrator.create(req.body);
    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Administrator.findByPk(id, {
        include: [{
            model: User,
            include: {
                model: Purchase,
                include: Product
            }
        }]
    });
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await Administrator.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await Administrator.update(
        req.body,
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const login = catchError(async(req, res) => {
    const {email, password} = req.body
    const administrator = await Administrator.findOne({where:{email}})
    if(!administrator) return res.sendStatus(401)

    const isValidPassword  = await bcrypt.compare(password, administrator.password)
    if(!isValidPassword) return res.sendStatus(401)

    const token = jwt.sign(
        {administrator},
        process.env.TOKEN_SECRET,
        {expiresIn:"1d"}
    )

    return res.json({administrator,token})

})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    login
}