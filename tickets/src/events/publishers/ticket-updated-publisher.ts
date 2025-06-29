import { Publisher, Subjects, TicketUpdatedEvent } from '@abhitickets/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
