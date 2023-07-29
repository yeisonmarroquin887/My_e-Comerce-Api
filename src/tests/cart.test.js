const supertest = require("supertest")
const app = require("../app");
const Product = require("../models/Product");
require("../models")

const BASE_URL_LOGIN = "/api/v1/users/login"
const BASE_URL = '/api/v1/cart'
let TOKEN;
let userId;
let cartId;
let product;

beforeAll(async()=>{
    const user = {
        email: "andrequin887@gmail.com",
        password: "Futuro"
    }

    const res = await  supertest(app)
    .post(BASE_URL_LOGIN)
    .send(user)

    TOKEN = res.body.token
    userId = res.body.user.id
});

test("POS -> 'URL_BASE', should return status code 201 and res.body.quantity === body.quantity", async() => {
   
    const productBody = {
        title: "Samsung",
        description: "The product is a product international",
        price: "1200.000"
    }
    product = await Product.create(productBody)

    const cart = {
        quantity: 3,
        userId,
        productId:product.id
    }


    const res = await supertest(app)
    .post(BASE_URL)
    .send(cart)
    .set("Authorization", `Bearer ${TOKEN}`)
    cartId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body.quantity).toBe(cart.quantity)
});

test("GET -> 'URL_BASE', should return status code 200", async() => {
    const res = await supertest(app)
    .get(BASE_URL)
    .set("Authorization", `Bearer ${TOKEN}`)
    

    expect(res.status).toBe(200)
});

test("PUT -> 'URL_BASE', should return status code 200 and res.body.quantity === body.quantity", async() => {
    const cart = {
        quantity: 3
    }

    const res = await supertest(app)
    .put(`${BASE_URL}/${cartId}`)
    .send(cart)
    .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body.quantity).toBe(cart.quantity)
});

test("DELETE -> 'URL_BASE/:id',should return status code 204", async()=>{
 
    const res = await supertest(app)
        .delete(`${BASE_URL}/${cartId}`)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)
    await product.destroy()
})