

import { Subjects, Publisher, TicketCreatedEvent } from "@abhitickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
