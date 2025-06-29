import { OrderCreatedListener } from "../order-created-listener";

import { natsWrapper } from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedEvent, OrderStatus} from "@abhitickets/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

const setup = async () => {

    const listener = new OrderCreatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        title: "Concert",
        price: 123,
        userId: "asdf"
    });

    await ticket.save();

    const data: OrderCreatedEvent["data"] = {

        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: "asdf",
        expiresAt: "FAKE",
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg, ticket }

}


it("sets the userId of the ticekt", async()=>{

    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage( data, msg );

    const updatedTicket = await Ticket.findById(ticket.id)

    expect(updatedTicket!.orderId).toEqual(data.id)
} )


it("ack the message", async () => {

    const { listener, data, msg, ticket } = await setup();

    await listener.onMessage( data, msg );

    expect(msg.ack).toHaveBeenCalled();
})