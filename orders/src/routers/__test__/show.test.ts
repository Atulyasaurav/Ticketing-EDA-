import { app } from "../../app"
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import request from "supertest";
import mongoose from "mongoose";

it("fetches the order", async ()=>{

    const user = global.signin()

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),

        title: "concert",
        price: 234
    })

    await ticket.save();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)



    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie",user)
        .send()
        .expect(200 )

    expect(fetchedOrder.id).toEqual(order.id)

})

it("Error for unauthorsed actor", async ()=>{

    const user = global.signin()

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),

        title: "concert",
        price: 234
    })

    await ticket.save();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)



    const { body: fetchedOrder } = await request(app)
        .get(`/api/orders/${order.id}`)
        .set("Cookie",global.signin())
        .send()
        .expect(401)


})
