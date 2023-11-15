const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');

const Venta = sequelize.define('venta', {
    Producto: {
        type: DataTypes.STRING,
        allowNull: false
    },
    Precio: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    PrecioClick: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
    Cantidad: {
        type: DataTypes.DECIMAL,
        allowNull: false
    }, 
    Fecha: {
        type: DataTypes.DATE,
        allowNull: false
    },
    Categoria: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Venta;