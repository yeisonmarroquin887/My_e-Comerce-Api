const User = require("../../models/User")

const user = async()=>{
   
    const userCreate = {
        firstName: "Yeison Andres",
        lastName: "Marroquin Bernal",
        email: "andrequin887@gmail.com",
        password: "Futuro",
        phone: "3227222010"
    }
    await User.create(userCreate)
}
module.exports = user