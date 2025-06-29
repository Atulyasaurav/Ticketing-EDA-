import { TicketCreatedListener } from "../ticket-created-listener";
import { Ticket } from "../../../models/ticket";

import { TicketCreatedEvent } from "@abhitickets/common";

import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {natsWrapper} from "../../../nats-wrapper";


const setup = async () =>{

    const listener = new TicketCreatedListener(natsWrapper.client);

    const data:  TicketCreatedEvent["data"] = {

        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: "Arjit",
        price: 199,
        userId: new mongoose.Types.ObjectId().toHexString()

    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, data, msg}

}


it("create and save a ticket", async () => {
    const { listener, data, msg } = await setup();

    await listener.onMessage( data, msg )

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title)
    expect(ticket!.price).toEqual(data.price)
})

it("acks the message", async () => {

    const { listener, data, msg } = await setup();

    await listener.onMessage( data, msg );

    expect(msg.ack).toHaveBeenCalled();
})