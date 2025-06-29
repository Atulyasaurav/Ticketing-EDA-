import {Listener, OrderCreatedEvent, Subjects} from "@abhitickets/common"
import { Ticket } from "../../models/ticket";

import {Message} from "node-nats-streaming";


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated;

    queueGroupName = "tickets-service";

    async onMessage( data: OrderCreatedEvent["data"], msg: Message){

        const ticket = await Ticket.findById(data.ticket.id);

        if( !ticket ){
            throw new Error("Ticket Not Found")
        }

        ticket.set({orderId: data.id})

        await ticket.save();

        msg.ack();

    }
}