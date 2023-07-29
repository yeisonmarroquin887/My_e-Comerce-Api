const supertest = require("supertest")
const app = require('../app')
const Product = require("../models/Product")
const Cart = require("../models/Cart")
require('../models')

const BASE_URL_LOGIN = '/api/v1/users/login'
const BASE_URL = '/api/v1/purchase'
let TOKEN;
let userId;

beforeAll(async() => {
    const user = {
        email: "andrequin887@gmail.com",
        password: "Futuro"
    }

    const res = await supertest(app)
    .post(BASE_URL_LOGIN)
    .send(user)
    TOKEN = res.body.token
    userId = res.body.user.id
})

test("POST -> 'URL_BASE', should return status code 201 and res.body.quantity === body.quantity", async() => {

    const productBody = {
        title: "Samsung",
        description: "The product is a product international",
        price: "1200.000"
    }

    const product = await Product.create(productBody)

    const cartBody = {
        quantity: 3,
        userId,
        productId:product.id
    }

     await Cart.create(cartBody)

    const res = await supertest(app)
    .post(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`)
 
    expect(res.status).toBe(201)
    expect(res.body[0].quantity).toBe(cartBody.quantity)
}); 