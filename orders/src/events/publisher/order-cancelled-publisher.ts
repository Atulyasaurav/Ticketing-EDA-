import {OrderCancelledEvent, Publisher, Subjects} from "@abhitickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    readonly subject = Subjects.OrderCancelled
}