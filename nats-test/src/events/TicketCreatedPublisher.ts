import Publisher from "@abhitickets/common/build/events/base-publisher";
import TicketCreatedEvent from "@abhitickets/common/build/events/ticket-created-event";
import Subjects from "@abhitickets/common/build/events/subjects";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated;
}


export default TicketCreatedPublisher