import request from "supertest";
import app from "../../app"

import { signup } from "../../test/auth-helper";

it("testing Current user cookies", async () => {


    const cookie = await signup();


    if (!cookie) {
        throw new Error("Cookie not set after signup");
    }


    const response = await request(app)
        .get("/api/users/currentuser")
        .set("Cookie", cookie)
        .send()
        .expect(200)


    expect(response.body.currentUser.email).toEqual("test@test.com");
})

it("testing Current user cookies to be null", async () => {

    const response = await request(app)
        .get("/api/users/currentuser")
        .send()
        .expect(200)

    expect(response.body.currentUser).toEqual(null)

})


