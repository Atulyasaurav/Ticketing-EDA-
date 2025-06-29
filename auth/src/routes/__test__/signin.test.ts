import request from "supertest";
import app from "../../app"

it("fail when an email that does not exist", async () => {
    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "test123"
        })
        .expect(400)
})


it("fails when an incorrect password in supplied", async () => {

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "test123"
        })
        .expect(201)

    await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "incorrect"
        })
        .expect(400)
})

it("Response with a cookie when given valid credential", async () => {

    await request(app)
        .post("/api/users/signup")
        .send({
            email: "test@test.com",
            password: "test123"
        })
        .expect(201)

    const response = await request(app)
        .post("/api/users/signin")
        .send({
            email: "test@test.com",
            password: "test123"
        })
        .expect(200)

    expect(response.get("Set-Cookie")).toBeDefined();
})