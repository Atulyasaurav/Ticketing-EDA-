import mongoose from "mongoose"
import { app } from "../../app"
import request from 'supertest'
import {Ticket} from "../../models/ticket";
import {Order} from "../../models/order";
import {OrderStatus} from "@abhitickets/common";

import {natsWrapper} from "../../nats-wrapper";



it("return an error if the ticket does not exists", async ()=>{

    const ticketId = new mongoose.Types.ObjectId();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ticketId})
        .expect(404)

})

it("return an error if the ticekt is already reserved", async ()=>{

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),

        title: "concert",
        price: 22
    })

    await ticket.save();

    const order = Order.build({
        ticket,
        userId: "flajsdjaflsdaj",
        status: OrderStatus.Created,
        expiresAt: new Date()
    })

    await order.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({ ticketId: ticket.id})
        .expect(400)
})

it("reserve a ticket", async ()=>{

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),

        title: "concert",
        price: 22
    })

    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)


})


it("emits an roder created event", async()=>{



    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),

        title: "concert",
        price: 22
    })

    await ticket.save();

    await request(app)
        .post("/api/orders")
        .set("Cookie", global.signin())
        .send({
            ticketId: ticket.id
        })
        .expect(201)

    expect(natsWrapper.client.publish).toHaveBeenCalled();

})