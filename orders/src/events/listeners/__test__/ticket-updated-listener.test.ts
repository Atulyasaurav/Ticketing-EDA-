import { TicketUpdatedListener } from "../ticket-updated-listener";
import { Ticket } from "../../../models/ticket";

import {natsWrapper} from "../../../nats-wrapper";

import mongoose  from "mongoose";
import {TicketUpdatedEvent} from "@abhitickets/common";
import {Message} from "node-nats-streaming";



const setup = async () => {

    const listener =  new TicketUpdatedListener(natsWrapper.client);

    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: "Concert",
        price: 99
    });

    await ticket.save();

    const data: TicketUpdatedEvent["data"] = {

        id: ticket.id,
        version: ticket.version + 1,
        title: "New Concert",
        price: 199,
        userId: "asdf"

    }

    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return { listener, ticket, data, msg}

}

it("Create Update Save ticket", async ()=>{


    const { listener, ticket, data, msg} = await setup();

    await listener.onMessage(data,msg)

    const updatedTicket = await Ticket.findById(ticket.id);

    expect(updatedTicket!.title).toEqual(data.title)
    expect(updatedTicket!.price).toEqual(data.price)
    expect(updatedTicket!.version).toEqual(data.version)


})

it("acks the message", async () => {

    const { listener, data, msg } = await setup();

    await listener.onMessage( data, msg );

    expect(msg.ack).toHaveBeenCalled();
})

it("does not call ack if version is in future", async () => {

    const { data, msg, listener } = await setup();

    data.version = 1000;

    try{
        await listener.onMessage(data,msg);

    }catch(err){}

    expect(msg.ack).not.toHaveBeenCalled();


})