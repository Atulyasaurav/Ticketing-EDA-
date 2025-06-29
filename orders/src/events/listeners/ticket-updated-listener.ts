import {TicketUpdatedEvent} from "@abhitickets/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Ticket} from "../../models/ticket";
import { Listener } from "@abhitickets/common";
import { Subjects } from "@abhitickets/common";


export class TicketUpdatedListener extends Listener<TicketUpdatedEvent>{

    readonly subject = Subjects.TicketUpdated
    queueGroupName = queueGroupName

    async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {

        const { id, title, price, version } = data;

        const ticket = await Ticket.findByEvent(data)

        if( !ticket ){
            throw new Error("Ticket Not Found..!");
        }

        ticket.set({ title, price, version})

        await ticket.save();

        msg.ack();

    }

}