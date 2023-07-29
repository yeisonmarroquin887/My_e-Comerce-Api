const supertest = require("supertest")
const app = require('../app')

const BASE_URL = "/api/v1/categoris"
const BASE_URL_LOGIN = "/api/v1/users/login"
let TOKEN;
let categoryId;



beforeAll(async()=>{
    const user = {
        email: "andrequin887@gmail.com",
        password: "Futuro"
    }

    const res = await supertest(app)
    .post(BASE_URL_LOGIN)
    .send(user)
    TOKEN = res.body.token
})

test("POST -> 'BASE_URL', should return status code 201 and res.body.name === body.name",async()=>{
    const category = {
        name: "Phone"
    }

    const res = await supertest(app)
        .post(BASE_URL)
        .send(category)
        .set("Authorization", `Bearer ${TOKEN}`)
        categoryId = res.body.id

    expect(res.status).toBe(201)
    expect(res.body.name).toBe(category.name)
});

test("GET -> 'URL_BASE' should return status code 200 and res.body.length === 1", async() => {
    const res = await supertest(app)
    .get(BASE_URL)
    
    expect(res.status).toBe(200)
}); 

test("DELETE -> 'URL_BASE', should return status code 204", async() => {
    const res = await supertest(app)
    .delete(`${BASE_URL}/${categoryId}`)
    .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)
})