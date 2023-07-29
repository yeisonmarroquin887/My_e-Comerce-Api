const supertest = require("supertest")
const app = require('../app')

const BASE_URL = '/api/v1/users'
let Token;
let userId;

beforeAll(async()=>{
    const user = {
        email: "andrequin887@gmail.com",
        password: "Futuro"
    }

    const res = await supertest(app)
    .post(`${BASE_URL}/login`)
    .send(user)

    Token = res.body.token
})

test("GET -> 'URL_BASE', should return status code 200 and res.body to have length 1", async() => {
    const res = await supertest(app)
        .get(BASE_URL)
        .set('Authorization', `Bearer ${Token}`)
        
    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(1)
});

test("POST -> 'URL_BASE' should return code 201 and res.body.firstName === user.firstName", async() => {
    const craeteUser = {
        firstName: "Yeison Andres",
        lastName: "Marroquin Bernal",
        email: "andrequin997@gmail.com",
        password: "Futuro",
        phone: "3227222010"
    }
    const res = await supertest(app)
    .post(BASE_URL)
    .send(craeteUser)
    userId = res.body.id
    
    expect(res.status).toBe(201)
    expect(res.body.firstName).toBe(craeteUser.firstName)
});

test("PUT -> 'URL_BASE/:id' should return code 200 and res.body.firstName = updateUser.firstName", async()=>{
    const updateUser = {
        firstName: "Yeison Andres"
    }

    const res = await supertest(app)
    .put(`${BASE_URL}/${userId}`)
    .send(updateUser)
    .set('Authorization', `Bearer ${Token}`)
   
    expect(res.status).toBe(200)
    expect(res.body.firstName).toBe(updateUser.firstName)
});

test("POST -> 'URL_BASE/login', should return status code 200 res.body.email === body.email and token defined", async()=>{
    const userLogin = {
        email: "andrequin997@gmail.com",
        password: "Futuro"
    }

    const res = await supertest(app)
    .post(`${BASE_URL}/login`)
    .send(userLogin)

    expect(res.status).toBe(200)
    expect(res.body.user.email).toBe(userLogin.email)
    expect(res.body.token).toBeDefined()
});

test("POST -> 'URL_BASE/login', should return status code 401", async()=>{
    const userLogin = {
        email: "andrequin997@gmail.com",
        password: "invalid password"
    }

    const res = await supertest(app)
    .post(`${BASE_URL}/login`)
    .send(userLogin)

    expect(res.status).toBe(401)
})

test("DELETE -> 'URL_BASE/:id' should return status code 204", async() => {
    const res = await supertest(app)
    .delete(`${BASE_URL}/${userId}`)
    .set('Authorization', `Bearer ${Token}`)
    expect(res.status).toBe(204)
})