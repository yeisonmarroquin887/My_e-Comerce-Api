const Venta = require("../models/Venta");
const catchError = require("../utils/catchError");

const getAll = catchError(async(req, res) => {
    const result = await Venta.findAll()
    return res.json(result)
});

const create = catchError(async(req, res) => {
    const body = req.body
    const result = await Venta.create(body)
    return res.status(201).json(result)
});

const getOne = catchError(async(req, res) => {
    const {id} = req.params;
    const result = await Venta.findByPk(id)
    if(!result) return res.sendStatus(404)
    return res.json(result)
});

const remove = catchError(async(req, res) => {
    const {id} = req.params
    await Venta.destroy({where: {id}})
    return res.status(204)
});

const update = catchError(async(req, res) => {
    const {id} = req.params
    const body = req.body
    const result = await Venta.update(body, {where:{id}, returning: true})
    if(result[0] == 0) return res.sendStatus(404)
    return res.json(result[1][0])
})



module.exports = {
    getAll,
    create,
    getOne,
    update,
    remove
}