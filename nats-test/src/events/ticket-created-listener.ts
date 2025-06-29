import {Message} from "node-nats-streaming";
import Subjects from "../../../common/src/events/subjects";
import Listener from "../../../common/src/events/base-listener";
import TicketCreatedEvent from "../../../common/src/events/ticket-created-event";


class TicketCreatedListener extends Listener<TicketCreatedEvent>{

    readonly subject = Subjects.TicketCreated
    queueGroupName = "payment-service"

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {

        console.log("Event Data! ", data);

        console.log(data.id);
        console.log(data.price);


        msg.ack();
    }


}

export default TicketCreatedListener