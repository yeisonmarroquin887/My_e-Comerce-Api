const supertest  = require("supertest")
const app = require('../app')
const path = require("path")
require('../models')

const BASE_URL_LOGIN = '/api/v1/users/login'
const BASE_URL = '/api/v1/product_images'
let TOKEN;
let productImgId;

beforeAll(async() => {
    const user = {
        email: "andrequin887@gmail.com",
        password: "Futuro"
    }
    const res = await supertest(app)
    .post(BASE_URL_LOGIN)
    .send(user)
    
    TOKEN = res.body.token
})

test("POST -> 'URL_BASE', should return code status 201 and res.body.url === body.url", async() => {
    
    const imagePath = path.join(__dirname,'..','public', 'software.jpg')

    const res = await supertest(app)
        .post(BASE_URL)
        .set("Authorization", `Bearer ${TOKEN}`)
        .attach('image', imagePath)

   
    
    productImgId = res.body.id
    expect(res.status).toBe(201)
    expect(res.body.url).toBeDefined()
    expect(res.body.filename).toBeDefined()
});

test("GET -> 'BASE_URL_PRODUCT_IMG', sholud status code 200 and res.body.length === 1", async()=>{

    const res = await supertest(app)
        .get(BASE_URL)
        .set("Authorization", `Bearer ${TOKEN}`)
        
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)

});

test("DELETE -> 'BASE_URL_PRODUCT_IMG/:productImgId', should return status code 204",async()=>{
   
    const res = await supertest(app)
        .delete(`${BASE_URL}/${productImgId}`)
        .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)
    
})