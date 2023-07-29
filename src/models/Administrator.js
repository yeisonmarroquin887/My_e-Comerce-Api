const { DataTypes } = require('sequelize');
const sequelize = require('../utils/connection');
const bcrypt = require("bcrypt")

const Administrator = sequelize.define('administrator', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    caompany: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM,
        values: ['user', 'admin'],
        defaultValue: 'user'
    }

  //UserId
});
Administrator.prototype.toJSON = function(){
    const values = Object.assign({}, this.get());
    delete values.password
    return values
};

Administrator.beforeCreate(async(administrator)=>{
    const hashPassword = await bcrypt.hash(administrator.password, 10)
    administrator.password = hashPassword
})

module.exports = Administrator;