
import {OrderCreatedEvent, Publisher, Subjects} from "@abhitickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    readonly subject = Subjects.OrderCreated

}