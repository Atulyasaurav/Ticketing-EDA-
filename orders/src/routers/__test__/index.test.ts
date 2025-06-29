import { app } from "../../app"
import request from "supertest"

import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";


const createTicket = async () => {

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),

        title: "Concert",
        price: 22
    })

    await ticket.save()

    return ticket

}

it("Fetch order for a particular user", async ()=>{

    const ticketOne = await createTicket();
    const ticketTwo = await createTicket();
    const ticketThree = await createTicket();

    const userOne = global.signin()
    const userTwo = global.signin()

    await request(app)
        .post("/api/orders")
        .set("Cookie", userOne)
        .send({ ticketId: ticketOne.id })
        .expect(201)

    await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticketTwo.id })
        .expect(201)


    await request(app)
        .post("/api/orders")
        .set("Cookie", userTwo)
        .send({ ticketId: ticketThree.id })
        .expect(201)


    const response2 = await request(app)
        .get("/api/orders")
        .set("Cookie", userTwo)
        .expect(200)

    const response1 = await request(app)
        .get("/api/orders")
        .set("Cookie", userOne)
        .expect(200)

    expect(response2.body.length).toEqual(2)

})