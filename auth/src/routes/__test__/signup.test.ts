import request from "supertest";

import app from "../../app";

it("return a 201 on successfull signup", async () => {

    return request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "test123",
        })
        .expect(201);
})



it("return a 400 with an invalid email", async () => {

    return request(app)
        .post("/api/users/signup")
        .send({
            email: "testtest.com",
            password: "test123",
        })
        .expect(400);
})

it("return a 400 with an invalid password", async () => {

    return request(app)
        .post("/api/users/signup")
        .send({
            email: "testtest.com",
            password: "1",
        })
        .expect(400);
})


it("return a 400 with an missing email or password", async () => {

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com"
        })
        .expect(400);

    await request(app)
        .post("/api/users/signup")
        .send({
            password: "test123"
        })
        .expect(400);
})

it("Disallow duplicate email!", async () => {

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "test123"
        })
        .expect(201);

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "test123"
        })
        .expect(400);
})

it("Disallow duplicate email!", async () => {

    const response = await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "test123"
        })
        .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined()


})
