import { Order } from "../../models/order"
import { Ticket } from "../../models/ticket"

import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

import { OrderStatus } from "@abhitickets/common"

import request from "supertest";
import { app } from "../../app";

it("Deleting the order", async()=>{


    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "new Concert",
        price: 22
    })


    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204)


    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it("Order cancelled emitting an event", async()=>{


    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),

        title: "new Concert",
        price: 22
    })


    await ticket.save();

    const user = global.signin();

    const { body: order } = await request(app)
        .post("/api/orders")
        .set("Cookie", user)
        .send({
            ticketId: ticket.id
        })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set("Cookie", user)
        .send()
        .expect(204)

    expect(natsWrapper.client.publish).toHaveBeenCalled()
})